'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { signOut, useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '@/actions/user/controller';
import { toast } from 'sonner';
import { LoadingButton } from '@/components/ui/loading-button';

export default function Page() {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    toast.error('You are not authenticated');
  }

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success('User updated successfully');
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const handleSaveChanges = () => {
    if (!session?.user?.id) {
      toast.error('User ID is missing');
      return;
    }

    mutation.mutate({
      name: session.user.name,
      id: session.user.id,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className="space-y-2 max-w-md w-full">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          defaultValue={session?.user?.name || ''}
          onChange={(e) => {
            if (session?.user) session.user.name = e.target.value;
          }}
        />
      </div>
      <div className="space-y-2 max-w-md w-full">
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue={session?.user?.email || ''} readOnly />
      </div>
      <Button className="w-full sm:w-auto" variant="outline">
        Change password
      </Button>
      <LoadingButton
        className="w-full sm:w-auto ml-1"
        onClick={handleSaveChanges}
        disabled={mutation.isPending}
        variant="default"
      >
        Save changes
      </LoadingButton>
      <Button
        className="w-full ml-1 sm:w-auto"
        variant="outline"
        onClick={() => signOut()}
      >
        Logout
      </Button>
    </div>
  );
}
