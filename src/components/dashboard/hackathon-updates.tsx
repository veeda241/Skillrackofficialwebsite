'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Briefcase, Terminal, Trash2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import type { Hackathon } from '@/app/types/hackathon-updates';
import Link from 'next/link';
import { fetchHackathonUpdates, removeHackathon } from '@/app/actions/hackathons';
import { useToast } from '@/hooks/use-toast';

function HackathonCard({ hackathon, onRemove }: { hackathon: Hackathon, onRemove: (id: string) => void }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(() => {
        onRemove(hackathon.id);
    });
  };

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
        <div className="p-6 flex flex-col justify-between w-full">
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
            <Button variant="destructive" onClick={handleRemove} disabled={isPending}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isPending ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function HackathonUpdates() {
  const [updates, setUpdates] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getUpdates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchHackathonUpdates();
      if (result.success && result.data) {
        setUpdates(result.data.hackathons);
      } else {
        setError(result.error || 'Failed to fetch hackathon updates.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUpdates();
  }, []);

  const handleRemoveHackathon = async (id: string) => {
    const result = await removeHackathon(id);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Hackathon removed successfully.',
      });
      // Refresh the list from the server
      getUpdates();
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      });
    }
  };


  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Briefcase className="h-6 w-6 text-primary" />
        <CardTitle>Hackathon Updates</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        )}
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && updates.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
                <p>No hackathons have been posted yet.</p>
                <p className="text-sm">Admins can add hackathons using the Admin panel.</p>
            </div>
        )}
        {!isLoading && !error && updates.length > 0 && (
            <div className="space-y-4">
                {updates.map((hackathon) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} onRemove={handleRemoveHackathon} />
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
