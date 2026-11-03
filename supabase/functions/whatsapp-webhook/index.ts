import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

serve(async (req) => {
  if (req.method === 'GET') {
    return new Response('Webhook is live', { status: 200 })
  }

  try {
    const body = await req.json()
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const message = value?.messages?.[0]

    if (!message || message.type !== 'text') {
      return new Response('OK', { status: 200 })
    }

    const customerPhone = message.from
    const messageText = message.text.body
    const waMessageId = message.id
    const customerName = value?.contacts?.[0]?.profile?.name || 'Customer'

    // 1. Fetch the latest business profile
    const { data: businessData, error: dbError } = await supabase
      .from('business_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (dbError || !businessData) {
      console.error("Database error:", dbError)
      return new Response('OK', { status: 200 }) 
    }

    // 2. Manage Conversation & Memory
    let conversationId;
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('id')
      .eq('customer_phone', customerPhone)
      .limit(1)
      .single()

    if (existingConv) {
      conversationId = existingConv.id
    } else {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert([{ business_id: businessData.id, customer_phone: customerPhone, customer_name: customerName }])
        .select('id')
        .single()
      conversationId = newConv?.id
    }

    // Save the customer's incoming message
    if (conversationId) {
      await supabase.from('messages').insert([{
        conversation_id: conversationId,
        business_id: businessData.id,
        direction: 'inbound',
        sender: 'customer',
        body: messageText,
        wa_message_id: waMessageId
      }])
    }

    // 3. Build the AI Prompt safely
    const products = businessData.products || []
    const faqs = businessData.faqs || []
    
    const systemPrompt = `
      You are ${businessData.agent_name || 'Sara'}, a sales assistant for ${businessData.business_name}.
      Tone: ${businessData.tone_of_voice}.
      About: ${businessData.about_business || businessData.business_description}.
      Delivery Fee: ${businessData.delivery_fee}.
      Return Policy: ${businessData.return_policy}.
      
      Products: ${JSON.stringify(products)}
      FAQs: ${JSON.stringify(faqs)}
      
      Rules: 
      1. Answer based ONLY on this data. 
      2. If a user asks for something not in the products, say we don't have it.
      3. Be short and direct.
    `

    // 4. Call Gemini
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: messageText }] }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
      })
    })

    const geminiData = await geminiRes.json()
    console.log("GEMINI API ERROR DETAILS:", JSON.stringify(geminiData))
    
    // Check if Gemini failed
    if (!geminiData.candidates || !geminiData.candidates[0]?.content?.parts?.[0]?.text) {
       console.error("Gemini Error:", geminiData)
       await sendWhatsAppMessage(customerPhone, "Maaf kijiyega, mujhe abhi samajh nahi aaya. Let me connect you with a human team member to help you right away!")
       return new Response('OK', { status: 200 })
    }

    const aiReply = geminiData.candidates[0].content.parts[0].text

    // 5. Save AI reply to database
    if (conversationId) {
      await supabase.from('messages').insert([{
        conversation_id: conversationId,
        business_id: businessData.id,
        direction: 'outbound',
        sender: 'ai',
        body: aiReply
      }])
    }

    // 6. Send to WhatsApp
    await sendWhatsAppMessage(customerPhone, aiReply)

    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error("Critical Error:", error)
    return new Response('Error', { status: 500 })
  }
})

async function sendWhatsAppMessage(to: string, text: string) {
  await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: text }
    })
  })
}