'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCourseRecommendations } from '@/app/actions/recommend';
import type { CourseRecommendationOutput } from '@/ai/flows/course-recommendation';

const formSchema = z.object({
  userProfile: z.string().min(20, { message: 'Please provide more details (at least 20 characters).' }),
  learningGoals: z.string().min(20, { message: 'Please provide more details (at least 20 characters).' }),
});

type RecommendationFormProps = {
  setRecommendations: (data: CourseRecommendationOutput | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
};

export function RecommendationForm({ setRecommendations, setIsLoading, setError, isLoading }: RecommendationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: '',
      learningGoals: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    const result = await getCourseRecommendations(values);

    if (result.success && result.data) {
      setRecommendations(result.data);
    } else {
      setError(result.error || 'An unexpected error occurred.');
    }
    setIsLoading(false);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Find Your Next Course</CardTitle>
        <CardDescription>
          Tell us about yourself and what you want to learn. Our AI will suggest the best courses for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Profile</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Computer science student with basic Python knowledge, interested in deep learning."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="learningGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I want to build and deploy my own neural networks for image recognition."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              {isLoading ? 'Analyzing...' : 'Get Recommendations'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
