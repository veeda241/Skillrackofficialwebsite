'use server';

import type { Column, Task } from '@/app/types/tasks';
import { revalidatePath } from 'next/cache';

// This is a simple in-memory store. In a real application, this would be a database.
if (!global.allTasks) {
    global.allTasks = [];
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

export async function addTask(
  values: Pick<Task, 'title' | 'status' | 'creator'>
): Promise<{ success: true; data: Task } | { success: false; error: string }> {
  try {
    const newTask: Task = {
      ...values,
      id: `task-${Date.now()}`,
      priority: 'medium', // Default priority
    };
    allTasks.push(newTask);
    revalidatePath('/tasks');
    return { success: true, data: newTask };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: Task['status'],
  assigneeName: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const task = allTasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      if (status === 'in-progress' || status === 'done') {
        task.assignee = { name: assigneeName };
      } else {
        // If moved back to 'To Do', clear the assignee
        task.assignee = undefined;
      }
      revalidatePath('/tasks');
      return { success: true };
    }
    return { success: false, error: 'Task not found.' };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}

export async function removeTask(taskId: string): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const index = allTasks.findIndex((t) => t.id === taskId);
        if (index > -1) {
            allTasks.splice(index, 1);
            revalidatePath('/tasks');
            return { success: true };
        }
        return { success: false, error: 'Task not found.' };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}
