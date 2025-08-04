'use server';

import type { Post } from '@/app/types/posts';
import { revalidatePath } from 'next/cache';

// This is a simple in-memory store. In a real application, this would be a database.
// By storing it in a global object, we can ensure it persists across serverless function invocations.
if (!global.allPosts) {
  global.allPosts = [];
}
let allPosts: Post[] = global.allPosts;


export async function fetchPosts(): Promise<{ success: true; data: { posts: Post[] } } | { success: false; error: string }> {
  try {
    // Return a deep copy to avoid mutations affecting the original array.
    return { success: true, data: { posts: JSON.parse(JSON.stringify(allPosts)) } };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function addPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<{ success:true } | { success: false; error: string }> {
    try {
        const newPost: Post = {
            ...post,
            id: Date.now().toString(), // Simple unique ID
            createdAt: new Date().toISOString(),
        };
        // Add the new post to the beginning of the list.
        allPosts.unshift(newPost);
        
        revalidatePath('/posts');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}

export async function removePost(postId: string): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const index = allPosts.findIndex((p) => p.id === postId);
        if (index > -1) {
            allPosts.splice(index, 1);
        }
        revalidatePath('/posts');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}
