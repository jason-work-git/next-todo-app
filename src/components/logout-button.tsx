'use client';

import { LogOut } from 'lucide-react';
import { Button, ButtonProps } from './ui/button';
import { useLogout } from '@/hooks/use-logout';

export const LogoutButton = (props: ButtonProps) => {
  const logout = useLogout();

  return (
    <Button onClick={logout} {...props}>
      <LogOut />
      Logout
    </Button>
  );
};
