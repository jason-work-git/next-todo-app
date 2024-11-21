'use client';

import useCreateQueryClient from '@/hooks/useCreateQueryClient';
import { QueryClientProvider as ReactQueryProvider } from '@tanstack/react-query';

export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useCreateQueryClient();

  return (
    <ReactQueryProvider client={queryClient}>{children}</ReactQueryProvider>
  );
}
