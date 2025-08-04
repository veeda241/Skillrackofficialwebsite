'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { addHackathon } from '@/app/actions/hackathons.js';

const hackathonFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  date: z.string().min(1, { message: 'Date is required.' }),
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export default function AdminHackathonsPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof hackathonFormSchema>>({
    resolver: zodResolver(hackathonFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof hackathonFormSchema>) {
    const newHackathon = {
        ...values,
        imageUrl: `https://placehold.co/600x400.png`,
        imageHint: 'custom event'
    };
    
    const result = await addHackathon(newHackathon);

    if (result.success) {
        toast({
            title: 'Hackathon Submitted!',
            description: `${values.title} has been added. You can see it on the dashboard.`,
        });
        form.reset();
    } else {
        toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive'
        });
    }
  }

  return (
    <div className="grid gap-6" suppressHydrationWarning>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Add New Hackathon</CardTitle>
          <CardDescription>
            Fill out the form below to add a new hackathon to the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hackathon Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AI for Social Good Hackathon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., October 26-28, 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/hackathon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the hackathon, its goals, and what participants can expect."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                Add Hackathon
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
