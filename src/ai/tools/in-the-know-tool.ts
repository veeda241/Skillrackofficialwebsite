import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const inTheKnowTool = ai.defineTool(
  {
    name: 'inTheKnowTool',
    description: 'Provides real-time information about ongoing or upcoming hackathons and tech events.',
    inputSchema: z.object({
      query: z.string().describe('A query to search for hackathons.'),
    }),
    outputSchema: z.array(
      z.object({
        name: z.string().describe('Name of the hackathon'),
        url: z.string().url().describe('URL of the hackathon website'),
        startDate: z.string().describe('Start date of the hackathon'),
        endDate: z.string().describe('End date of the hackathon'),
        imageUrl: z.string().url().describe('URL of an image for the hackathon'),
        imageHint: z.string().describe('A hint for the image content'),
      })
    ),
  },
  async (input) => {
    // In a real application, you would fetch this data from a live API.
    // For this example, we'll return a static list of realistic hackathons.
    return [
      {
        name: 'AI for Good Global Summit',
        url: 'https://aiforgood.itu.int/',
        startDate: 'May 30-31, 2024',
        endDate: 'May 31, 2024',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'AI for good',
      },
      {
        name: 'HackZurich 2024',
        url: 'https://hackzurich.com/',
        startDate: 'September 13-15, 2024',
        endDate: 'September 15, 2024',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'collaboration coding',
      },
      {
        name: 'TechCrunch Disrupt 2024',
        url: 'https://techcrunch.com/events/techcrunch-disrupt-2024/',
        startDate: 'October 28-30, 2024',
        endDate: 'October 30, 2024',
        imageUrl: 'https://placehold.co/600x400.png',
        imageHint: 'tech conference',
      },
    ];
  }
);
