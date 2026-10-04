/**
 * chatApi.ts
 *
 * Supabase client + Edge Function invoker for the `chat-test` function.
 * Uses the official @supabase/supabase-js SDK — handles auth headers,
 * CORS, and response parsing automatically.
 */

import { createClient } from '@supabase/supabase-js';
import { WizardState } from '../types';

const supabaseUrl     = 'https://dqsutbeliwalpwscupgg.supabase.co';
const supabaseAnonKey = 'sb_publishable_g4ikPsbB58aXzbFRXT4Ahw_O1ryZF1s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Calls the `chat-test` Edge Function via the Supabase SDK and returns
 * the AI-generated reply string.
 *
 * @param userMessage - The customer's message.
 * @param wizardState - The full wizard configuration (products, policies, tone, etc.).
 * @returns The AI reply text.
 * @throws An Error with the Supabase error message if the invocation fails.
 */
export async function callChatTest(
  userMessage: string,
  wizardState: WizardState
): Promise<string> {
  const { data, error } = await supabase.functions.invoke('chat-test', {
    body: { userMessage, wizardState },
  });

  if (error) {
    throw new Error(error.message || 'Failed to call chat-test edge function');
  }

  if (!data?.reply || typeof data.reply !== 'string') {
    throw new Error('Unexpected response shape from chat-test function.');
  }

  return data.reply;
}
