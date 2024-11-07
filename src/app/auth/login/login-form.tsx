'use client';

import { login } from '@/actions/user';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function LoginForm() {
  const { isPending, mutate } = useMutation({
    mutationFn: login,
    onError: (error) => {
      console.log(error);
      toast.error(error.message, {
        richColors: true,
        duration: 5000,
        closeButton: true,
      });
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    mutate({ email, password });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 mb-6">
        <Label className="flex flex-col gap-2">
          Email
          <Input
            required
            type="email"
            name="email"
            placeholder="name@example.com"
          />
        </Label>
        <Label className="flex flex-col gap-2">
          Password
          <Input required type="password" name="password" />
        </Label>
      </div>

      <Button disabled={isPending} className="w-full font-medium">
        Sign in
      </Button>
    </form>
  );
}
