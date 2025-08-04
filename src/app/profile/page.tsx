'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { ConnectedAppIcon } from './connected-app-icon';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email(),
  avatar: z.string().url().optional().or(z.literal('')),
});

export default function ProfilePage() {
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState('/images/avatar-placeholder.png');

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: 'Ada Lovelace',
      email: 'ada.lovelace@example.com',
      avatar: '',
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log(values);
    toast({
      title: 'Profile Updated!',
      description: 'Your changes have been saved successfully.',
    });
  }

  return (
    <div className="grid gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview} alt="User Avatar" />
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          className="max-w-xs"
                          onChange={handleAvatarChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
          <CardHeader>
              <CardTitle>Connected Apps</CardTitle>
              <CardDescription>Manage your third-party app connections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ConnectedAppIcon app="github" />
                    <div>
                        <p className="font-medium">GitHub</p>
                        <p className="text-sm text-muted-foreground">Code hosting and version control</p>
                    </div>
                </div>
                <Button variant="outline">Connect</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ConnectedAppIcon app="devpost" />
                    <div>
                        <p className="font-medium">Devpost</p>
                        <p className="text-sm text-muted-foreground">Hackathon platform</p>
                    </div>
                </div>
                <Button variant="outline">Connect</Button>
            </div>
             <Separator />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ConnectedAppIcon app="slack" />
                    <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">Team communication</p>
                    </div>
                </div>
                <Button variant="outline">Connect</Button>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
