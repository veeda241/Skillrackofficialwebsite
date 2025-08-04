'use server';
import { revalidatePath } from 'next/cache';

// In a real application, you would fetch this data from a database.
// For now, we are storing it in-memory. This will reset on server restart.
const MOCK_HACKATHONS = [
  {
    title: 'AI for Social Good Hackathon',
    description: 'Join us for a weekend of innovation, where we leverage AI to address pressing social and environmental challenges. Collaborate with experts, and make a real-world impact.',
    date: 'October 26-28, 2024',
    url: 'https://example.com/ai-for-good',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'social impact'
  },
  {
    title: 'Decentralized Future Hackathon',
    description: 'Explore the future of Web3 and decentralized technologies. Build dApps, experiment with blockchain, and compete for amazing prizes.',
    date: 'November 10-12, 2024',
    url: 'https://example.com/decentralized-future',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'blockchain crypto'
  },
  {
    title: 'HealthTech Innovators Challenge',
    description: 'A hackathon dedicated to revolutionizing healthcare. Develop solutions for patient care, medical data analysis, and telemedicine.',
    date: 'December 1-3, 2024',
    url: 'https://example.com/healthtech-innovators',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'healthcare technology'
  },
];


export async function fetchHackathonUpdates() {
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

export async function addHackathon(hackathon) {
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
