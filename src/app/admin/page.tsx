'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Welcome to the admin panel. Manage your application from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Here are some of the things you can do:
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader>
                    <CardTitle>Manage Hackathons</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Add or edit hackathon events that are displayed on the main dashboard.</p>
                     <Button asChild>
                        <Link href="/admin/hackathons">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Hackathon
                        </Link>
                    </Button>
                </CardContent>
             </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
