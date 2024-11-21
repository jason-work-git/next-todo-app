import Link from 'next/link';
import SignUpForm from './signup-form';
import AuthProviders from '@/components/auth-providers';

export default function SignUpPage() {
  return (
    <div className="min-w-64 w-72 flex flex-col space-y-4">
      <h1 className="text-center tracking-tight text-3xl mb-6 font-semibold">
        Create an account
      </h1>
      <SignUpForm />

      <AuthProviders />

      <span className="text-xs self-center text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={'/auth/login/'}
          className="text-primary hover:underline cursor-pointer"
        >
          Sign in
        </Link>
      </span>
    </div>
  );
}
