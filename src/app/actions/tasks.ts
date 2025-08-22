'use server';

import type { Column, Task } from '@/app/types/tasks';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

const tasksFilePath = path.join(process.cwd(), 'src', 'data', 'tasks.json');

async function getTasksFromFile(): Promise<Task[]> {
    try {
        const data = await fs.readFile(tasksFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function saveTasksToFile(tasks: Task[]): Promise<void> {
    await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
}

export async function fetchTasks(): Promise<{ success: true; data: { columns: Column[] } } | { success: false; error: string }> {
  try {
    const allTasks = await getTasksFromFile();
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

    return { success: true, data: { columns } };
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
    const allTasks = await getTasksFromFile();
    const newTask: Task = {
      ...values,
      id: `task-${Date.now()}`,
      priority: 'medium', // Default priority
    };
    allTasks.push(newTask);
    await saveTasksToFile(allTasks);
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
    const allTasks = await getTasksFromFile();
    const task = allTasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      if (status === 'in-progress' || status === 'done') {
        task.assignee = { name: assigneeName };
      } else {
        // If moved back to 'To Do', clear the assignee
        task.assignee = undefined;
      }
      await saveTasksToFile(allTasks);
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
        let allTasks = await getTasksFromFile();
        const index = allTasks.findIndex((t) => t.id === taskId);
        if (index > -1) {
            allTasks.splice(index, 1);
            await saveTasksToFile(allTasks);
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