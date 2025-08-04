'use server';

import { getHackathonUpdates } from '@/ai/flows/hackathon-updates';
import type { Hackathon, HackathonUpdatesOutput } from '@/app/types/hackathon-updates';
import { revalidatePath } from 'next/cache';

// This is a simple in-memory store. In a real application, this would be a database.
let allHackathons: Hackathon[] | null = null;

async function initializeHackathons() {
    if (allHackathons === null) {
        // Start with an empty list. The AI will not be used to populate initial data.
        allHackathons = []; 
    }
}

export async function fetchHackathonUpdates(): Promise<{ success: true; data: HackathonUpdatesOutput } | { success: false; error: string }> {
  try {
    await initializeHackathons();
    return { success: true, data: { hackathons: allHackathons || [] } };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function addHackathon(hackathon: Omit<Hackathon, 'id'>): Promise<{ success:true } | { success: false; error: string }> {
    try {
        await initializeHackathons();
        const newHackathon: Hackathon = {
            ...hackathon,
            id: Date.now().toString(), // Simple unique ID
        };
        // Add the new hackathon to the beginning of the list.
        if (allHackathons) {
            allHackathons.unshift(newHackathon);
        } else {
            allHackathons = [newHackathon];
        }
        
        // Revalidate the dashboard path to ensure it fetches the updated list.
        revalidatePath('/dashboard');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}

export async function removeHackathon(hackathonId: string): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await initializeHackathons();
        if (allHackathons) {
            const index = allHackathons.findIndex((h) => h.id === hackathonId);
            if (index > -1) {
                allHackathons.splice(index, 1);
            }
        }
        revalidatePath('/dashboard');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}