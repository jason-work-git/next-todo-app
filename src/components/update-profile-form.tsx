'use client';
import React, { ComponentProps } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from '@prisma/client';
import { updateUser } from '@/actions/user/controller';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LoadingButton } from './ui/loading-button';
import { cn } from '@/lib/utils';

export type Props = ComponentProps<'form'> & {
  user: Pick<User, 'name' | 'email'>;
};

const UpdateProfileForm: React.FC<Props> = ({ user, ...rest }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onError: (error) => toast.error(error.message),
    onSuccess: () => toast.success('Profile updated successfully'),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;

    mutate({ name });
    rest.onSubmit?.(e);
  };

  return (
    <form
      {...rest}
      className={cn('space-y-4 flex flex-col', rest.className)}
      onSubmit={handleSubmit}
    >
      <Label className="flex flex-col gap-2">
        Name
        <Input name="name" defaultValue={user.name ?? ''} />
      </Label>

      <Label className="flex flex-col gap-2">
        Email
        <Input name="email" value={user.email} disabled />
      </Label>

      <LoadingButton className="items-end" type="submit" isLoading={isPending}>
        Save
      </LoadingButton>
    </form>
  );
};

export default UpdateProfileForm;
