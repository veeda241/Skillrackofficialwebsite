'use client';

import { useEffect, useState, useMemo } from 'react';
import type { Column, Task } from '@/app/types/tasks';
import { fetchTasks, updateTaskStatus } from '@/app/actions/tasks';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { TaskColumn } from './task-column';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TaskCard } from './task-card';
import { createPortal } from 'react-dom';
import type { User } from '@/lib/users';

export function TaskBoard({ user }: { user: Omit<User, 'password'> | null }) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const getTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchTasks();
      if (result.success && result.data) {
        setColumns(result.data.columns);
      } else {
        setError(result.error || 'Failed to fetch tasks.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeId)
    );
    const overColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === overId) || col.id === overId
    );

    if (!activeColumn) return;

    // This handles dropping a task into a new column
    if (activeColumn.id !== overColumn?.id) {
        const newStatus = overColumn?.id as Task['status'];
        if (newStatus && user) {
            await updateTaskStatus(activeId.toString(), newStatus, user.name);
            getTasks(); // Refresh data from server
        }
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setColumns((columns) => {
        const activeIndex = columns.findIndex((col) =>
          col.tasks.some((task) => task.id === activeId)
        );
        const overIndex = columns.findIndex((col) =>
          col.tasks.some((task) => task.id === overId)
        );
        const activeColumn = columns[activeIndex];
        const overColumn = columns[overIndex];

        if (!activeColumn || !overColumn) return columns;

        if (activeColumn.id === overColumn.id) {
          const activeTaskIndex = activeColumn.tasks.findIndex(
            (t) => t.id === activeId
          );
          const overTaskIndex = overColumn.tasks.findIndex(
            (t) => t.id === overId
          );

          activeColumn.tasks = arrayMove(
            activeColumn.tasks,
            activeTaskIndex,
            overTaskIndex
          );

          return [...columns];
        }

        // Dropping task into a different column
        const activeTaskIndex = activeColumn.tasks.findIndex(
          (t) => t.id === activeId
        );
        const [movedTask] = activeColumn.tasks.splice(activeTaskIndex, 1);
        movedTask.status = overColumn.id as Task['status'];
        if (user) {
            movedTask.assignee = { name: user.name };
        }


        const overTaskIndex = overColumn.tasks.findIndex(
          (t) => t.id === overId
        );
        overColumn.tasks.splice(overTaskIndex, 0, movedTask);

        return [...columns];
      });
    }

    // Im dropping a Task over a column
    const isOverAColumn = over.data.current?.type === 'Column';
    if (isActiveATask && isOverAColumn) {
        setColumns((columns) => {
            const activeIndex = columns.findIndex((col) =>
              col.tasks.some((task) => task.id === activeId)
            );
            const activeColumn = columns[activeIndex];
            if (!activeColumn) return columns;

            const overColumnIndex = columns.findIndex(col => col.id === overId);
            const overColumn = columns[overColumnIndex];
            if (!overColumn) return columns;
            
            if (activeColumn.id === overColumn.id) return columns;

            const activeTaskIndex = activeColumn.tasks.findIndex((t) => t.id === activeId);
            const [movedTask] = activeColumn.tasks.splice(activeTaskIndex, 1);
            movedTask.status = overColumn.id as Task['status'];
            if(user) {
                movedTask.assignee = { name: user.name };
            }
            overColumn.tasks.push(movedTask);

            return [...columns];
        });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex h-full flex-grow gap-4 overflow-x-auto p-1">
        {isLoading && (
          <>
            <div className="flex flex-col w-72 flex-shrink-0 gap-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="flex flex-col w-72 flex-shrink-0 gap-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="flex flex-col w-72 flex-shrink-0 gap-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </>
        )}
        {error && (
          <Alert variant="destructive" className="w-full">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading &&
          !error &&
          columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              onTaskAdded={getTasks}
              user={user}
            />
          ))}
      </div>
      {typeof document !== "undefined" && createPortal(
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
