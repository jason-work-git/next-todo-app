'use client';

import { LogOut } from 'lucide-react';
import { Button, ButtonProps } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';

export const LogoutButton = (props: ButtonProps) => {
  const queryClient = useQueryClient();

  const logout = async () => {
    queryClient.removeQueries();
    await signOut();
  };

  return (
    <Button onClick={logout} {...props}>
      <LogOut />
      Logout
    </Button>
  );
};
