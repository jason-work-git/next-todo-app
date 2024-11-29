import { useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return async () => {
    queryClient.removeQueries();
    await signOut();
  };
};
