/**
 * chatApi.ts
 *
 * Supabase client + Edge Function invoker for the `chat-test` function.
 * Uses the official @supabase/supabase-js SDK — handles auth headers,
 * CORS, and response parsing automatically.
 */

import { createClient } from '@supabase/supabase-js';
import { WizardState } from '../types';

export const supabaseUrl = 'https://dqsutbeliwalpwscupgg.supabase.co';
const supabaseAnonKey = 'sb_publishable_g4ikPsbB58aXzbFRXT4Ahw_O1ryZF1s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatHistoryMessage {
  role: 'user' | 'model';
  text: string;
}

/**
 * Calls the `chat-test` Edge Function via the Supabase SDK and returns
 * the AI-generated reply string.
 *
 * @param userMessage - The customer's message.
 * @param wizardState - The full wizard configuration (products, policies, tone, etc.).
 * @param history - Recent conversation turns (excluding userMessage) so follow-ups keep context.
 * @returns The AI reply text plus isCheckout (true only when a catalog product was identified).
 * @throws An Error with the Supabase error message if the invocation fails.
 */
export async function callChatTest(
  userMessage: string,
  wizardState: WizardState,
  history: ChatHistoryMessage[] = []
): Promise<{ reply: string; isCheckout: boolean }> {
  const { data, error } = await supabase.functions.invoke('chat-test', {
    body: { userMessage, wizardState, history },
  });

  if (error) {
    throw new Error(error.message || 'Failed to call chat-test edge function');
  }

  if (!data?.reply || typeof data.reply !== 'string') {
    throw new Error('Unexpected response shape from chat-test function.');
  }

  return { reply: data.reply, isCheckout: data.isCheckout === true };
}

/**
 * Saves (inserts) the activated business profile into the Supabase `business_profiles` table.
 * Called when the user clicks "Activate SaleConvo" in Step 7.
 * Uses all 19 required columns as specified in the schema.
 *
 * @param state - The full wizard state at the moment of activation.
 * @returns The inserted row data or throws on error.
 */
export async function saveBusinessProfile(state: WizardState): Promise<void> {
  const { error } = await supabase.from('business_profiles').insert({
    business_name: state.businessName,
    business_category: state.businessCategory,
    business_description: state.businessDescription,
    business_website: state.businessWebsite || null,
    instagram_page: state.instagramPage || null,
    country: state.country,
    city: state.city || null,
    delivery_scope: state.deliveryScope,
    delivery_time: state.deliveryTime,
    delivery_fee: state.deliveryChargeType === 'Fixed delivery fee'
      ? state.fixedDeliveryFee
      : state.deliveryChargeType,
    return_policy: state.acceptReturns ? state.returnPolicy : 'No returns accepted',
    accepts_returns: state.acceptReturns,
    payment_methods: state.paymentMethods,
    products: state.products,
    faqs: state.faqs,
    agent_name: state.agentName || state.aiName || '',
    tone_of_voice: state.tone,
    response_style: state.responseStyle,
    raw_wizard_state: state as unknown as Record<string, unknown>,
  });

  if (error) {
    console.error('[saveBusinessProfile] Supabase insert error:', error);
    throw new Error(error.message || 'Failed to save business profile');
  }

  console.log('[saveBusinessProfile] Business profile saved successfully for:', state.businessName);
}
