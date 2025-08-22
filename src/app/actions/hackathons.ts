'use server';

import type { Hackathon } from '@/app/types/hackathon-updates';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

const hackathonsFilePath = path.join(process.cwd(), 'src', 'data', 'hackathons.json');

async function getHackathonsFromFile(): Promise<Hackathon[]> {
    try {
        const data = await fs.readFile(hackathonsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function saveHackathonsToFile(hackathons: Hackathon[]): Promise<void> {
    await fs.writeFile(hackathonsFilePath, JSON.stringify(hackathons, null, 2));
}

export async function fetchHackathonUpdates(): Promise<{ success: true; data: { hackathons: Hackathon[] } } | { success: false; error: string }> {
  try {
    const hackathons = await getHackathonsFromFile();
    return { success: true, data: { hackathons } };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function addHackathon(hackathon: Omit<Hackathon, 'id'>): Promise<{ success:true } | { success: false; error: string }> {
    try {
        const allHackathons = await getHackathonsFromFile();
        const newHackathon: Hackathon = {
            ...hackathon,
            id: Date.now().toString(), // Simple unique ID
        };
        allHackathons.unshift(newHackathon);
        await saveHackathonsToFile(allHackathons);
        
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
        let allHackathons = await getHackathonsFromFile();
        const index = allHackathons.findIndex((h) => h.id === hackathonId);
        if (index > -1) {
            allHackathons.splice(index, 1);
            await saveHackathonsToFile(allHackathons);
        }
        revalidatePath('/dashboard');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}
