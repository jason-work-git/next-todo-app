'use server';

import { UpdateUserDto } from './types';
import { userService } from './service';
import { requireAuth } from '../auth/middlewares';

export const updateUser = requireAuth(
  async ({ session }, data: UpdateUserDto) => {
    return userService.updateUser(session.user.id, data);
  },
);
