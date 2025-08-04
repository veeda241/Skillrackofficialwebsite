'use server';

import type { Hackathon } from '@/app/types/hackathon-updates';
import { revalidatePath } from 'next/cache';

// This is a simple in-memory store. In a real application, this would be a database.
// By storing it in a global object, we can ensure it persists across serverless function invocations.
if (!global.allHackathons) {
  global.allHackathons = [];
}
let allHackathons: Hackathon[] = global.allHackathons;


export async function fetchHackathonUpdates(): Promise<{ success: true; data: { hackathons: Hackathon[] } } | { success: false; error: string }> {
  try {
    // Return a deep copy to avoid mutations affecting the original array.
    return { success: true, data: { hackathons: JSON.parse(JSON.stringify(allHackathons)) } };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function addHackathon(hackathon: Omit<Hackathon, 'id'>): Promise<{ success:true } | { success: false; error: string }> {
    try {
        const newHackathon: Hackathon = {
            ...hackathon,
            id: Date.now().toString(), // Simple unique ID
        };
        // Add the new hackathon to the beginning of the list.
        allHackathons.unshift(newHackathon);
        
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
        const index = allHackathons.findIndex((h) => h.id === hackathonId);
        if (index > -1) {
            allHackathons.splice(index, 1);
        }
        revalidatePath('/dashboard');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}