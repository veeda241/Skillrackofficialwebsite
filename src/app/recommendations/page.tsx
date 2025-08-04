'use client';

import { useState } from 'react';
import { RecommendationForm } from '@/components/recommendations/recommendation-form';
import { RecommendationResults } from '@/components/recommendations/recommendation-results';
import type { CourseRecommendationOutput } from '@/ai/flows/course-recommendation';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<CourseRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <RecommendationForm
          setRecommendations={setRecommendations}
          setIsLoading={setIsLoading}
          setError={setError}
          isLoading={isLoading}
        />
      </div>
      <div className="lg:col-span-2">
        <RecommendationResults
          recommendations={recommendations}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
