'use client';

import { Plus } from 'lucide-react';

import { Button, ButtonProps } from './ui/button';
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
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { LoadingButton } from './ui/loading-button';
import { DateSelect } from './date-select';

import useAddTaskMutation from '@/hooks/useAddTaskMutation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export const AddTaskButton = ({
  defaultDueDate = null,
  className,
  ...props
}: Omit<ButtonProps, 'children' | 'asChild'> & {
  defaultDueDate?: Date | null;
}) => {
  const [isOpened, setIsOpened] = useState(false);

  const defaultValues = {
    title: '',
    description: '',
    dueDate: defaultDueDate,
  };

  // TODO: add hookform later maybe
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    dueDate: Date | null;
  }>(defaultValues);

  const { mutate } = useAddTaskMutation({
    onMutate: () => {
      setFormData(defaultValues);
      setIsOpened(false);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      title: formData.title,
      description: formData.description || null,
      dueDate: formData.dueDate,
    });
  };

  return (
    <Drawer open={isOpened} onOpenChange={setIsOpened}>
      <DrawerTrigger asChild>
        <Button
          {...props}
          size={'icon'}
          className={cn('gap-1 size-12 rounded-lg', className)}
        >
          <Plus className="!size-7" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <form onSubmit={onSubmit}>
          <DrawerHeader>
            <DrawerTitle>Add new task</DrawerTitle>
            <DrawerDescription>Add a new task to your list.</DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 flex flex-col gap-2">
            <Label className="flex flex-col gap-2">
              Title
              <Input
                required
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Some important task"
              />
            </Label>
            <Label className="flex flex-col gap-2">
              Description
              <Textarea
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Some important description"
              />
            </Label>
            <div className="flex flex-col gap-2 items-start">
              <span className="text-sm font-medium leading-none">Due date</span>
              <DateSelect
                selectedDate={formData.dueDate}
                onSelectDate={(value) =>
                  setFormData({ ...formData, dueDate: value })
                }
              />
            </div>
          </div>

          <DrawerFooter>
            <LoadingButton type="submit">Add</LoadingButton>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
