import prisma from '@/prisma-client';
import { User } from '@prisma/client';

function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } });
}

function createUser(name: string, email: string, password: string) {
  return prisma.user.create({
    data: { email, password, name },
  });
}

export const userService = {
  getUserByEmail,
  createUser,
};
