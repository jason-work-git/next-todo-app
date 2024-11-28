import { getAcceptedDetailedTasks } from '@/actions/task/controller';
import { useQuery } from '@tanstack/react-query';

export default function useTasksQuery() {
  return useQuery({
    queryFn: getAcceptedDetailedTasks,
    queryKey: ['tasks'],
  });
}
