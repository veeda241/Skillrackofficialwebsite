'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const recommendedUsers = [
  { name: 'Ada Lovelace', email: 'ada.lovelace@example.com', fallback: 'AL' },
  { name: 'Grace Hopper', email: 'grace.hopper@example.com', fallback: 'GH' },
  { name: 'Alan Turing', email: 'alan.turing@example.com', fallback: 'AT' },
];

type RecommendedAccountsProps = {
    onLogin: (values: { email: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
}

export function RecommendedAccounts({ onLogin }: RecommendedAccountsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAccountClick = (user: typeof recommendedUsers[0]) => {
    startTransition(async () => {
      const result = await onLogin({ email: user.email, password: 'password' }); // Using a dummy password
      if (result.success) {
        router.push('/dashboard');
      } else {
        toast({
          title: 'Login Failed',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-2">
          {recommendedUsers.map((user) => (
            <button
              key={user.email}
              onClick={() => handleAccountClick(user)}
              disabled={isPending}
              className="flex w-full items-center gap-4 rounded-md p-2 text-left transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            >
              <Avatar>
                <AvatarFallback>{user.fallback}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
