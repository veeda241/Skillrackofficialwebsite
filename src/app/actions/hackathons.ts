'use server';

import type { Hackathon, HackathonUpdatesOutput } from '@/app/types/hackathon-updates';
import { revalidatePath } from 'next/cache';

// In a real application, you would fetch this data from a database.
// For now, we are storing it in-memory. This will reset on server restart.
const MOCK_HACKATHONS: Hackathon[] = [];


export async function fetchHackathonUpdates(): Promise<{ success: true; data: HackathonUpdatesOutput } | { success: false; error: string }> {
  try {
    // We are returning mock data here. In a real application,
    // you would fetch this from a database.
    return { success: true, data: { hackathons: MOCK_HACKATHONS } };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function addHackathon(hackathon: Hackathon): Promise<{ success: true } | { success: false; error: string }> {
    try {
        MOCK_HACKATHONS.unshift(hackathon);
        revalidatePath('/dashboard');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}
