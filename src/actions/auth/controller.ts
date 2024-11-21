'use server';

import { hash } from 'bcryptjs';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { userService } from '@/actions/user/service';
import { generateVerificationToken } from '@/lib/utils';
import prisma from '@/prisma-client';
import { TokenType } from '@prisma/client';
import resend from '@/lib/resend';
import { EmailTemplate } from '@/components/email-templates/email-verification-template';

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

  const user = await userService.createUser(name, email, hashedPassword);

  const generatedToken = generateVerificationToken();

  await prisma.token.create({
    data: {
      userId: user.id,
      token: generatedToken,
      type: TokenType.EMAIL_VERIFICATION,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
    },
  });

  const { error } = await resend.emails.send({
    from: 'Todo app <onboarding@resend.dev>',
    to: [email],
    subject: 'Verify your email',
    react: EmailTemplate({
      firstName: name,
      verificationUrl: `${process.env.AUTH_URL}/auth/verify?token=${generatedToken}`,
    }),
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
