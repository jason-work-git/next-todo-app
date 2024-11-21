'use server';

import { hash } from 'bcryptjs';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { TokenType } from '@prisma/client';
import { userService } from '@/actions/user/service';
import { mailService } from '@/actions/mail/service';
import { tokenService } from '@/actions/token/service';

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
    throw new Error('User already exists.');
  }

  const hashedPassword = await hash(password, 12);

  const user = await userService.createUser(name, email, hashedPassword);

  const generatedToken = tokenService.generateVerificationToken();

  await tokenService.createEmailVerificationToken({
    userId: user.id,
    token: generatedToken,
  });

  const { error } = await mailService.sendVerificationEmail({
    name,
    email,
    generatedToken,
  });

  if (error) {
    throw error;
  }
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
          throw new Error('Invalid credentials or user is not verified.');
        default:
          throw new Error('Something went wrong.');
      }
    }

    throw error;
  }
};

export const resendVerificationEmail = async ({
  email,
  name,
}: {
  email: string;
  name: string | null;
}) => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new Error('User does not exist.');
  }

  await tokenService.deactivatePreviousUserTokens({
    userId: user.id,
    type: TokenType.EMAIL_VERIFICATION,
  });

  const generatedToken = tokenService.generateVerificationToken();

  await tokenService.createEmailVerificationToken({
    userId: user.id,
    token: generatedToken,
  });

  return mailService.sendVerificationEmail({
    name,
    email,
    generatedToken,
  });
};

export const requestPasswordReset = async (email: string) => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new Error("User with this email doesn't exist");
  }

  await tokenService.deactivatePreviousUserTokens({
    userId: user.id,
    type: TokenType.PASSWORD_RESET,
  });

  const generatedToken = tokenService.generateVerificationToken();

  await tokenService.createPasswordResetToken({
    userId: user.id,
    token: generatedToken,
  });

  await mailService.sendPasswordResetEmail({
    email,
    name: user.name,
    generatedToken,
  });
};
