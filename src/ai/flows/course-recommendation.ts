'use server';

/**
 * @fileOverview Provides personalized course recommendations in the AI/ML domain.
 *
 * - recommendCourses - A function that generates course recommendations.
 * - CourseRecommendationInput - The input type for the recommendCourses function.
 * - CourseRecommendationOutput - The return type for the recommendCourses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseRecommendationInputSchema = z.object({
  userProfile: z
    .string()
    .describe(
      'A description of the user profile, including background, experience, and goals in AI/ML.'
    ),
  learningGoals: z
    .string()
    .describe('Specific learning goals the user wants to achieve.'),
});
export type CourseRecommendationInput = z.infer<typeof CourseRecommendationInputSchema>;

const CourseRecommendationOutputSchema = z.object({
  recommendedCourses: z
    .array(z.string())
    .describe('A list of recommended courses in AI/ML, tailored to the user profile and learning goals.'),
  reasoning: z
    .string()
    .describe('Explanation of why these courses are recommended for the user.'),
});
export type CourseRecommendationOutput = z.infer<typeof CourseRecommendationOutputSchema>;

export async function recommendCourses(
  input: CourseRecommendationInput
): Promise<CourseRecommendationOutput> {
  return recommendCoursesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseRecommendationPrompt',
  input: {schema: CourseRecommendationInputSchema},
  output: {schema: CourseRecommendationOutputSchema},
  prompt: `You are an AI course recommendation expert. Given a user profile and their learning goals, you will recommend a list of courses in AI/ML that can help them achieve their goals.

User Profile: {{{userProfile}}}
Learning Goals: {{{learningGoals}}}

Consider the user's background, experience level, and specific interests when making your recommendations. Provide a brief explanation for each recommendation.

Format your response as a JSON object with 'recommendedCourses' (an array of course titles) and 'reasoning' (explanation for each course).`,
});

const recommendCoursesFlow = ai.defineFlow(
  {
    name: 'recommendCoursesFlow',
    inputSchema: CourseRecommendationInputSchema,
    outputSchema: CourseRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
