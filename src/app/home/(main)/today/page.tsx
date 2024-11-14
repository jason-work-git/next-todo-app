'use client';

import { AddTaskButton } from '@/components/add-task-button';
import { TaskCard } from '@/components/task-card';

import { getTodayTasks } from '@/lib/queries/task';

import { getFormattedDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export default function MainPage() {
  const formattedToday = getFormattedDate(new Date());

  const { data: tasks, isLoading } = useQuery({
    queryFn: getTodayTasks,
    queryKey: ['tasks', 'today'],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!tasks) {
    return <div>No tasks found</div>;
  }

  return (
    <>
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-center">Today</h1>
      </header>

      <h2 className="font-medium text-muted-foreground mb-2">
        {formattedToday}
      </h2>

      <div className="flex-grow overflow-y-auto space-y-2">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
        <AddTaskButton />
      </div>
    </>
  );
}
