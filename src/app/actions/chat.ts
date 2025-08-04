'use server';

import { revalidatePath } from 'next/cache';

// This is a simple in-memory store for chat messages.
// In a real application, you would use a database like Firestore.
if (!global.allMessages) {
  global.allMessages = [
    { role: 'assistant', content: 'Welcome to the global chat! Messages are not persisted and will reset periodically. Be respectful.' },
  ];
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

// Simple in-memory store
let messages: Message[] = global.allMessages;

export async function getChatMessages(): Promise<{ success: true; data: Message[] } | { success: false; error: string }> {
  try {
    // Return a deep copy
    return { success: true, data: JSON.parse(JSON.stringify(messages)) };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function sendChatMessage(messageContent: string): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const newMessage: Message = {
            role: 'user', // In a real app, this would be the user's ID/name
            content: messageContent,
        };
        messages.push(newMessage);
        
        // Keep the chat log from growing too large
        if (messages.length > 50) {
            messages.shift();
        }

        revalidatePath('/chat');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}
