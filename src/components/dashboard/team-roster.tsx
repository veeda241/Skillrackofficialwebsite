import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
import { getUsers } from '@/app/actions/auth';
import type { User } from '@/lib/users';

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


export async function TeamRoster() {
  const result = await getUsers();
  let teamMembers: Omit<User, 'password'>[] = [];
  if (result.success) {
    teamMembers = result.data;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4">
        <Users className="h-6 w-6 text-primary" />
        <CardTitle>Team Roster</CardTitle>
      </CardHeader>
      <CardContent>
        {teamMembers.length === 0 ? (
            <p className="text-muted-foreground">No users have signed up yet. Once they do, they will appear here.</p>
        ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {teamMembers.map((member) => (
                    <div key={member.email} className="flex flex-col items-center gap-2 text-center">
                        <Avatar>
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
