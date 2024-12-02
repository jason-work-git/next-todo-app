import { createServerActionHandler } from '@/lib/safe-action';
import { getCurrentUser } from '@/actions/auth/controller';
import { useQuery } from '@tanstack/react-query';

export default function useUserQuery() {
  return useQuery({
    queryFn: createServerActionHandler(getCurrentUser),
    queryKey: ['user'],
  });
}
