'use client';

import { login } from '@/actions/auth/controller';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/ui/loading-button';
import { PasswordInput } from '@/components/ui/password-input';
import { z } from 'zod';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isPending, mutate } = useMutation({
    mutationFn: login,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      const callbackUrl = searchParams.get('callbackUrl');

      if (callbackUrl) {
        router.push(new URL(callbackUrl).toString());
      } else {
        router.push('/home');
      }
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const parsedCredentials = z
      .object({ email: z.string().email(), password: z.string().min(6) })
      .safeParse({
        email: data.get('email'),
        password: data.get('password'),
      });

    if (parsedCredentials.error) {
      if (parsedCredentials.error.formErrors.fieldErrors.email) {
        toast.error(parsedCredentials.error.formErrors.fieldErrors.email);
      }

      if (parsedCredentials.error.formErrors.fieldErrors.password) {
        toast.error(parsedCredentials.error.formErrors.fieldErrors.password);
      }

      return;
    }

    const { email, password } = parsedCredentials.data;

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
          <PasswordInput disabled={isPending} required name="password" />
        </Label>
      </div>

      <LoadingButton
        type="submit"
        isLoading={isPending}
        className="w-full font-medium"
      >
        Sign in
      </LoadingButton>
    </form>
  );
}
