import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  creator: z.string(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  assignee: z.object({
    name: z.string(),
    avatar: z.string().optional(),
  }).optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export const ColumnSchema = z.object({
    id: z.string(),
    title: z.string(),
    tasks: z.array(TaskSchema),
});

export type Column = z.infer<typeof ColumnSchema>;
