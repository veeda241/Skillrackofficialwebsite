'use server';

/**
 * @fileOverview Generates a list of fictional, yet realistic, hackathon events.
 *
 * - getHackathonUpdates - A function that generates hackathon event information.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  HackathonUpdatesOutput,
  HackathonUpdatesOutputSchema,
} from '@/app/types/hackathon-updates';
import { inTheKnowTool } from '@/ai/tools/in-the-know-tool';

export async function getHackathonUpdates(): Promise<HackathonUpdatesOutput> {
  return hackathonUpdatesFlow();
}

const prompt = ai.definePrompt({
  name: 'hackathonUpdatesPrompt',
  output: { schema: HackathonUpdatesOutputSchema },
  tools: [inTheKnowTool],
  prompt: `You are an event coordinator for the AI/ML community. Generate a list of 3 upcoming, fictional but realistic-sounding hackathon events. The events should be compelling and sound like real opportunities for developers. Use the inTheKnowTool to get the latest information about real-world hackathons.`,
});

const hackathonUpdatesFlow = ai.defineFlow(
  {
    name: 'hackathonUpdatesFlow',
    outputSchema: HackathonUpdatesOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
