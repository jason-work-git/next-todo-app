import { addTask } from '@/actions/task/controller';
import { AddTaskDto } from '@/actions/task/types';
import { Task } from '@prisma/client';
import {
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

type UseAddTaskMutationOptions = Omit<
  UseMutationOptions<Task, Error, AddTaskDto>,
  'mutationFn'
>;

export default function useAddTaskMutation({
  onError,
  onSuccess,
  ...options
}: UseAddTaskMutationOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Task, Error, AddTaskDto>({
    mutationFn: addTask,
    onError: (error, variables, context) => {
      toast.error(error.message, {
        richColors: true,
        duration: 5000,
        closeButton: true,
      });

      if (onError) {
        onError(error, variables, context);
      }
    },
    onSuccess: (newTask, variables, context) => {
      // TODO: when adding new task, add id on creation and update queryData on mutate
      queryClient.setQueryData<Task>(['tasks', newTask.id], newTask);

      queryClient.setQueryData<Task[]>(['tasks'], (oldTasks) => {
        if (!oldTasks) {
          return oldTasks;
        }

        return [...oldTasks, newTask];
      });

      toast.success('Task added successfully', {
        richColors: true,
        duration: 5000,
        closeButton: true,
      });

      if (onSuccess) {
        onSuccess(newTask, variables, context);
      }
    },
    ...options,
  });

  return mutation;
}
