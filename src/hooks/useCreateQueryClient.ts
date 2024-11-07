import { useState } from 'react';
import { QueryClient } from '@tanstack/react-query';

export default function useCreateQueryClient() {
  const [queryClient] = useState(() => new QueryClient());
  return queryClient;
}
