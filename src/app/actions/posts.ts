'use server';

import type { Post } from '@/app/types/posts';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

const postsFilePath = path.join(process.cwd(), 'src', 'data', 'posts.json');

async function getPostsFromFile(): Promise<Post[]> {
    try {
        const data = await fs.readFile(postsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function savePostsToFile(posts: Post[]): Promise<void> {
    await fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2));
}

export async function fetchPosts(): Promise<{ success: true; data: { posts: Post[] } } | { success: false; error: string }> {
  try {
    const posts = await getPostsFromFile();
    return { success: true, data: { posts } };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function addPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<{ success:true } | { success: false; error: string }> {
    try {
        const allPosts = await getPostsFromFile();
        const newPost: Post = {
            ...post,
            id: Date.now().toString(), // Simple unique ID
            createdAt: new Date().toISOString(),
        };
        allPosts.unshift(newPost);
        await savePostsToFile(allPosts);
        
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
        let allPosts = await getPostsFromFile();
        const index = allPosts.findIndex((p) => p.id === postId);
        if (index > -1) {
            allPosts.splice(index, 1);
            await savePostsToFile(allPosts);
        }
        revalidatePath('/posts');
        return { success: true };
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}