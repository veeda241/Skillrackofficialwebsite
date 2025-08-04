import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Sparkles } from 'lucide-react';
import type { CourseRecommendationOutput } from '@/ai/flows/course-recommendation';
import { Badge } from '../ui/badge';

type RecommendationResultsProps = {
  recommendations: CourseRecommendationOutput | null;
  isLoading: boolean;
  error: string | null;
};

export function RecommendationResults({ recommendations, isLoading, error }: RecommendationResultsProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Skeleton className="h-6 w-1/4 mb-4" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-8 w-1/2" />
                </div>
            </div>
            <div>
                <Skeleton className="h-6 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!recommendations) {
    return (
      <Card className="flex h-full min-h-[400px] items-center justify-center shadow-lg">
        <CardContent className="text-center text-muted-foreground p-6">
          <Sparkles className="mx-auto h-12 w-12 text-primary/50 mb-4" />
          <p className="text-lg font-medium">Your course recommendations will appear here.</p>
          <p>Fill out the form to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Your Personalized Recommendations</CardTitle>
        <CardDescription>Based on your profile, here are some courses you might like.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="font-semibold mb-3 text-lg">Recommended Courses</h3>
            <div className="flex flex-wrap gap-2">
                {recommendations.recommendedCourses.map((course, index) => (
                    <Badge key={index} variant="secondary" className="text-base px-3 py-1">{course}</Badge>
                ))}
            </div>
        </div>
        <div>
            <h3 className="font-semibold mb-3 text-lg">Reasoning</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{recommendations.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
