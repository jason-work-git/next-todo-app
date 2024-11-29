import { getCurrentUser } from '@/actions/auth/controller';
import { useQuery } from '@tanstack/react-query';

export default function useUserQuery() {
  return useQuery({
    queryFn: getCurrentUser,
    queryKey: ['user'],
  });
}
