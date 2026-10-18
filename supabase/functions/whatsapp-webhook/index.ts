/**
 * Supabase Edge Function: whatsapp-webhook
 *
 * Handles Meta's WhatsApp Cloud API webhook:
 *   - GET  → Webhook verification handshake (hub.challenge)
 *   - POST → Incoming customer message events; extracts message string,
 *            generates an AI response via Gemini (gemini-3.8-flash),
 *            and replies via Meta Graph API v26.0.
 *
 * Deploy (Meta does not send a Supabase JWT, so JWT verification must be off):
 *   supabase functions deploy whatsapp-webhook --no-verify-jwt
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// ─── Message Deduplication Cache ──────────────────────────────────────────────
const processedMessageIds = new Set<string>();
const MAX_PROCESSED_CACHE = 1000;

// ─── CORS Headers ─────────────────────────────────────────────────────────────

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Types (subset of Meta's webhook payload) ────────────────────────────────

interface WhatsAppMessage {
  from?: string;
  id?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
  interactive?: {
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description?: string };
  };
  button?: { text?: string; payload?: string };
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
}

// ─── Environment Configuration ────────────────────────────────────────────────

interface WebhookEnvConfig {
  whatsappAccessToken: string;
  whatsappPhoneNumberId: string;
  geminiApiKey: string;
}

function getEnvConfig(): WebhookEnvConfig {
  const whatsappAccessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN")?.trim();
  const whatsappPhoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")?.trim();
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY")?.trim();

  const missing: string[] = [];
  if (!whatsappAccessToken) missing.push("WHATSAPP_ACCESS_TOKEN");
  if (!whatsappPhoneNumberId) missing.push("WHATSAPP_PHONE_NUMBER_ID");
  if (!geminiApiKey) missing.push("GEMINI_API_KEY");

  if (missing.length > 0) {
    const errorMsg = `[whatsapp-webhook] Missing required environment variable(s): ${missing.join(", ")}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return {
    whatsappAccessToken,
    whatsappPhoneNumberId,
    geminiApiKey,
  };
}

// ─── System Prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
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

async function generateGeminiReply(apiKey: string, systemPrompt: string, userText: string): Promise<string> {
  const models = ["gemini-3.8-flash", "gemini-flash-latest"];
  let lastError = "";

  for (const model of models) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      const geminiPayload = {
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userText }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
          topP: 0.8,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      };

      console.log(`[whatsapp-webhook] Calling Gemini (${model}) with user text: "${userText}"`);

      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        lastError = `Model ${model} returned HTTP ${res.status}: ${errorBody}`;
        console.error(`[whatsapp-webhook] Gemini call failed on ${model}:`, lastError);
        continue;
      }

      // deno-lint-ignore no-explicit-any
      const data: any = await res.json();
      const generatedText: string | undefined =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText && generatedText.trim().length > 0) {
        return generatedText.trim();
      }

      lastError = `Model ${model} returned empty candidate parts: ${JSON.stringify(data)}`;
    } catch (networkErr) {
      lastError = networkErr instanceof Error ? networkErr.message : String(networkErr);
      console.error(`[whatsapp-webhook] Fetch error for ${model}:`, lastError);
    }
  }

  throw new Error(`Failed to generate reply with Gemini: ${lastError}`);
}

// ─── Incoming Message Processor ───────────────────────────────────────────────

/**
 * Processes an incoming WhatsApp message:
 * 1. Validates environment secrets.
 * 2. Generates an AI response using Gemini.
 * 3. Sends the reply via Meta Graph API v26.0.
 */
async function processIncomingMessage(msg: IncomingMessageInfo): Promise<void> {
  const { whatsappAccessToken, whatsappPhoneNumberId, geminiApiKey } = getEnvConfig();

  const targetPhoneNumberId = msg.phoneNumberId || whatsappPhoneNumberId;
  if (!targetPhoneNumberId) {
    throw new Error(
      "No phoneNumberId available from message metadata or WHATSAPP_PHONE_NUMBER_ID environment variable."
    );
  }

  // 1. Log before calling Gemini
  console.log("[whatsapp-webhook] Calling Gemini API to generate reply for message:", {
    from: msg.from,
    messageId: msg.messageId,
    text: msg.text,
  });

  const rawAiReply = await generateGeminiReply(geminiApiKey, buildSystemPrompt(), msg.text);

  // Clean any internal checkout markers if present
  const cleanReply = rawAiReply.replace(/\[\[CHECKOUT:[^\]]*\]\]/gi, "").trim();

  // 2. Log after calling Gemini
  console.log("[whatsapp-webhook] Gemini generated reply successfully:", cleanReply);

  // 3. Post reply to Meta Graph API v26.0
  const graphUrl = `https://graph.facebook.com/v26.0/${targetPhoneNumberId}/messages`;
  const graphPayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: msg.from,
    type: "text",
    text: {
      preview_url: false,
      body: cleanReply,
    },
  };

  console.log(`[whatsapp-webhook] Posting reply to Meta Graph API (${graphUrl}):`, {
    recipient: msg.from,
    phoneNumberId: targetPhoneNumberId,
    replyPreview: cleanReply,
  });

  const graphRes = await fetch(graphUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${whatsappAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graphPayload),
  });

  const graphResponseText = await graphRes.text();

  if (!graphRes.ok) {
    console.error(
      `[whatsapp-webhook] Meta Graph API returned error (status ${graphRes.status}):`,
      graphResponseText
    );
    throw new Error(`Meta Graph API returned status ${graphRes.status}: ${graphResponseText}`);
  }

  // 4. Log exact Graph API response
  console.log(
    `[whatsapp-webhook] Meta Graph API message sent successfully (status ${graphRes.status}):`,
    graphResponseText
  );
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req: Request): Promise<Response> => {
  // CORS Pre-flight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS, status: 200 });
  }

  // ── GET: Meta Webhook Verification Handshake ──
  if (req.method === "GET") {
    const params = new URL(req.url).searchParams;
    const mode = params.get("hub.mode");
    const token = params.get("hub.verify_token");
    const challenge = params.get("hub.challenge");

    const expectedToken = Deno.env.get("WHATSAPP_VERIFY_TOKEN");
    if (!expectedToken) {
      console.error("[whatsapp-webhook] WHATSAPP_VERIFY_TOKEN secret is not configured.");
      return new Response("Server misconfiguration: WHATSAPP_VERIFY_TOKEN not set", {
        status: 500,
        headers: CORS_HEADERS,
      });
    }

    if (mode === "subscribe" && token === expectedToken && challenge !== null) {
      console.log("[whatsapp-webhook] Webhook verification handshake successful.");
      return new Response(challenge, {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "text/plain" },
      });
    }

    console.warn("[whatsapp-webhook] Webhook verification failed (mode or token mismatch).", {
      mode,
      receivedTokenProvided: Boolean(token),
    });
    return new Response("Forbidden", { status: 403, headers: CORS_HEADERS });
  }

  // ── POST: Incoming WhatsApp Events ──
  if (req.method === "POST") {
    let rawBody = "";
    try {
      rawBody = await req.text();
      console.log("[whatsapp-webhook] Received POST webhook event. Raw body:\n", rawBody);
    } catch (readErr) {
      console.error("[whatsapp-webhook] Failed to read incoming request body:", readErr);
      return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
    }

    let payload: WhatsAppWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
    } catch (parseErr) {
      console.error("[whatsapp-webhook] Failed to parse raw body as JSON:", parseErr);
      return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
    }

    try {
      const entry = payload?.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const message = value?.messages?.[0];

      if (!message) {
        console.log("[whatsapp-webhook] No message in payload (e.g. status/delivery receipt), skipping.");
        return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
      }

      // Extract the text correctly: string from the nested WhatsApp payload
      const messageText = message.text?.body;

      if (!messageText) {
        console.log("No text body found in message, skipping Gemini.");
        return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
      }

      const from = message.from;
      const messageId = message.id || "";
      const phoneNumberId = value?.metadata?.phone_number_id || Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") || "";

      // Deduplication: prevent duplicate processing on Meta webhook retries
      if (messageId && processedMessageIds.has(messageId)) {
        console.log(`[whatsapp-webhook] Duplicate message detected (id: ${messageId}). Skipping processing.`);
        return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
      }

      if (messageId) {
        if (processedMessageIds.size >= MAX_PROCESSED_CACHE) {
          const oldestKey = processedMessageIds.values().next().value;
          if (oldestKey) processedMessageIds.delete(oldestKey);
        }
        processedMessageIds.add(messageId);
      }

      if (!from) {
        console.warn("[whatsapp-webhook] Missing 'from' field in message, skipping.");
        return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
      }

      console.log("[whatsapp-webhook] Extracted message:", {
        from,
        id: messageId,
        text: messageText,
        phoneNumberId,
      });

      // FULLY AWAIT message processing so Edge Function does not shut down prematurely
      await processIncomingMessage({
        from,
        messageId,
        text: messageText,
        phoneNumberId,
      });
    } catch (err) {
      console.error(
        "[whatsapp-webhook] Error processing incoming webhook event:\n",
        err instanceof Error ? (err.stack || err.message) : String(err)
      );
    }

    return new Response("EVENT_RECEIVED", { status: 200, headers: CORS_HEADERS });
  }

  return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
});
