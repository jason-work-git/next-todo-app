'use client';

import { getTaskById } from '@/lib/actions/task/controller';

import { useQuery } from '@tanstack/react-query';

import { DateSelect } from '@/components/date-select';
import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Text } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

import { Task } from '@prisma/client';
import useUpdateTaskMutation from '@/hooks/useUpdateTaskMutation';

export const Test = ({ task }: { task: Task }) => {
  const { mutate } = useUpdateTaskMutation();

  return (
    <>
      <DrawerHeader>
        <div className="flex gap-2 items-center">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(value: boolean) => {
              mutate({ id: task.id, completed: value });
            }}
            className="size-5 rounded-full"
          />
          <DrawerTitle className="text-start peer-data-[state=checked]:line-through peer-data-[state=checked]:text-muted-foreground">
            {task.title}
          </DrawerTitle>
        </div>
        <div className="flex gap-2">
          <Text className="size-5 text-muted-foreground" />
          <DrawerDescription className="text-start flex-1">
            {task.description}
          </DrawerDescription>
        </div>
      </DrawerHeader>
      <div className="px-4">
        <DateSelect
          onSelectValue={(dueDate) => {
            mutate({ id: task.id, dueDate: dueDate });
          }}
          initialDate={task.dueDate}
        />
      </div>

      <DrawerFooter>
        <Button>Save</Button>
      </DrawerFooter>
    </>
  );
};

export function TaskDetails({ taskId }: { taskId: string }) {
  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getTaskById(taskId),
    queryKey: ['tasks', taskId],
  });

  if (isLoading) {
    return <DrawerTitle>Loading...</DrawerTitle>;
  }

  if (error) {
    return <DrawerTitle>Error: {error.message}</DrawerTitle>;
  }

  if (!task) {
    return <DrawerTitle>Task not found</DrawerTitle>;
  }

  return <Test task={task} />;
}
