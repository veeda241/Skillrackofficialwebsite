'use server';

/**
 * @fileOverview Generates a list of fictional, yet realistic, hackathon events.
 *
 * - getHackathonUpdates - A function that generates hackathon event information.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  HackathonUpdatesOutputSchema,
} from '@/app/types/hackathon-updates';
import { inTheKnowTool } from '@/ai/tools/in-the-know-tool';

export async function getHackathonUpdates() {
  return hackathonUpdatesFlow();
}

const prompt = ai.definePrompt({
  name: 'hackathonUpdatesPrompt',
  output: { schema: HackathonUpdatesOutputSchema },
  tools: [inTheKnowTool],
  prompt: `You are an event coordinator for the AI/ML community. Generate a list of 3 upcoming, fictional but realistic-sounding hackathon events. The events should be compelling and sound like real opportunities for developers. For each event, provide a title, a short description, dates, a registration URL, a placeholder image URL from placehold.co, and a 1-2 word hint for the image. Use the inTheKnowTool to get the latest information about real-world hackathons.`,
});

const hackathonUpdatesFlow = ai.defineFlow(
  {
    name: 'hackathonUpdatesFlow',
    outputSchema: HackathonUpdatesOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output;
  }
);
