'use client';

import { DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

export type EditFormData = {
  title: string;
  description: string | null;
};

export const EditTaskForm = ({
  onSubmit,
  initialState,
}: {
  initialState: EditFormData;
  onSubmit: (formData: EditFormData) => void;
}) => {
  const [formData, setFormData] = useState<EditFormData>(initialState);
  const isChanged =
    formData.title !== initialState.title ||
    formData.description !== initialState.description;

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
    <form onSubmit={handleSubmit} className="px-4 space-y-2">
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
      <DrawerFooter className="px-0">
        <Button disabled={!isChanged} type="submit">
          Save
        </Button>
      </DrawerFooter>
    </form>
  );
};
