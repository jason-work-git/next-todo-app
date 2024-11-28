import Link from 'next/link';
import LoginForm from './login-form';
import AuthProviders from '@/components/auth-providers';
import ForgotPasswordFlow from '@/components/forgot-password-flow';

export default function LoginPage() {
  return (
    <div className="min-w-64 w-72 flex flex-col space-y-4">
      <h1 className="text-center tracking-tight text-3xl font-semibold">
        Sign in
      </h1>
      <LoginForm />
      <ForgotPasswordFlow
        trigger={
          <span className="cursor-pointer underline-offset-4 hover:underline text-xs self-end text-muted-foreground">
            Forgot password?
          </span>
        }
      />
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
  );
}
