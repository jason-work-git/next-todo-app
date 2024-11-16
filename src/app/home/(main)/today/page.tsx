'use client';

import { AddTaskButton } from '@/components/add-task-button';
import { TaskCard } from '@/components/task-card';

import { getTasks } from '@/lib/actions/task/controller';
import { useQuery } from '@tanstack/react-query';
import { filterTodayTasks, getFormattedDate } from '@/lib/utils';

export default function MainPage() {
  const formattedToday = getFormattedDate(new Date());

  const { data, isLoading } = useQuery({
    queryFn: getTasks,
    queryKey: ['tasks'],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No tasks found</div>;
  }

  const tasks = filterTodayTasks(data);

  return (
    <>
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-center">Today</h1>
      </header>

      <h2 className="font-medium text-muted-foreground mb-2">
        {formattedToday}
      </h2>

      <div className="flex-grow overflow-y-auto space-y-2 p-px">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
        <AddTaskButton defaultDueDate={new Date()} />
      </div>
    </>
  );
}
