
'use server';

import { recommendCourses, CourseRecommendationInput, CourseRecommendationOutput } from '@/ai/flows/course-recommendation';

export async function getCourseRecommendations(input: CourseRecommendationInput) {
  try {
    const result = await recommendCourses(input);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    // Return mock data on error to allow frontend development to continue
    // when the AI service is unavailable.
    const mockRecommendation: CourseRecommendationOutput = {
      recommendedCourses: [
        'Advanced Deep Learning',
        'Natural Language Processing with Transformers',
        'Reinforcement Learning in Practice',
      ],
      reasoning:
        "This is a sample recommendation because the AI service is currently unavailable. These courses are suggested based on a typical advanced user profile interested in cutting-edge AI topics.",
    };
    return { success: true, data: mockRecommendation };
  }
}
