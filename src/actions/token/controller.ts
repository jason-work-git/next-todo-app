'use server';

import { Token } from '@prisma/client';
import { tokenService } from './service';
import { userService } from '../user/service';
import { ServerActionError, createServerAction } from '@/lib/safe-action';

export const getVerifiedToken = createServerAction(
  async (token: Token['token']) => {
    const verifiedToken = await tokenService.getTokenByToken(token);

    if (
      !verifiedToken ||
      !verifiedToken.isActive ||
      verifiedToken.expiresAt < new Date()
    ) {
      throw new ServerActionError('Token is invalid or expired.');
    }

    const user = await userService.getUserById(verifiedToken.userId);

    if (!user) {
      throw new ServerActionError(
        "User associated with this token doesn't exist.",
      );
    }

    return { verifiedToken, user };
  },
);
