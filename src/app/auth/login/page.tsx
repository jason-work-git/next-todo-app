import Link from 'next/link';
import LoginForm from './login-form';
import AuthProviders from '@/components/auth-providers';

export default function LoginPage() {
  return (
    <main className="p-8 flex items-center justify-center min-h-dvh">
      <div className="min-w-64 w-72 flex flex-col space-y-4">
        <h1 className="text-center tracking-tight text-3xl font-semibold">
          Sign in
        </h1>
        <LoginForm />

        {/* TODO: add this feature later */}
        <span className="cursor-not-allowed text-xs self-end text-muted-foreground">
          Forgot password?
        </span>

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
