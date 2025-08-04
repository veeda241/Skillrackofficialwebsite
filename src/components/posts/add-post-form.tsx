'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addPost } from '@/app/actions/posts';

const postFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  content: z.string().min(20, { message: 'Content must be at least 20 characters.' }),
});

type AddPostFormProps = {
  onPostAdded: () => void;
};

export function AddPostForm({ onPostAdded }: AddPostFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    // In a real app, you'd get the author name from the current user's session
    const newPost = {
      ...values,
      authorName: 'Ada Lovelace',
      authorImage: `https://placehold.co/100x100.png`,
    };

    const result = await addPost(newPost);

    if (result.success) {
      toast({
        title: 'Post Submitted!',
        description: `Your post "${values.title}" has been added.`,
      });
      form.reset();
      onPostAdded();
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Understanding Transformers in NLP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog post or update here..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          style={{
            backgroundColor: 'hsl(var(--accent))',
            color: 'hsl(var(--accent-foreground))',
          }}
        >
          Submit Post
        </Button>
      </form>
    </Form>
  );
}
