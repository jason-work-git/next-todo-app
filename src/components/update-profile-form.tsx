import React, { ComponentProps } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from '@prisma/client';
import { updateUser } from '@/actions/user/controller';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LoadingButton } from './ui/loading-button';

export type Props = ComponentProps<'form'> & {
  user: Pick<User, 'name' | 'email'>;
};

const UpdateProfileForm: React.FC<Props> = ({ user }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;

    mutate({ name });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Label className="flex flex-col gap-2">
        Name
        <Input name="name" defaultValue={user.name ?? ''} />
      </Label>

      <Label className="flex flex-col gap-2">
        Email
        <Input name="email" value={user.email} disabled />
      </Label>

      <LoadingButton type="submit" isLoading={isPending}>
        Save
      </LoadingButton>
    </form>
  );
};

export default UpdateProfileForm;
