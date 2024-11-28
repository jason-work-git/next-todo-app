'use client';
import React, { useState } from 'react';
import ConfirmDrawer, { ConfirmDrawerProps } from './confirm-drawer';
import { Button } from './ui/button';
import { useRequestPasswordReset } from '@/hooks/useRequestPasswordReset';
import { User } from '@prisma/client';

export type Props = Omit<ConfirmDrawerProps, 'title' | 'trigger'> & {
  title?: ConfirmDrawerProps['title'];
  trigger?: ConfirmDrawerProps['trigger'];
  userEmail: User['email'];
};

const ResetPasswordDrawer: React.FC<Props> = ({ userEmail, ...rest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { requestPasswordResetAsync, isPending } = useRequestPasswordReset();

  const resetPassword = async () => {
    await requestPasswordResetAsync(userEmail);

    setIsOpen(false);
  };

  return (
    <ConfirmDrawer
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Are you sure you want to reset your password?"
      description="We will send a password reset link to your email address."
      confirmText="Yes, reset it"
      trigger={<Button variant="outline">Reset password</Button>}
      isLoading={isPending}
      onConfirm={resetPassword}
      {...rest}
    />
  );
};

export default ResetPasswordDrawer;
