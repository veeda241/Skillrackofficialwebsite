import { z } from 'zod';

export const HackathonSchema = z.object({
  title: z.string().describe('The title of the hackathon event.'),
  description: z
    .string()
    .describe('A brief, engaging description of the hackathon.'),
  date: z
    .string()
    .describe('The date of the event, formatted as "Month Day-Day, Year".'),
  url: z.string().url().describe('The registration URL for the hackathon.'),
  imageUrl: z.string().url().describe('A relevant image URL for the hackathon.'),
  imageHint: z.string().describe('A one or two word hint for the image subject matter.')
});
export type Hackathon = z.infer<typeof HackathonSchema>;

export const HackathonUpdatesOutputSchema = z.object({
  hackathons: z
    .array(HackathonSchema)
    .describe(
      'A list of 3 fictional but realistic hackathon events focused on AI/ML.'
    ),
});
export type HackathonUpdatesOutput = z.infer<
  typeof HackathonUpdatesOutputSchema
>;
