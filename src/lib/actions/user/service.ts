import prisma from '@/prisma-client';
import { User } from '@prisma/client';
import { UpdateUserDto } from './types';

function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } });
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

export const userService = {
  getUserByEmail,
  createUser,
  updateUser,
};
