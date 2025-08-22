'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const chatFilePath = path.join(process.cwd(), 'src', 'data', 'chat.json');

async function getChatMessagesFromFile(): Promise<Message[]> {
    try {
        const data = await fs.readFile(chatFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function saveChatMessagesToFile(messages: Message[]): Promise<void> {
    await fs.writeFile(chatFilePath, JSON.stringify(messages, null, 2));
}

export async function getChatMessages(): Promise<{ success: true; data: Message[] } | { success: false; error: string }> {
  try {
    const messages = await getChatMessagesFromFile();
    return { success: true, data: messages };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function sendChatMessage(messageContent: string): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const messages = await getChatMessagesFromFile();
        const newMessage: Message = {
            role: 'user', // In a real app, this would be the user's ID/name
            content: messageContent,
        };
        messages.push(newMessage);
        
        // Keep the chat log from growing too large
        if (messages.length > 50) {
            messages.shift();
        }

        await saveChatMessagesToFile(messages);

        revalidatePath('/chat');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}