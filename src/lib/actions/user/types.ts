import { User } from '@prisma/client';

export type UpdateUserDto = Omit<
  Partial<User> & { id: User['id'] },
  'createdAt' | 'updatedAt'
>;
