'use client';

import { AddTaskButton } from '@/components/add-task-button';
import { TaskCard } from '@/components/task-card';

import { getTasks } from '@/actions/task/controller';
import { useQuery } from '@tanstack/react-query';
import { filterTodayTasks, getFormattedDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainPage() {
  const formattedToday = getFormattedDate(new Date());

  const { data, isLoading } = useQuery({
    queryFn: getTasks,
    queryKey: ['tasks'],
  });

  const tasks = data ? filterTodayTasks(data) : [];

  return (
    <>
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-center">Today</h1>
      </header>

      <h2 className="font-medium text-muted-foreground mb-2">
        {formattedToday}
      </h2>

      {isLoading ? (
        <>
          <Skeleton className="w-full h-[40px] mb-5" />
        </>
      ) : tasks.length === 0 ? (
        <div className="text-center font-medium flex justify-center items-center h-full">
          Nothing on your plate today, enjoy your free time! 🎉
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto space-y-2 p-px">
          {tasks.map((task) => (
            <TaskCard showDueDate={false} key={task.id} task={task} />
          ))}
          <AddTaskButton
            className="fixed bottom-20 right-8"
            defaultDueDate={new Date()}
          />
        </div>
      )}
    </>
  );
}
