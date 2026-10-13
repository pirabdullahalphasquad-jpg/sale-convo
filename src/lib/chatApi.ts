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
