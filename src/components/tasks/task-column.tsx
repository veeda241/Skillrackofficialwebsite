'use client';

import { useMemo } from 'react';
import type { Column, Task } from "@/app/types/tasks";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { TaskCard } from "./task-card";
import { AddTaskForm } from './add-task-form';
import type { User } from '@/lib/users';

export function TaskColumn({ column, onTaskAdded, user }: { column: Column; onTaskAdded: () => void; user: Omit<User, 'password'> | null; }) {
    const tasksIds = useMemo(() => {
        return column.tasks.map((task) => task.id);
    }, [column.tasks]);

    const { setNodeRef } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    });

    return (
        <div 
            ref={setNodeRef}
            className="flex w-80 flex-shrink-0 flex-col"
        >
            <div className="flex items-center justify-between p-2">
                <h2 className="text-lg font-semibold">{column.title}</h2>
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {column.tasks.length}
                </span>
            </div>
             <div className="p-2">
                <AddTaskForm status={column.id as Task['status']} onTaskAdded={onTaskAdded} user={user} />
            </div>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-lg bg-muted/50 p-2 min-h-40">
                <SortableContext items={tasksIds}>
                    {column.tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
                 {column.tasks.length === 0 && (
                    <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20">
                        <p className="text-sm text-muted-foreground">Drop tasks here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
