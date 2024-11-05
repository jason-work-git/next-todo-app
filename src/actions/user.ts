'use server';

import prisma from '@/prisma-client';
import { redirect } from 'next/navigation';
import { hash } from 'bcryptjs';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  return prisma.user.create({
    data: { email, password, name },
  });
}

export async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function login(_: string | undefined, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Please fill all fields');
  }

  try {
    await signIn('credentials', { email, password });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error(error);
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export const register = async (_: string | undefined, formData: FormData) => {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    throw new Error('Please fill all fields');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return 'User already exists';
  }

  const hashedPassword = await hash(password, 12);

  await createUser(name, email, hashedPassword);
  redirect('/auth/login');
};
