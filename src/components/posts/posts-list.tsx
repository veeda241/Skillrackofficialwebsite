'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Terminal, Trash2, User } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import type { Post } from '@/app/types/posts';
import { fetchPosts, removePost } from '@/app/actions/posts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AddPostForm } from './add-post-form';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import type { User as UserType } from '@/lib/users';


const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


function PostCard({ post, onRemove }: { post: Post, onRemove: (id: string) => void }) {
    const [isPending, startTransition] = useTransition();
    
    const handleRemove = () => {
        startTransition(() => {
            onRemove(post.id);
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={post.authorImage} alt={post.authorName} />
                        <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{post.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                            <span>{post.authorName}</span>
                            <span>&middot;</span>
                            <time dateTime={post.createdAt}>
                                {format(new Date(post.createdAt), "PPP")}
                            </time>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter>
                 <Button variant="destructive" size="sm" onClick={handleRemove} disabled={isPending}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isPending ? 'Removing...' : 'Remove'}
                </Button>
            </CardFooter>
        </Card>
    );
}

export function PostsList({ user }: { user: Omit<UserType, 'password'> | null }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const getPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchPosts();
      if (result.success && result.data) {
        setPosts(result.data.posts);
      } else {
        setError(result.error || 'Failed to fetch posts.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handlePostAdded = () => {
    setIsFormOpen(false);
    getPosts(); // Refresh the list
  }

  const handleRemovePost = async (id: string) => {
    const result = await removePost(id);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Post removed successfully.',
      });
      // Refresh the list from the server
      getPosts();
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">Community Posts</h1>
                <p className="text-muted-foreground">Browse the latest tech blogs and updates from the community.</p>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button disabled={!user}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Post
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Create a New Post</DialogTitle>
                        <DialogDescription>
                           Share your thoughts, a tech discovery, or an update with the community.
                        </DialogDescription>
                    </DialogHeader>
                    {user && <AddPostForm onPostAdded={handlePostAdded} user={user} />}
                </DialogContent>
            </Dialog>
        </div>
        
        {isLoading && (
            <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        )}
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && posts.length === 0 && (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                <p className="text-lg font-medium">No posts yet.</p>
                <p>Be the first one to share something!</p>
            </div>
        )}
        {!isLoading && !error && posts.length > 0 && (
            <div className="space-y-4">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} onRemove={handleRemovePost} />
                ))}
            </div>
        )}
    </div>
  );
}
