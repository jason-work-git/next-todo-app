import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

function stripUndefined<T>(obj: T) {
  const data = {} as T;
  for (const key in obj) if (obj[key] !== undefined) data[key] = obj[key];
  return { data };
}

export const CustomPrismaAdapter = (
  prisma: PrismaClient,
): ReturnType<typeof PrismaAdapter> => {
  const adapter = PrismaAdapter(prisma);
  return {
    ...adapter,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createUser: async ({ id, ...data }) => {
      const {
        data: { emailVerified, ...strippedData },
      } = stripUndefined(data);

      const user = await prisma.user.create({
        data: {
          ...strippedData,
          name: data.name || 'Anonymous',
          verified: !!emailVerified,
        },
      });

      return {
        ...data,
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  };
};
