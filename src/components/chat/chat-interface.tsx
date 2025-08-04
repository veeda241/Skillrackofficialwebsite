'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User } from 'lucide-react';
import { getChatMessages, sendChatMessage } from '@/app/actions/chat';

const chatFormSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
});

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof chatFormSchema>>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      message: '',
    },
  });

  const fetchMessages = async () => {
    setError(null);
    const result = await getChatMessages();
    if (result.success) {
      setMessages(result.data);
    } else {
      setError(result.error);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Set up polling to refresh messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  async function onSubmit(values: z.infer<typeof chatFormSchema>) {
    setIsLoading(true);
    
    const result = await sendChatMessage(values.message);
    if (result.success) {
        form.reset();
        await fetchMessages(); // Immediately fetch messages after sending
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle>Global Chat Room</CardTitle>
        <CardDescription>Talk with other users in real-time.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3`}>
                <Avatar className="h-8 w-8">
                   <AvatarFallback>{message.role === 'assistant' ? 'AI' : 'U'}</AvatarFallback>
                </Avatar>
                <div className={`rounded-lg px-4 py-2 max-w-[80%] bg-muted`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          {error && <p className="text-destructive text-sm mt-4">{error}</p>}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center space-x-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Type your message..." {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
