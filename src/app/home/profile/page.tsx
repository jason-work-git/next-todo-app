'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { signOut } from '@/auth';
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '@/lib/actions/user/controller';

export default function Page() {
  const [name, setName] = useState('');
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

  useEffect(() => {
    const loaderName = async () => {
      const response = await fetch('/api/user');
      const data = await response.json();
      setName(data.name);
    };
    if (typeof window !== 'undefined') {
      loaderName();
    }
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
      <div className="space-y-2 max-w-md w-full">
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue="name@example.com" disabled />
      </div>
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
