'use client';

import { Button } from '@/components/ui/button';

import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState } from 'react';
import { DateSelect } from './date-select';
import { cn } from '@/lib/utils';

export type EditFormData = {
  title: string;
  description: string | null;
  dueDate: Date | null;
};

export const EditTaskForm = ({
  onSubmit,
  initialState,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  initialState: EditFormData;
  onSubmit: (formData: EditFormData) => void;
}) => {
  const [formData, setFormData] = useState<EditFormData>(initialState);
  const isChanged =
    formData.title !== initialState.title ||
    formData.description !== initialState.description ||
    formData.dueDate?.getDate() !== initialState.dueDate?.getDate();

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
      className={cn('px-4 flex flex-col gap-4', className)}
      {...props}
    >
      <Label className="flex flex-col gap-2">
        Title
        <Input
          name="title"
          required
          value={formData.title}
          onChange={onChange}
        />
      </Label>
      <Label className="flex flex-col gap-2">
        Description
        <Textarea
          name="description"
          value={formData.description || ''}
          onChange={onChange}
        />
      </Label>
      <div className="flex flex-col gap-2 items-start">
        <span className="text-sm font-medium leading-none">Due date</span>
        <DateSelect
          // disabled={isPending}
          selectedDate={formData.dueDate}
          onSelectDate={(value) => setFormData({ ...formData, dueDate: value })}
        />
      </div>

      <Button disabled={!isChanged} type="submit">
        Save
      </Button>
    </form>
  );
};
