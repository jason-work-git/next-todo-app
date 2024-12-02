'use server';

import { hash } from 'bcryptjs';
import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { Token, TokenType, User } from '@prisma/client';
import { userService } from '@/actions/user/service';
import { mailService } from '@/actions/mail/service';
import { tokenService } from '@/actions/token/service';
import { getVerifiedToken } from '../token/controller';
import { requireAuth } from './middlewares';

export const getCurrentUser = requireAuth(async ({ session }) => {
  const user = await userService.getUserById(session.user.id);

  if (!user) {
    await signOut();
    throw new Error('User not found.');
  }

  return userService.normalizeUser(user);
});

export const register = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: User['email'];
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

  await mailService.sendVerificationEmail({
    name,
    email,
    generatedToken,
  });
};

export const login = async ({
  email,
  password,
}: {
  email: User['email'];
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
  email: User['email'];
  name: User['name'];
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

export const verifyUser = async (token: Token['token']) => {
  const { verifiedToken, user } = await getVerifiedToken(token);

  if (verifiedToken.type !== TokenType.EMAIL_VERIFICATION) {
    throw new Error('This token is not suitable for email verification.');
  }

  await userService.updateUser(user.id, { verified: true });

  await tokenService.deactivateTokenById(verifiedToken.id);
};

export const requestPasswordReset = async (email: User['email']) => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new Error("User with this email doesn't exist");
  }

  if (!user.verified) {
    throw new Error('User is not verified');
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

export const resetPassword = async ({
  newPassword,
  token,
}: {
  token: Token['token'];
  newPassword: string;
}) => {
  const { verifiedToken, user } = await getVerifiedToken(token);

  if (verifiedToken.type !== TokenType.PASSWORD_RESET) {
    throw new Error('This token is not suitable for password reset.');
  }

  if (!user.verified) {
    throw new Error('User is not verified.');
  }

  const hashedPassword = await hash(newPassword, 12);

  await userService.updateUser(verifiedToken.userId, {
    password: hashedPassword,
  });

  await tokenService.deactivateTokenById(verifiedToken.id);
};
