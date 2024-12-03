'use client';

import { useState } from 'react';
import ConfirmFlow, { ConfirmFlowProps } from './confirm-flow';
import { Button } from './ui/button';
import { useRequestPasswordReset } from '@/hooks/useRequestPasswordReset';
import { User } from '@prisma/client';

export type Props = Omit<ConfirmFlowProps, 'title' | 'trigger'> & {
  title?: ConfirmFlowProps['title'];
  trigger?: ConfirmFlowProps['trigger'];
  userEmail: User['email'];
};

const ResetPasswordDrawer: React.FC<Props> = ({
  userEmail,
  trigger,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { requestPasswordResetAsync, isPending } = useRequestPasswordReset();

  const resetPassword = async () => {
    await requestPasswordResetAsync(userEmail);

    setIsOpen(false);
  };

  return (
    <ConfirmFlow
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Are you sure you want to reset your password?"
      description="We will send a password reset link to your email address."
      confirmText="Yes, reset it"
      trigger={trigger ?? <Button variant="outline">Reset password</Button>}
      isLoading={isPending}
      onConfirm={resetPassword}
      {...rest}
    />
  );
};

export default ResetPasswordDrawer;
