'use client';

import { useEffect, useState, useMemo } from 'react';
import type { Column, Task } from '@/app/types/tasks';
import { updateTaskStatus, removeTask } from '@/app/actions/tasks';
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
import { useToast } from '@/hooks/use-toast';

type TaskBoardClientProps = {
    initialColumns: Column[];
    user: Omit<User, 'password'> | null;
    onDataRefresh: () => void;
}

export function TaskBoardClient({ initialColumns, user, onDataRefresh }: TaskBoardClientProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleRemoveTask = async (taskId: string) => {
    const result = await removeTask(taskId);
    if(result.success) {
      toast({
        title: 'Task Removed',
        description: 'The task has been successfully deleted.'
      });
      onDataRefresh();
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  }

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
            onDataRefresh();
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

  if (!isClient) return null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex h-full flex-grow gap-4 overflow-x-auto p-1">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            onTaskAdded={onDataRefresh}
            onRemoveTask={handleRemoveTask}
            user={user}
          />
        ))}
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} onRemove={() => {}} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
