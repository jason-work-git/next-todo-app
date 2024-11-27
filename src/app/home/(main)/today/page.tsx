'use client';

import { AddTaskButton } from '@/components/add-task-button';
import { TaskCard } from '@/components/task-card';

import { filterTodayTasks, getFormattedDate } from '@/lib/utils';
import { DetailedTask } from '@/actions/task/types';
import useTasksQuery from '@/hooks/useTasksQuery';

export default function MainPage() {
  const formattedToday = getFormattedDate(new Date());

  const { data, isLoading } = useTasksQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No tasks found</div>;
  }

  const tasks = filterTodayTasks(data) as DetailedTask[];

  return (
    <>
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-center">Today</h1>
      </header>

      <h2 className="font-medium text-muted-foreground mb-2">
        {formattedToday}
      </h2>

      {tasks.length === 0 && (
        <div className="text-center font-medium flex justify-center items-center h-full">
          Nothing on your plate today, enjoy your free time! 🎉
        </div>
      )}

      <div className="flex-grow overflow-y-auto space-y-2 p-px pb-4">
        {tasks.map((task) => {
          return (
            <TaskCard
              shared={task.assignments?.length > 1}
              showDueDate={false}
              key={task.id}
              task={task}
            />
          );
        })}
        <AddTaskButton
          className="fixed bottom-20 right-8 "
          defaultDueDate={new Date()}
        />
      </div>
    </>
  );
}
