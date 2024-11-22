'use server';

import { Token } from '@prisma/client';
import { tokenService } from './service';
import { userService } from '../user/service';

export const getVerifiedToken = async (token: Token['token']) => {
  const verifiedToken = await tokenService.getTokenByToken(token);

  if (
    !verifiedToken ||
    !verifiedToken.isActive ||
    verifiedToken.expiresAt < new Date()
  ) {
    throw new Error('Token is invalid or expired.');
  }

  const user = await userService.getUserById(verifiedToken.userId);

  if (!user) {
    throw new Error("User associated with this token doesn't exist.");
  }

  return { verifiedToken, user };
};
