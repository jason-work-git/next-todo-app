import { updateTask } from '@/actions/task/controller';
import { UpdateTaskDto } from '@/actions/task/types';
import { Task } from '@prisma/client';
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

type UseUpdateTaskMutationOptions = Omit<
  UseMutationOptions<Task, Error, UpdateTaskDto, TContext>,
  'mutationFn' | 'onMutate'
> & {
  onMutate?: (variables: UpdateTaskDto) => void;
};

export default function useUpdateTaskMutation({
  onMutate,
  onError,
  ...options
}: UseUpdateTaskMutationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Task, Error, UpdateTaskDto, TContext>({
    mutationFn: updateTask,
    onMutate: (newTask) => {
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      const previousTask = queryClient.getQueryData<Task>([
        'tasks',
        newTask.id,
      ]);

      queryClient.setQueryData<Task>(['tasks', newTask.id], (oldTask) => {
        if (!oldTask) {
          return oldTask;
        }

        return { ...oldTask, ...newTask };
      });

      queryClient.setQueryData<Task[]>(['tasks'], (oldTasks) => {
        if (!oldTasks) {
          return oldTasks;
        }

        return oldTasks.map((oldTask) =>
          oldTask.id === newTask.id ? { ...oldTask, ...newTask } : oldTask,
        );
      });

      if (onMutate) {
        onMutate(newTask);
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

      toast.error('Failed to update task');

      if (onError) {
        onError(error, variables, context);
      }
    },
    ...options,
  });

  return mutation;
}
