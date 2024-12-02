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
import {
  createServerAction,
  createServerActionHandler,
  ServerActionError,
} from '@/lib/safe-action';

export const getCurrentUser = createServerAction(
  requireAuth(async ({ session }) => {
    const user = await userService.getUserById(session.user.id);

    if (!user) {
      await signOut();
      throw new ServerActionError('User not found.');
    }

    return userService.normalizeUser(user);
  }),
);

export const register = createServerAction(
  async ({
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
      throw new ServerActionError('User already exists.');
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
  },
);

export const login = createServerAction(
  async ({ email, password }: { email: User['email']; password: string }) => {
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
            throw new ServerActionError(
              'Invalid credentials or user is not verified.',
            );
          default:
            throw new ServerActionError('Something went wrong.');
        }
      }

      throw error;
    }
  },
);

export const resendVerificationEmail = createServerAction(
  async ({ email, name }: { email: User['email']; name: User['name'] }) => {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw new ServerActionError('User does not exist.');
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
  },
);

export const verifyUser = createServerAction(async (token: Token['token']) => {
  const { verifiedToken, user } =
    await createServerActionHandler(getVerifiedToken)(token);

  if (verifiedToken.type !== TokenType.EMAIL_VERIFICATION) {
    throw new ServerActionError(
      'This token is not suitable for email verification.',
    );
  }

  await userService.updateUser(user.id, { verified: true });

  await tokenService.deactivateTokenById(verifiedToken.id);
});

export const requestPasswordReset = createServerAction(
  async (email: User['email']) => {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw new ServerActionError("User with this email doesn't exist");
    }

    if (!user.verified) {
      throw new ServerActionError('User is not verified');
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
  },
);

export const resetPassword = createServerAction(
  async ({
    newPassword,
    token,
  }: {
    token: Token['token'];
    newPassword: string;
  }) => {
    const { verifiedToken, user } =
      await createServerActionHandler(getVerifiedToken)(token);

    if (verifiedToken.type !== TokenType.PASSWORD_RESET) {
      throw new ServerActionError(
        'This token is not suitable for password reset.',
      );
    }

    if (!user.verified) {
      throw new ServerActionError('User is not verified.');
    }

    const hashedPassword = await hash(newPassword, 12);

    await userService.updateUser(verifiedToken.userId, {
      password: hashedPassword,
    });

    await tokenService.deactivateTokenById(verifiedToken.id);
  },
);
