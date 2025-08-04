'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addTask } from '@/app/actions/tasks';
import type { Task } from '@/app/types/tasks';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@/lib/users';

const taskFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
});

type AddTaskFormProps = {
  status: Task['status'];
  onTaskAdded: () => void;
  user: Omit<User, 'password'> | null;
};

export function AddTaskForm({ status, onTaskAdded, user }: AddTaskFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
    },
  });

  async function onSubmit(values: z.infer<typeof taskFormSchema>) {
    if (!user) {
        toast({
            title: 'Error',
            description: 'You must be logged in to add a task.',
            variant: 'destructive',
        });
        return;
    }

    setIsSubmitting(true);
    const result = await addTask({ ...values, status, creator: user.name });

    if (result.success) {
      toast({
        title: 'Task Added!',
        description: `"${values.title}" has been added.`,
      });
      form.reset();
      onTaskAdded();
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start space-x-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Add a new task..." {...field} className="h-9" disabled={!user} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
            type="submit"
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            disabled={isSubmitting || !user}
            style={{
                backgroundColor: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))',
            }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
