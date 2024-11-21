import Link from 'next/link';
import LoginForm from './login-form';
import AuthProviders from '@/components/auth-providers';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mailService } from '@/actions/mail/service';
import { generateVerificationToken } from '@/lib/utils';

export default function LoginPage() {
  return (
    <main className="p-8 flex items-center justify-center min-h-dvh">
      <div className="min-w-64 w-72 flex flex-col space-y-4">
        <h1 className="text-center tracking-tight text-3xl font-semibold">
          Sign in
        </h1>
        <LoginForm />

        {/* TODO: add this feature later */}
        <Dialog>
          <DialogTrigger asChild>
            <span className="cursor-pointer underline-offset-4 hover:underline text-xs self-end text-muted-foreground">
              Forgot password?
            </span>
          </DialogTrigger>
          <DialogContent className="rounded w-[400px]">
            <form
              action={async (formData) => {
                'use server';

                const email = formData.get('email') as string;

                const generatedToken = generateVerificationToken();

                await mailService.sendPasswordResetEmail({
                  email,
                  name: null,
                  generatedToken,
                });
              }}
            >
              <DialogHeader>
                <DialogTitle>Please provide your email</DialogTitle>
                <DialogDescription>
                  We&apos;ll send a password reset link to the provided email
                  address
                </DialogDescription>
              </DialogHeader>

              <Input className="my-4" type="email" required name="email" />

              <DialogFooter>
                <Button type="submit">Send</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AuthProviders />

        <span className="text-xs self-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href={'/auth/signup/'}
            className="text-primary hover:underline cursor-pointer"
          >
            Sign up
          </Link>
        </span>
      </div>
    </main>
  );
}
