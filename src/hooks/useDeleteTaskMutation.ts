import { DeleteTaskDto } from '@/actions/task/types';
import { Task } from '@prisma/client';

import { deleteTask } from '@/actions/task/controller';
import {
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';

import { toast } from 'sonner';

type TContext = {
  previousTasks: Task[] | undefined;
  previousTask: Task | undefined;
};

type UseDeleteTaskMutationOptions = Omit<
  UseMutationOptions<Task, Error, DeleteTaskDto, TContext>,
  'mutationFn' | 'onMutate'
> & {
  onMutate?: (data: DeleteTaskDto) => void;
};

export default function useDeleteTaskMutation({
  onMutate,
  onError,
  onSuccess,
  ...options
}: UseDeleteTaskMutationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Task, Error, DeleteTaskDto, TContext>({
    mutationFn: deleteTask,
    onMutate: (data) => {
      const { id } = data;
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      const previousTask = queryClient.getQueryData<Task>(['tasks', id]);

      queryClient.setQueryData<Task>(['tasks', id], undefined);
      queryClient.setQueryData<Task[]>(['tasks'], (oldTasks) => {
        if (!oldTasks) {
          return oldTasks;
        }

        return oldTasks.filter((task) => task.id !== id);
      });

      if (onMutate) {
        onMutate(data);
      }

      return { previousTasks, previousTask };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }

      if (context?.previousTask) {
        queryClient.setQueryData(
          ['tasks', context.previousTask.id],
          context.previousTask,
        );
      }

      toast.error('Failed to delete task');

      if (onError) {
        onError(error, variables, context);
      }
    },
    onSuccess: (deletedTask, variables, context) => {
      toast.success('Task deleted successfully');

      if (onSuccess) {
        onSuccess(deletedTask, variables, context);
      }
    },
    ...options,
  });

  return mutation;
}
