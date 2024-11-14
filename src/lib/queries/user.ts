import { auth } from '@/auth';
import prisma from '@/prisma-client';

export async function getUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export const getUserId = async () => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return session.user.id as string;
};
