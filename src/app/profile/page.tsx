import { getCurrentUser } from '@/app/actions/auth';
import { ProfileForm } from './profile-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ConnectedApps } from './connected-apps';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Please log in to view your profile.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/login">Go to Login</Link>
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="grid gap-6">
      <ProfileForm user={user} />
      <ConnectedApps />
    </div>
  );
}
