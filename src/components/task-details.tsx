'use client';

import { Text } from 'lucide-react';

import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Checkbox } from '@/components/ui/checkbox';
import { DateSelect } from '@/components/date-select';
import { DeleteTaskButton } from './delete-task-button';
import { EditTaskButton } from './edit-task-button';

import { Task } from '@prisma/client';
import { useTaskDrawerData } from './task-drawer-provider';
import useUpdateTaskMutation from '@/hooks/useUpdateTaskMutation';

export const TaskDetails = ({ task }: { task: Task }) => {
  const { mutate } = useUpdateTaskMutation();
  const { close } = useTaskDrawerData();

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
        {task.description ? (
          <div className="flex gap-2">
            <Text className="size-5 text-muted-foreground" />
            <DrawerDescription className="text-start flex-1">
              {task.description}
            </DrawerDescription>
          </div>
        ) : (
          <DrawerDescription hidden>No description</DrawerDescription>
        )}
      </DrawerHeader>
      <div className="px-4">
        <DateSelect
          onSelectDate={(dueDate) => {
            mutate({ id: task.id, dueDate: dueDate });
          }}
          selectedDate={task.dueDate}
        />
      </div>

      <DrawerFooter>
        <EditTaskButton task={task} />
        <DeleteTaskButton taskId={task.id} onDelete={close} />
      </DrawerFooter>
    </>
  );
};
