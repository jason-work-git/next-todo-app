'use client';

import { Button } from './ui/button';
import { LoadingButton } from './ui/loading-button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { useState } from 'react';
import {
  DialogClose,
  DialogProps,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import { AddTaskForm } from './add-task-form';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

type Props = Omit<DialogProps, 'children' | 'open' | 'onOpenChange'> & {
  trigger?: React.ReactNode;
  defaultDueDate?: Date | null;
  onAdd?: () => void;
};

export const AddTaskFlow = ({
  trigger: propsTrigger,
  defaultDueDate = null,
  onAdd,
  ...props
}: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const trigger = propsTrigger ?? <Button>Add task</Button>;

  const title = 'Add new task';

  const description = 'Add a new task to your list';

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <AddTaskForm
            defaultValues={{
              title: '',
              description: '',
              dueDate: defaultDueDate,
            }}
            onSettled={onAdd}
          >
            <DialogFooter>
              <LoadingButton type="submit">Add</LoadingButton>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </AddTaskForm>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpened} onOpenChange={setIsOpened} {...props}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <AddTaskForm
          className="px-4"
          defaultValues={{
            title: '',
            description: '',
            dueDate: defaultDueDate,
          }}
          onSettled={onAdd}
        />

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
