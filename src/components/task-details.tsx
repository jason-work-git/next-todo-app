'use client';

import { getTaskById } from '@/actions/task/controller';

import { useQuery } from '@tanstack/react-query';

import { DateSelect } from '@/components/date-select';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Text } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button, ButtonProps } from '@/components/ui/button';

import { Task } from '@prisma/client';
import useUpdateTaskMutation from '@/hooks/useUpdateTaskMutation';
import { DeleteTaskButton } from './delete-task-button';
import { useTaskDrawerData } from './task-drawer-provider';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

// TODO: refactor this shit
// probably make task global or smth like that
const EditTaskButton = ({
  task,
  ...props
}: Omit<ButtonProps, 'children' | 'asChild'> & {
  task: Task;
}) => {
  const initialState = {
    title: task.title,
    description: task.description,
  };
  const [formData, setFormData] = useState(initialState);
  const isChanged = JSON.stringify(formData) !== JSON.stringify(initialState);

  const [open, setOpen] = useState(false);

  const { mutate } = useUpdateTaskMutation({ onMutate: () => setOpen(false) });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        <form onSubmit={onSubmit} className="px-4 space-y-2">
          <Label>
            Title
            <Input
              name="title"
              required
              value={formData.title}
              onChange={onChange}
            />
          </Label>
          <Label>
            Description
            <Textarea
              name="description"
              value={formData.description || ''}
              onChange={onChange}
            />
          </Label>
          <DrawerFooter className="px-0">
            <Button disabled={!isChanged} type="submit">
              Save
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export const Test = ({ task }: { task: Task }) => {
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

const AriaLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DrawerTitle>{children}</DrawerTitle>
      <DrawerDescription hidden>{children}</DrawerDescription>
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
    return <AriaLayout>Loading...</AriaLayout>;
  }

  if (error) {
    return <AriaLayout>Error: {error.message}</AriaLayout>;
  }

  if (!task) {
    return <AriaLayout>Task not found</AriaLayout>;
  }

  return <Test task={task} />;
}
