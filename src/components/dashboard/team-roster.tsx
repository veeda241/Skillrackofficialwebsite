import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

const teamMembers = [
  { id: 'ada.lovelace', name: 'Ada Lovelace', avatar: 'AL' },
  { id: 'grace.hopper', name: 'Grace Hopper', avatar: 'GH' },
  { id: 'alan.turing', name: 'Alan Turing', avatar: 'AT' },
  { id: 'john.v.neumann', name: 'John von Neumann', avatar: 'JN' },
  { id: 'm.hamilton', name: 'Margaret Hamilton', avatar: 'MH' },
];

export function TeamRoster() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Users className="h-6 w-6 text-primary" />
        <CardTitle>Team Roster</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">User registration and team management features are coming soon!</p>
      </CardContent>
    </Card>
  );
}
