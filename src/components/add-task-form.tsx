import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { DateSelect } from './date-select';

import useAddTaskMutation from '@/hooks/useAddTaskMutation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type FormData = {
  title: string;
  description: string;
  dueDate: Date | null;
};

type Props = React.HTMLAttributes<HTMLFormElement> & {
  onSettled?: () => void;
  onMutate?: () => void;
  defaultValues: FormData;
};

export const AddTaskForm = ({
  onSettled,
  onMutate,
  defaultValues,
  className,
  children,
  ...props
}: Props) => {
  // TODO: add hookform later maybe
  const [formData, setFormData] = useState<FormData>(defaultValues);

  const { mutate } = useAddTaskMutation({
    onMutate: onMutate,
    onSettled: () => {
      setFormData(defaultValues);

      if (onSettled) {
        onSettled();
      }
    },
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      ...formData,
      description: formData.description || null,
    });
  };

  return (
    <form
      onSubmit={submit}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col gap-2">
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
      {children}
    </form>
  );
};
