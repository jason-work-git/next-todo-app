import prisma from '@/prisma-client';
import { User } from '@prisma/client';
import { UpdateUserDto } from './types';

function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } });
}

function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } });
}

function createUser(name: string, email: string, password: string) {
  return prisma.user.create({
    data: { email, password, name },
  });
}

function updateUser(userId: User['id'], data: UpdateUserDto) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function normalizeUser({ password, ...user }: User) {
  return user;
}

export const userService = {
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  normalizeUser,
};
