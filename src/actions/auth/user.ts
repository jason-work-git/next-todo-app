'use server';

import { redirect } from 'next/navigation';
import { hash } from 'bcryptjs';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { userService } from '../user/service';

export const register = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await userService.getUserByEmail(email);

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hash(password, 12);

  await userService.createUser(name, email, hashedPassword);
  redirect('/auth/login');
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    await signIn('credentials', { email, password });
  } catch (error) {
    if (isRedirectError(error)) {
      return;
    }

    if (error instanceof AuthError) {
      console.error(error);
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Invalid credentials.');
        default:
          throw new Error('Something went wrong.');
      }
    }

    throw error;
  }
};
