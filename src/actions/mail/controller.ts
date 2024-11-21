'use server';

import { generateVerificationToken } from '@/lib/utils';
import { mailService } from './service';
import prisma from '@/prisma-client';
import { TokenType } from '@prisma/client';
import { userService } from '../user/service';

export const resendVerificationEmail = async ({
  email,
  name,
}: {
  email: string;
  name: string | null;
}) => {
  await prisma.token.updateMany({
    where: {
      type: TokenType.EMAIL_VERIFICATION,
    },
    data: {
      isActive: false,
    },
  });

  const generatedToken = generateVerificationToken();

  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new Error('User does not exist.');
  }

  const token = await mailService.createToken({
    userId: user.id,
    token: generatedToken,
    type: TokenType.EMAIL_VERIFICATION,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
  });

  console.log('Generated token', token.token);

  return mailService.sendVerificationEmail({
    name,
    email,
    generatedToken,
  });
};
