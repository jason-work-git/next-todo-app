'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export type Props = { children: React.ReactNode };

const AuthLayout: React.FC<Props> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home');
    }
  }, [status, router]);

  if (status === 'authenticated') {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;
