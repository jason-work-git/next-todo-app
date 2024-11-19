'use client';

import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { DeleteTaskButton } from './delete-task-button';

import { Task } from '@prisma/client';
import { useTaskDrawerData } from './task-drawer-provider';
import useUpdateTaskMutation from '@/hooks/useUpdateTaskMutation';
import { EditFormData, EditTaskForm } from './edit-task-form';

export const TaskDetails = ({ task }: { task: Task }) => {
  const { close } = useTaskDrawerData();
  const { mutate } = useUpdateTaskMutation({
    onMutate: () => close(),
  });

  const handleSubmit = (formData: EditFormData) => {
    mutate({
      id: task.id,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
    });
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Edit task</DrawerTitle>
        <DrawerDescription>Provide new task details</DrawerDescription>
      </DrawerHeader>
      <EditTaskForm
        className="pb-0"
        initialState={{
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
        }}
        onSubmit={handleSubmit}
      />

      <DrawerFooter>
        <DeleteTaskButton taskId={task.id} onDelete={close} />
      </DrawerFooter>
    </>
  );
};
