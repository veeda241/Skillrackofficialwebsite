'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Briefcase, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchHackathonUpdates } from '@/app/actions/hackathons';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import type { Hackathon } from '@/app/types/hackathon-updates';
import Link from 'next/link';

function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <Image
            alt={hackathon.title}
            className="h-48 w-full object-cover md:w-48"
            src={hackathon.imageUrl}
            width={200}
            height={200}
            data-ai-hint={hackathon.imageHint}
          />
        </div>
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold font-headline">{hackathon.title}</h3>
            <CardDescription className="mt-1">{hackathon.date}</CardDescription>
            <p className="mt-4 text-muted-foreground">{hackathon.description}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button asChild>
                <Link href={hackathon.url} target="_blank" rel="noopener noreferrer">
                    Register
                </Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href={hackathon.url} target="_blank" rel="noopener noreferrer">
                    Learn More
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <div className="md:flex">
                        <div className="md:flex-shrink-0">
                            <Skeleton className="h-48 w-full md:w-48" />
                        </div>
                        <div className="p-6 flex-1">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/4 mb-4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6 mt-2" />
                             <div className="mt-4">
                               <Skeleton className="h-10 w-28" />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export function HackathonUpdates() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHackathons() {
      setIsLoading(true);
      const result = await fetchHackathonUpdates();
      if (result.success && result.data) {
        setHackathons(result.data.hackathons);
      } else {
        setError(result.error || 'Failed to fetch hackathon updates.');
      }
      setIsLoading(false);
    }
    loadHackathons();
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Briefcase className="h-6 w-6 text-primary" />
        <CardTitle>Hackathon Updates</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingSkeleton />}
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && (
            <div className="space-y-6">
                {hackathons.map((hackathon) => (
                    <HackathonCard key={hackathon.title} hackathon={hackathon} />
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
