'use server';

import { UpdateUserDto } from './types';
import { userService } from './service';
import { requireAuth } from '../auth/middlewares';
import { revalidatePath } from 'next/cache';

export const updateUser = requireAuth(
  async ({ session }, data: Pick<UpdateUserDto, 'name' | 'password'>) => {
    const user = await userService.updateUser(session.user.id, data);
    const normalizedUser = userService.normalizeUser(user);

    revalidatePath('/home/profile');

    return normalizedUser;
  },
);
