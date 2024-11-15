'use server';

import { UpdateUserDto } from './types';
import { userService } from './service';
import { requireAuth } from '../auth/middlewares';

export const updateUser = await requireAuth(
  async ({ session }, data: UpdateUserDto) => {
    return userService.updateUser(session.user.id, data);
  },
);
