/**
 * Supabase Edge Function: whatsapp-webhook
 *
 * Handles Meta's WhatsApp Cloud API webhook:
 *   - GET  → Webhook verification handshake (hub.challenge)
 *   - POST → Incoming customer message; loads latest business profile from
 *            Supabase `business_profiles`, generates AI reply via Gemini,
 *            and posts back via Meta Graph API v26.0.
 *
 * PERFORMANCE DESIGN (solves 1-2 min latency):
 *   1. NO EdgeRuntime.waitUntil — Supabase throttles background CPU after response.
 *      Instead we await handleIncomingMessage() inline before returning 200 OK.
 *      Total round-trip target: <3.5s (Meta timeout is 5s, so Meta never retries).
 *   2. Single model "gemini-3.5-flash" with strict AbortSignal.timeout(8000).
 *      No dead fallback model retry loop (older gemini-2.0/2.5 return 404,
 *      while gemini-3.8-flash has heavy thinking that hangs >30s).
 *   3. Millisecond timing logs on every phase:
 *      - msgSentByUserAt
 *      - webhookReceivedAt
 *      - geminiStartedAt -> geminiFinishedAt
 *      - whatsappSendStartedAt -> whatsappSendFinishedAt
 *
 * Reliability safeguards:
 *   - Message ID deduplication (processedMessageIds Set, top-level)
 *   - Stale retry filter (>90s old messages are dropped immediately)
 *
 * Deploy:
 *   npx.cmd supabase functions deploy whatsapp-webhook --no-verify-jwt
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Message Deduplication Cache (top-level, shared across warm invocations) ──
const processedMessageIds = new Set<string>();
const MAX_PROCESSED_CACHE = 1000;

// ─── CORS Headers ─────────────────────────────────────────────────────────────
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface WhatsAppMessage {
  from?: string;
  id?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
}

interface WhatsAppWebhookPayload {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: {
        messaging_product?: string;
        metadata?: { display_phone_number?: string; phone_number_id?: string };
        contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>;
        messages?: WhatsAppMessage[];
        statuses?: unknown[];
      };
    }>;
  }>;
}

interface IncomingMessageInfo {
  from: string;
  messageId: string;
  text: string;
  phoneNumberId: string;
  msgSentByUserAt: number; // Unix ms when user tapped Send
  webhookReceivedAt: number; // Unix ms when Supabase received the POST
}

// ─── Environment Config ───────────────────────────────────────────────────────
function getEnvConfig() {
  const whatsappAccessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN")?.trim();
  const whatsappPhoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")?.trim();
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY")?.trim();

  const missing: string[] = [];
  if (!whatsappAccessToken) missing.push("WHATSAPP_ACCESS_TOKEN");
  if (!whatsappPhoneNumberId) missing.push("WHATSAPP_PHONE_NUMBER_ID");
  if (!geminiApiKey) missing.push("GEMINI_API_KEY");

  if (missing.length > 0) {
    const msg = `[whatsapp-webhook] Missing env vars: ${missing.join(", ")}`;
    console.error(msg);
    throw new Error(msg);
  }

  return { whatsappAccessToken, whatsappPhoneNumberId, geminiApiKey };
}

// ─── Business Profile Loader ──────────────────────────────────────────────────
// deno-lint-ignore no-explicit-any
type BusinessProfile = Record<string, any>;

async function fetchLatestBusinessProfile(): Promise<BusinessProfile | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    console.warn("[whatsapp-webhook] SUPABASE_URL/key not set — using fallback prompt.");
    return null;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("business_profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[whatsapp-webhook] business_profiles fetch error:", error.message);
      return null;
    }
    return data as BusinessProfile | null;
  } catch (err) {
    console.error("[whatsapp-webhook] business_profiles exception:", err);
    return null;
  }
}

// ─── System Prompt Builder ────────────────────────────────────────────────────
function buildDynamicSystemPrompt(profile: BusinessProfile): string {
  const name = profile.business_name || "Urban Threads";
  const description = profile.business_description || "An online store across Pakistan.";
  const agentName = profile.agent_name || "Sara";
  const tone = profile.tone_of_voice || "Friendly & Helpful";
  const responseStyle = profile.response_style || "Short & Direct";
  const deliveryScope = profile.delivery_scope || "Nationwide";
  const deliveryTime = profile.delivery_time || "2–5 business days";
  const deliveryFee = profile.delivery_fee || "PKR 200";
  const paymentMethods: string[] = Array.isArray(profile.payment_methods)
    ? profile.payment_methods
    : ["Cash on Delivery", "Bank Transfer"];
  const acceptsReturns: boolean = profile.accepts_returns !== false;
  const returnPolicy = profile.return_policy || "Returns accepted within 7 days.";

  // deno-lint-ignore no-explicit-any
  const products: any[] = Array.isArray(profile.products) ? profile.products : [];
  // deno-lint-ignore no-explicit-any
  const faqs: any[] = Array.isArray(profile.faqs) ? profile.faqs : [];

  const productsCatalog =
    products.length > 0
      ? products
          .map((p, i) => {
            const sizes = Array.isArray(p.sizes) ? p.sizes.join(", ") : p.sizes || "Standard";
            const colors = Array.isArray(p.colors)
              ? p.colors.join(", ")
              : p.colors || p.variants || "Standard";
            return `${i + 1}. ${p.name}\n   - Price: ${p.price}\n   - Sizes: ${sizes}\n   - Colors/Variants: ${colors}\n   - Description: ${p.description || ""}\n   - Availability: ${p.availability || "In Stock"}`;
          })
          .join("\n")
      : "No products configured yet.";

  const faqSection =
    faqs.length > 0
      ? faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
      : "No FAQs configured yet.";

  return `You are ${agentName}, the AI sales assistant for ${name}.

=== STORE IDENTITY & DETAILS ===
- Brand: ${name}
- Description: ${description}
- Delivery Coverage: ${deliveryScope}
- Delivery Timeline: ${deliveryTime}
- Delivery Fee: ${deliveryFee}
- Payment Methods: ${paymentMethods.join(", ")}
- Returns: ${acceptsReturns ? `Yes — ${returnPolicy}` : "No returns accepted."}

=== PRODUCT CATALOG ===
${productsCatalog}

=== FREQUENTLY ASKED QUESTIONS ===
${faqSection}

=== BEHAVIOR RULES ===
- Tone of Voice: ${tone}
- Response Style: ${responseStyle} (keep replies concise and natural for WhatsApp chat, 1-3 sentences max)
- Languages: Reply naturally in English, Urdu, or Roman Urdu matching the customer's language.
- Accuracy: Only use facts from the catalog and policies above. NEVER guess or invent products, prices, or policies.
- Order placement: If the customer wants to buy, confirm product, size/variant, recipient name, delivery address, and phone number.
- Human handoff: If customer insists on speaking to a manager or reports a severe complaint, politely assure them a human team member will contact them soon.`;
}

function buildFallbackSystemPrompt(): string {
  return `You are Sara, the friendly and helpful AI sales assistant for Urban Threads, an online fashion store offering premium casual clothing for men and women across Pakistan.

=== STORE IDENTITY & DETAILS ===
- Brand: Urban Threads (Fashion & Apparel)
- Location: Lahore, Pakistan (shipping nationwide)
- Delivery Timeline: 2 to 5 business days across Pakistan
- Delivery Charges: Flat PKR 200 nationwide (Cash on Delivery available)
- Payment Methods: Cash on Delivery (COD), Bank Transfer, Easypaisa, JazzCash
- Return & Exchange Policy: Accepted within 7 days if items are unworn, unwashed, and in original packaging

=== PRODUCT CATALOG ===
1. Premium Cotton T-Shirt
   - Price: PKR 2,499
   - Sizes: S, M, L, XL
   - Colors: Black, White, Navy
   - Description: Premium 100% cotton oversized T-shirt with comfortable ribbed crewneck. In Stock.
2. Relaxed Cargo Pants
   - Price: PKR 3,899
   - Sizes: M, L, XL
   - Colors: Charcoal, Khaki, Army Green
   - Description: Heavy-duty cotton twill relaxed fit cargo pants with 6 utility pockets. In Stock.

=== RULES & BEHAVIOR ===
- Keep answers friendly, conversational, and concise (1-3 sentences suitable for WhatsApp chat).
- Languages: Reply naturally in English, Urdu, or Roman Urdu matching the customer's language.
- Accuracy: Only use facts from the catalog and policies above. NEVER guess or invent products, prices, or policies.
- Order placement: If the customer wants to buy, confirm the product, size, color, recipient name, delivery address, and phone number.
- Human handoff: If the customer insists on speaking to a manager or reports a severe complaint, politely assure them that a human team member will contact them soon.`;
}

// ─── Gemini Generation ────────────────────────────────────────────────────────
// Single verified-fast model: gemini-3.5-flash (~1.9s P50), strict 8000ms abort.
// (gemini-2.0 and gemini-2.5 are deprecated/404; gemini-3.8-flash has heavy thinking that hangs >30s).
const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_TIMEOUT_MS = 8000;

async function generateGeminiReply(
  apiKey: string,
  systemPrompt: string,
  userText: string
): Promise<string> {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const geminiPayload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userText }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 256,
      topP: 0.8,
    },
  };

  const res = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(geminiPayload),
    signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini ${GEMINI_MODEL} HTTP ${res.status}: ${errBody}`);
  }

  // deno-lint-ignore no-explicit-any
  const data: any = await res.json();
  const generatedText: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText || generatedText.trim().length === 0) {
    throw new Error(`Gemini returned empty text: ${JSON.stringify(data)}`);
  }

  return generatedText.trim();
}

// ─── Incoming Message Handler ─────────────────────────────────────────────────
/**
 * PERFORMANCE NOTE: Awaited directly INLINE before returning HTTP 200 to Meta.
 * EdgeRuntime.waitUntil is avoided because Supabase throttles background CPU
 * after returning response, adding 60-120s latency.
 */
async function handleIncomingMessage(msg: IncomingMessageInfo): Promise<void> {
  const { whatsappAccessToken, whatsappPhoneNumberId, geminiApiKey } = getEnvConfig();
  const targetPhoneNumberId = msg.phoneNumberId || whatsappPhoneNumberId;

  // 1. Webhook delivery latency log
  const metaDeliveryDelayMs = msg.webhookReceivedAt - msg.msgSentByUserAt;
  console.log(`[TIMING] msgSentByUserAt=${new Date(msg.msgSentByUserAt).toISOString()} (${msg.msgSentByUserAt})`);
  console.log(`[TIMING] webhookReceivedAt=${new Date(msg.webhookReceivedAt).toISOString()} (${msg.webhookReceivedAt})`);
  console.log(`[TIMING] Meta delivery delay=${metaDeliveryDelayMs}ms`);

  // 2. Fetch latest business profile from Supabase
  const supabaseFetchStartedAt = Date.now();
  const profile = await fetchLatestBusinessProfile();
  const supabaseFetchFinishedAt = Date.now();
  console.log(
    `[TIMING] Supabase profile fetch=${supabaseFetchFinishedAt - supabaseFetchStartedAt}ms | profile=${profile ? profile.business_name : "null (using fallback)"}`
  );

  const systemPrompt = profile
    ? buildDynamicSystemPrompt(profile)
    : buildFallbackSystemPrompt();

  // 3. Gemini Generation with exact ms timestamps
  const geminiStartedAt = Date.now();
  console.log(
    `[TIMING] geminiStartedAt=${new Date(geminiStartedAt).toISOString()} (${geminiStartedAt}) | model=${GEMINI_MODEL} | userText="${msg.text}"`
  );

  let rawAiReply: string;
  try {
    rawAiReply = await generateGeminiReply(geminiApiKey, systemPrompt, msg.text);
  } catch (geminiErr) {
    const geminiFailedAt = Date.now();
    console.error(`[TIMING] Gemini FAILED after ${geminiFailedAt - geminiStartedAt}ms:`, geminiErr);
    rawAiReply = "Thank you for reaching out! A member of our team will get back to you shortly. 🙏";
  }

  const geminiFinishedAt = Date.now();
  console.log(
    `[TIMING] geminiFinishedAt=${new Date(geminiFinishedAt).toISOString()} (${geminiFinishedAt}) | duration=${geminiFinishedAt - geminiStartedAt}ms`
  );

  const cleanReply = rawAiReply.replace(/\[\[CHECKOUT:[^\]]*\]\]/gi, "").trim();
  console.log(`[whatsapp-webhook] AI reply: "${cleanReply}"`);

  // 4. Meta Graph API Dispatch with exact ms timestamps
  const whatsappSendStartedAt = Date.now();
  console.log(
    `[TIMING] whatsappSendStartedAt=${new Date(whatsappSendStartedAt).toISOString()} (${whatsappSendStartedAt})`
  );

  const graphUrl = `https://graph.facebook.com/v26.0/${targetPhoneNumberId}/messages`;

  const graphRes = await fetch(graphUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${whatsappAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: msg.from,
      type: "text",
      text: { preview_url: false, body: cleanReply },
    }),
    signal: AbortSignal.timeout(8000), // 8s timeout on Graph API
  });

  const whatsappSendFinishedAt = Date.now();
  const graphResponseText = await graphRes.text();
  console.log(
    `[TIMING] whatsappSendFinishedAt=${new Date(whatsappSendFinishedAt).toISOString()} (${whatsappSendFinishedAt}) | duration=${whatsappSendFinishedAt - whatsappSendStartedAt}ms | status=${graphRes.status}`
  );

  if (!graphRes.ok) {
    throw new Error(`Meta Graph API ${graphRes.status}: ${graphResponseText}`);
  }

  const totalWebhookProcessingMs = whatsappSendFinishedAt - msg.webhookReceivedAt;
  console.log(
    `[TIMING] ✅ Total webhook processing time=${totalWebhookProcessingMs}ms | ` +
    `breakdown: supabase=${supabaseFetchFinishedAt - supabaseFetchStartedAt}ms, ` +
    `gemini=${geminiFinishedAt - geminiStartedAt}ms, ` +
    `whatsappSend=${whatsappSendFinishedAt - whatsappSendStartedAt}ms`
  );
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
serve(async (req: Request): Promise<Response> => {
  // CORS Pre-flight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS, status: 200 });
  }

  // ── GET: Meta Webhook Verification ──
  if (req.method === "GET") {
    const params = new URL(req.url).searchParams;
    const mode = params.get("hub.mode");
    const token = params.get("hub.verify_token");
    const challenge = params.get("hub.challenge");
    const expectedToken = Deno.env.get("WHATSAPP_VERIFY_TOKEN");

    if (!expectedToken) {
      return new Response("Server misconfiguration: WHATSAPP_VERIFY_TOKEN not set", {
        status: 500,
        headers: CORS_HEADERS,
      });
    }

    if (mode === "subscribe" && token === expectedToken && challenge !== null) {
      console.log("[whatsapp-webhook] Verification handshake OK.");
      return new Response(challenge, {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "text/plain" },
      });
    }

    return new Response("Forbidden", { status: 403, headers: CORS_HEADERS });
  }

  // ── POST: Incoming WhatsApp Events ──
  if (req.method === "POST") {
    const webhookReceivedAt = Date.now(); // ← capture arrival timestamp immediately

    let rawBody = "";
    try {
      rawBody = await req.text();
    } catch (readErr) {
      console.error("[whatsapp-webhook] Failed to read body:", readErr);
      return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
    }

    let payload: WhatsAppWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
    } catch {
      console.error("[whatsapp-webhook] Failed to parse JSON body");
      return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
    }

    const entry = payload?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    // Skip status/delivery receipts
    if (!message) {
      return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
    }

    // Skip non-text messages
    const messageText = message.text?.body;
    if (!messageText) {
      console.log("[whatsapp-webhook] No text body — skipping.");
      return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
    }

    const from = message.from;
    const messageId = message.id || "";
    const phoneNumberId =
      value?.metadata?.phone_number_id ||
      Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") ||
      "";

    // ── 1. Deduplication ────────────────────────────────────────────────────
    if (messageId && processedMessageIds.has(messageId)) {
      console.log(`[whatsapp-webhook] Duplicate ID ${messageId} — skipping.`);
      return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
    }
    if (messageId) {
      if (processedMessageIds.size >= MAX_PROCESSED_CACHE) {
        const first = processedMessageIds.values().next().value;
        if (first) processedMessageIds.delete(first);
      }
      processedMessageIds.add(messageId);
    }

    // ── 2. Stale retry filter (>90s old dropped immediately) ────────────────
    const msgTimestampSec = Number(message.timestamp || 0);
    const nowSec = Math.floor(Date.now() / 1000);
    if (msgTimestampSec > 0 && nowSec - msgTimestampSec > 90) {
      console.log(
        `[whatsapp-webhook] Stale message (${nowSec - msgTimestampSec}s old) ${messageId} — skipping.`
      );
      return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
    }

    if (!from) {
      console.warn("[whatsapp-webhook] Missing 'from' — skipping.");
      return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
    }

    const msgSentByUserAt = msgTimestampSec > 0 ? msgTimestampSec * 1000 : webhookReceivedAt;

    console.log(
      `[whatsapp-webhook] Processing: from=${from} id=${messageId} text="${messageText}"`
    );

    // ── 3. INLINE AWAIT (No EdgeRuntime.waitUntil) ──────────────────────────
    // Awaited directly. Total target: ~2-3s, well under Meta's 5s timeout.
    // Avoids Supabase background CPU throttling.
    try {
      await handleIncomingMessage({
        from,
        messageId,
        text: messageText,
        phoneNumberId,
        msgSentByUserAt,
        webhookReceivedAt,
      });
    } catch (err) {
      console.error(
        "[whatsapp-webhook] handleIncomingMessage error:",
        err instanceof Error ? err.stack || err.message : String(err)
      );
    }

    // Return 200 OK after message processing is done
    return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
  }

  return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
});
