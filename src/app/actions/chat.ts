'use server';

import { chat, ChatInput, ChatOutput } from '@/ai/flows/chat';

export async function getChatResponse(input: ChatInput): Promise<{ success: true; data: ChatOutput } | { success: false; error: string }> {
  try {
    const result = await chat(input);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
