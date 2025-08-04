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
        <ul className="space-y-4">
          {teamMembers.map((member) => (
            <li key={member.id} className="flex items-center gap-4">
              <Avatar className='h-12 w-12'>
                <AvatarImage src={`https://placehold.co/48x48.png`} data-ai-hint="profile portrait"/>
                <AvatarFallback>{member.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.id}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
