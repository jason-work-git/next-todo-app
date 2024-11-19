'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button, ButtonProps } from '@/components/ui/button';
import { EditFormData, EditTaskForm } from './edit-task-form';

import { Task } from '@prisma/client';
import useUpdateTaskMutation from '@/hooks/useUpdateTaskMutation';
import { useState } from 'react';

export const EditTaskButton = ({
  task,
  ...props
}: Omit<ButtonProps, 'children' | 'asChild'> & {
  task: Task;
}) => {
  const [open, setOpen] = useState(false);

  const { mutate } = useUpdateTaskMutation({ onMutate: () => setOpen(false) });

  const onSubmit = (formData: EditFormData) => {
    mutate({
      id: task.id,
      title: formData.title,
      description: formData.description,
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} nested>
      <DrawerTrigger asChild>
        <Button {...props}>Edit</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit task</DrawerTitle>
          <DrawerDescription>Provide new task details</DrawerDescription>
        </DrawerHeader>
        <EditTaskForm
          initialState={{
            title: task.title,
            description: task.description,
          }}
          onSubmit={onSubmit}
        />
      </DrawerContent>
    </Drawer>
  );
};
