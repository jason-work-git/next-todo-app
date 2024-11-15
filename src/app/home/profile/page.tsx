'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { signOut } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '@/lib/actions/user/controller';

export default function Page() {
  const [name, setName] = useState('John Doe');
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      alert('User updated successfully');
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSaveChanges = () => {
    mutation.mutate({
      name,
      id: '',
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
      {/* Profile Name */}
      <div className="space-y-2 max-w-md w-full">
        <Label
          htmlFor="name"
          onClick={() => {
            usernameInputRef.current?.focus();
          }}
        >
          Name
        </Label>
        <Input
          id="name"
          ref={usernameInputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {/* Email */}
      <div className="space-y-2 max-w-md w-full">
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue="name@example.com" disabled />
      </div>
      {/* Change Password */}
      <Button className="w-full sm:w-auto" variant="outline">
        Change password
      </Button>
      <Button
        className="w-full sm:w-auto ml-1"
        onClick={handleSaveChanges}
        disabled={mutation.isPending}
        variant="default"
      >
        Save changes
      </Button>
      {/* Sign Out */}
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
