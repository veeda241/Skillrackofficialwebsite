'use server';

/**
 * @fileOverview Generates a list of fictional, yet realistic, hackathon events.
 *
 * - getHackathonUpdates - A function that generates hackathon event information.
 * - Hackathon - The type for a single hackathon event.
 * - HackathonUpdatesOutput - The return type for the getHackathonUpdates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const HackathonSchema = z.object({
  title: z.string().describe('The title of the hackathon event.'),
  description: z.string().describe('A brief, engaging description of the hackathon.'),
  date: z.string().describe('The date of the event, formatted as "Month Day-Day, Year".'),
});
export type Hackathon = z.infer<typeof HackathonSchema>;

const HackathonUpdatesOutputSchema = z.object({
  hackathons: z.array(HackathonSchema).describe('A list of 3 fictional but realistic hackathon events focused on AI/ML.'),
});
export type HackathonUpdatesOutput = z.infer<typeof HackathonUpdatesOutputSchema>;

export async function getHackathonUpdates(): Promise<HackathonUpdatesOutput> {
  return hackathonUpdatesFlow();
}

const prompt = ai.definePrompt({
  name: 'hackathonUpdatesPrompt',
  output: { schema: HackathonUpdatesOutputSchema },
  prompt: `You are an event coordinator for the AI/ML community. Generate a list of 3 upcoming, fictional but realistic-sounding hackathon events. The events should be compelling and sound like real opportunities for developers.`,
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
