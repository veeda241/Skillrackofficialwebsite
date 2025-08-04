
'use server';

import { recommendCourses, CourseRecommendationInput } from '@/ai/flows/course-recommendation';

export async function getCourseRecommendations(input: CourseRecommendationInput) {
  try {
    const result = await recommendCourses(input);
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
