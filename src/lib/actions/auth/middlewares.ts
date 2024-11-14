import { auth } from '@/auth';
import { Session } from 'next-auth';

type MetaData = {
  session: Session & { user: { id: string } };
};

export type Handler<P extends unknown[], R extends Promise<unknown>> = (
  metadata: MetaData,
  ...props: P
) => R;

export const requireAuth = async <
  P extends unknown[],
  R extends Promise<unknown>,
>(
  handler: Handler<P, R>,
) => {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return (...rest: P) =>
    handler({ session: session as MetaData['session'] }, ...rest);
};
