'use client';

import { useEffect, useState } from 'react';
import type { Column } from '@/app/types/tasks';
import { fetchTasks } from '@/app/actions/tasks';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Terminal } from 'lucide-react';
import type { User } from '@/lib/users';
import { TaskBoardClient } from './task-board-client';

export function TaskBoard({ user }: { user: Omit<User, 'password'> | null }) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex h-full flex-grow gap-4 overflow-x-auto p-1">
        <div className="flex flex-col w-80 flex-shrink-0 gap-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex flex-col w-80 flex-shrink-0 gap-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex flex-col w-80 flex-shrink-0 gap-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive" className="w-full">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }
  
  return <TaskBoardClient initialColumns={columns} user={user} onDataRefresh={getTasks} />;
}
