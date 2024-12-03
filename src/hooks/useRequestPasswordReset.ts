import { requestPasswordReset } from '@/actions/auth/controller';
import { createServerActionHandler } from '@/lib/safe-action';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const action = createServerActionHandler(requestPasswordReset);

export function useRequestPasswordReset() {
  const { mutate, mutateAsync, ...mutation } = useMutation({
    mutationFn: action,
    onSuccess: () => {
      toast.success('Password reset link was sent to your email');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    ...mutation,
    requestPasswordReset: mutate,
    requestPasswordResetAsync: mutateAsync,
  };
}
