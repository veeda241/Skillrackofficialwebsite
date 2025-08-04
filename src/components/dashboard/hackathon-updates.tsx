import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Briefcase } from 'lucide-react';

const hackathons = [
  {
    title: 'AI for Good Global Summit',
    description: 'Join developers, innovators, and organizations to create AI solutions for global challenges.',
    date: 'Oct 15-17, 2024',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'technology conference',
  },
  {
    title: 'MLH Hackcon',
    description: 'The flagship conference for hackathon organizers and hackers from around the world.',
    date: 'Nov 1-3, 2024',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'coding workshop',
  },
  {
    title: 'HackZurich 2024',
    description: 'Europe\'s largest hackathon. A 40-hour coding marathon to build innovative prototypes.',
    date: 'Sep 27-29, 2024',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'computer programmer',
  },
];

export function HackathonUpdates() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Briefcase className="h-6 w-6 text-primary" />
        <CardTitle>Hackathon Updates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {hackathons.map((hackathon) => (
          <Card key={hackathon.title} className="overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                 <Image
                    alt={hackathon.title}
                    className="h-48 w-full object-cover md:w-48"
                    src={hackathon.image}
                    width={200}
                    height={200}
                    data-ai-hint={hackathon.dataAiHint}
                />
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold font-headline">{hackathon.title}</h3>
                  <CardDescription className="mt-1">{hackathon.date}</CardDescription>
                  <p className="mt-4 text-muted-foreground">{hackathon.description}</p>
                </div>
                <div className="mt-4">
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
