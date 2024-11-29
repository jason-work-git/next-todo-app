'use client';

import { Button } from '@/components/ui/button';

import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState } from 'react';
import { DateSelect } from './date-select';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { TaskPriority } from '@prisma/client';

export type EditFormData = {
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority | null;
};

export const EditTaskForm = ({
  onSubmit,
  initialState,
  className,
  disabled,
  ...props
}: Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  disabled?: boolean;
  initialState: EditFormData;
  onSubmit: (formData: EditFormData) => void;
}) => {
  const [formData, setFormData] = useState<EditFormData>(initialState);
  const isChanged =
    formData.title !== initialState.title ||
    formData.description !== initialState.description ||
    formData.dueDate?.getDate() !== initialState.dueDate?.getDate() ||
    formData.priority !== initialState.priority;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-4', className)}
      {...props}
    >
      <Label className="flex flex-col gap-2">
        Title
        <Input
          disabled={disabled}
          name="title"
          required
          value={formData.title}
          onChange={onChange}
        />
      </Label>
      <Label className="flex flex-col gap-2">
        Description
        <Textarea
          disabled={disabled}
          name="description"
          value={formData.description || ''}
          onChange={onChange}
        />
      </Label>
      <div className="flex flex-col gap-2 items-start">
        <span className="text-sm font-medium leading-none">Due date</span>
        <DateSelect
          disabled={disabled}
          selectedDate={formData.dueDate}
          onSelectDate={(value) => setFormData({ ...formData, dueDate: value })}
        />
      </div>
      <Label className="flex flex-col gap-2">
        Task priority
        <Select
          disabled={disabled}
          value={formData.priority || ''}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              priority: value !== 'null' ? (value as TaskPriority) : null,
            })
          }
          name="priority"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskPriority).map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
            <SelectItem value="null">No priority</SelectItem>
          </SelectContent>
        </Select>
      </Label>

      <Button disabled={!isChanged || disabled} type="submit">
        Save
      </Button>
    </form>
  );
};
