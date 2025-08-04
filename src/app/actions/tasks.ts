'use server';

import type { Column, Task } from '@/app/types/tasks';

// This is a simple in-memory store. In a real application, this would be a database.
if (!global.allTasks) {
    global.allTasks = [
        { id: 'task-1', title: 'Setup project repository', status: 'done', priority: 'high', assignee: { name: 'Ada Lovelace' } },
        { id: 'task-2', title: 'Design database schema', status: 'done', priority: 'high', assignee: { name: 'Grace Hopper' } },
        { id: 'task-3', title: 'Implement user authentication', status: 'in-progress', priority: 'high', assignee: { name: 'Vyas' } },
        { id: 'task-4', title: 'Develop dashboard page', status: 'in-progress', priority: 'medium', assignee: { name: 'Vyas' } },
        { id: 'task-5', title: 'Create API for posts', status: 'todo', priority: 'medium' },
        { id: 'task-6', title: 'Write documentation', status: 'todo', priority: 'low' },
        { id: 'task-7', title: 'Deploy to staging environment', status: 'todo', priority: 'high' },
    ];
}
let allTasks: Task[] = global.allTasks;

export async function fetchTasks(): Promise<{ success: true; data: { columns: Column[] } } | { success: false; error: string }> {
  try {
    const columns: Column[] = [
      { id: 'todo', title: 'To Do', tasks: [] },
      { id: 'in-progress', title: 'In Progress', tasks: [] },
      { id: 'done', title: 'Done', tasks: [] },
    ];

    allTasks.forEach(task => {
        const column = columns.find(c => c.id === task.status);
        if (column) {
            column.tasks.push(task);
        }
    });

    return { success: true, data: { columns: JSON.parse(JSON.stringify(columns)) } };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}