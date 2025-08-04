'use server';

import type { Hackathon, HackathonUpdatesOutput } from '@/app/types/hackathon-updates';
import { revalidatePath } from 'next/cache';

// This is a simple in-memory store that will persist across requests in a single server instance.
// In a real application, this would be replaced with a database.
const allHackathons: Hackathon[] = [];

export async function fetchHackathonUpdates(): Promise<{ success: true; data: HackathonUpdatesOutput } | { success: false; error: string }> {
  try {
    return { success: true, data: { hackathons: allHackathons } };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function addHackathon(hackathon: Hackathon): Promise<{ success: true } | { success: false; error: string }> {
    try {
        // Add the new hackathon to the beginning of the list.
        allHackathons.unshift(hackathon);
        // Revalidate the dashboard path to ensure it fetches the updated list.
        revalidatePath('/dashboard');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}
