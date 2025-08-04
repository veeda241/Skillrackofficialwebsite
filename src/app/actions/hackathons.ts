'use server';

import { getHackathonUpdates } from '@/ai/flows/hackathon-updates';

export async function fetchHackathonUpdates() {
  try {
    const result = await getHackathonUpdates();
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
