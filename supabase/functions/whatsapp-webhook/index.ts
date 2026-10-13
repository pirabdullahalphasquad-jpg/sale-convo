/**
 * Supabase Edge Function: whatsapp-webhook
 *
 * Handles Meta's WhatsApp Cloud API webhook:
 *   - GET  → webhook verification challenge
 *   - POST → incoming message events (acknowledged immediately with 200)
 *
 * Deploy (Meta does not send a Supabase JWT, so JWT verification must be off):
 *   supabase functions deploy whatsapp-webhook --no-verify-jwt
 * Secret:
 *   supabase secrets set WHATSAPP_VERIFY_TOKEN=your_verify_token
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

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

interface IncomingMessage {
  from: string;
  messageId: string;
  text: string;
  phoneNumberId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely pulls the first message out of Meta's nested payload (null for status updates etc.). */
function extractIncomingMessage(payload: WhatsAppWebhookPayload): IncomingMessage | null {
  const value = payload?.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];
  if (!message) return null;

  const from = message.from;
  const messageId = message.id;
  if (!from || !messageId) return null;

  return {
    from,
    messageId,
    text: message.text?.body ?? "",
    phoneNumberId: value?.metadata?.phone_number_id ?? "",
  };
}

/**
 * Background processing placeholder. Runs AFTER the 200 has been returned,
 * so slow work (Gemini, Graph API) never causes Meta to retry the webhook.
 */
async function processIncomingMessage(msg: IncomingMessage): Promise<void> {
  console.log("[whatsapp-webhook] Incoming message:", JSON.stringify(msg));

  // ── TODO: Generate and send the AI reply ───────────────────────────────────
  // 1. Look up the merchant by msg.phoneNumberId (Supabase DB) to load their
  //    wizardState (products, policies, tone) and WhatsApp access token.
  // 2. Build the system prompt + call Gemini, reusing the logic from
  //    supabase/functions/chat-test/index.ts (extract buildSystemPrompt into
  //    a shared module). Pass recent conversation history for context.
  // 3. Send the reply via the Meta Graph API:
  //
  //    await fetch(`https://graph.facebook.com/v18.0/${msg.phoneNumberId}/messages`, {
  //      method: "POST",
  //      headers: {
  //        "Authorization": `Bearer ${merchantAccessToken}`,
  //        "Content-Type": "application/json",
  //      },
  //      body: JSON.stringify({
  //        messaging_product: "whatsapp",
  //        to: msg.from,
  //        type: "text",
  //        text: { body: aiReply },
  //      }),
  //    });
  // 4. De-duplicate on msg.messageId (Meta may redeliver) before replying.
  // ───────────────────────────────────────────────────────────────────────────
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS, status: 200 });
  }

  // ── GET: Meta webhook verification ──
  if (req.method === "GET") {
    const params = new URL(req.url).searchParams;
    const mode = params.get("hub.mode");
    const token = params.get("hub.verify_token");
    const challenge = params.get("hub.challenge");

    const expectedToken = Deno.env.get("WHATSAPP_VERIFY_TOKEN");
    if (!expectedToken) {
      console.error("[whatsapp-webhook] WHATSAPP_VERIFY_TOKEN secret is not set.");
      return new Response("Server misconfiguration", { status: 500, headers: CORS_HEADERS });
    }

    if (mode === "subscribe" && token === expectedToken && challenge !== null) {
      console.log("[whatsapp-webhook] Webhook verified.");
      return new Response(challenge, {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "text/plain" },
      });
    }

    console.warn("[whatsapp-webhook] Verification failed (mode/token mismatch).");
    return new Response("Forbidden", { status: 403, headers: CORS_HEADERS });
  }

  // ── POST: incoming WhatsApp events ──
  if (req.method === "POST") {
    try {
      const payload = (await req.json()) as WhatsAppWebhookPayload;
      const incoming = extractIncomingMessage(payload);

      if (incoming) {
        // Do not await: acknowledge Meta instantly; process in the background.
        processIncomingMessage(incoming).catch((err) =>
          console.error("[whatsapp-webhook] Processing error:", err)
        );
      } else {
        console.log("[whatsapp-webhook] Event without a user message (e.g. delivery status); ignoring.");
      }
    } catch (err) {
      // Still return 200 so Meta doesn't retry a malformed/unparseable event forever.
      console.error("[whatsapp-webhook] Failed to parse payload:", err);
    }

    return new Response("OK", { status: 200, headers: CORS_HEADERS });
  }

  return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
});
