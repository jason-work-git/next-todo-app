import { auth } from '@/auth';
import { ServerActionError } from '@/lib/safe-action';
import { Session } from 'next-auth';

type Metadata = {
  session: Session & { user: { id: string } };
};

export type Handler<P extends unknown[], R extends Promise<unknown>> = (
  metadata: Metadata,
  ...props: P
) => R;

export const requireAuth =
  <P extends unknown[], R extends Promise<unknown>>(handler: Handler<P, R>) =>
  async (...rest: P): Promise<Awaited<R>> => {
    const session = await auth();

    if (!session || !session.user) {
      throw new ServerActionError('Unauthorized');
    }

    const result = await handler(
      { session: session as Metadata['session'] },
      ...rest,
    );

    return result;
  };
