import { TaskBoard } from '@/components/tasks/task-board';
import { getCurrentUser } from '@/app/actions/auth';

export default async function TasksPage() {
  const user = await getCurrentUser();
  return <TaskBoard user={user} />;
}
