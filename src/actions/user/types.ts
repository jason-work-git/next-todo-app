import { User } from '@prisma/client';

export type UpdateUserDto = Omit<Partial<User>, 'createdAt' | 'updatedAt'>;
