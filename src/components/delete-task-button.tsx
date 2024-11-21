import { Button, ButtonProps } from './ui/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from './ui/drawer';

import { Task } from '@prisma/client';

import useDeleteTaskMutation from '@/hooks/useDeleteTaskMutation';
import { useState } from 'react';

export const DeleteTaskButton = ({
  taskId,
  onDelete,
  ...props
}: Omit<ButtonProps, 'children' | 'asChild'> & {
  taskId: Task['id'];
  onDelete?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { mutate } = useDeleteTaskMutation({
    onMutate: () => {
      setOpen(false);
    },
    onSettled: () => {
      if (onDelete) {
        onDelete();
      }
    },
  });

  return (
    <Drawer open={open} onOpenChange={setOpen} nested>
      <DrawerTrigger asChild>
        <Button variant={'outline'} {...props}>
          Delete
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your
            task.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DrawerClose>
          <Button
            onClick={() => mutate({ id: taskId })}
            variant={'destructive'}
          >
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
