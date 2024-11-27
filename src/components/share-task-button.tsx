'use client';

import { Button, ButtonProps } from './ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Share } from 'lucide-react';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Task, TaskRole } from '@prisma/client';
import { z } from 'zod';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { useMutation } from '@tanstack/react-query';
import { shareTask } from '@/actions/assignment/controller';
import { LoadingButton } from './ui/loading-button';
import { useState } from 'react';

const availableRoles = Object.values(TaskRole).filter(
  (role) => role !== TaskRole.OWNER,
);

const schema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(TaskRole).refine((role) => role !== 'OWNER', {
    message: 'Role OWNER is not allowed.',
  }),
});

export const ShareTaskButton = ({
  taskId,
  ...props
}: Omit<ButtonProps, 'children' | 'asChild'> & { taskId: Task['id'] }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: shareTask,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success('Task has been shared successfully');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const parsedFields = schema.safeParse({
      email: formData.get('email'),
      role: formData.get('role'),
    });

    if (parsedFields.error) {
      const errors = parsedFields.error.formErrors.fieldErrors;

      if (errors.email) {
        toast.error(errors.email);
      }

      if (errors.role) {
        toast.error(errors.email);
      }

      return;
    }

    const { email, role } = parsedFields.data;

    mutate({ taskId, email, role });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button {...props}>
          <Share /> Share
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share task</DrawerTitle>
          <DrawerDescription>
            Share this task with someone else
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={onSubmit} className="px-4 pb-4 space-y-4">
          <Label className="flex flex-col gap-2">
            Email
            <Input disabled={isPending} required type="email" name="email" />
          </Label>
          <Label className="flex flex-col gap-2">
            Role
            <Select
              disabled={isPending}
              required
              name="role"
              defaultValue={TaskRole.VIEWER}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem value={role} key={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>

          <LoadingButton isLoading={isPending} className="w-full">
            Share
          </LoadingButton>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
