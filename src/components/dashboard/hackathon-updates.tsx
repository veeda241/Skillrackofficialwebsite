'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Briefcase, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
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

export function HackathonUpdates() {

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Briefcase className="h-6 w-6 text-primary" />
        <CardTitle>Hackathon Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
            <p>No hackathons have been posted yet.</p>
            <p className="text-sm">Check back later for updates!</p>
        </div>
      </CardContent>
    </Card>
  );
}
