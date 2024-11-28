import { requestPasswordReset } from '@/actions/auth/controller';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRequestPasswordReset() {
  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      toast.success('Password reset link was sent to your email');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    ...mutation,
    requestPasswordReset: mutation.mutate,
    requestPasswordResetAsync: mutation.mutateAsync,
  };
}
