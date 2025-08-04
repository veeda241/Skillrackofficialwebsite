import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorName: z.string(),
  authorImage: z.string().optional(),
  createdAt: z.string(),
});

export type Post = z.infer<typeof PostSchema>;
