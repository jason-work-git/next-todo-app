'use client';

import { Task } from '@prisma/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { updateTask } from '@/lib/actions/task';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export type TaskCardProps = React.HTMLAttributes<HTMLDivElement> & {
  task: Task;
  ref?: React.Ref<HTMLDivElement>;
};

export const TaskCard = ({
  task: { title, completed, id },
  ref,
  className,
  ...props
}: TaskCardProps) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateTask,
    onMutate: async (newTask) => {
      const previousTasks = queryClient.getQueryData([
        'tasks',
        'today',
      ]) as Task[];

      queryClient.setQueryData(['tasks', 'today'], (oldTasks: Task[]) =>
        oldTasks.map((task) =>
          task.id === newTask.id
            ? { ...task, completed: newTask.completed }
            : task,
        ),
      );

      return { previousTasks };
    },
    onError: (_, __, context: { previousTasks: Task[] } | undefined) => {
      queryClient.setQueryData(['tasks', 'today'], context?.previousTasks);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['tasks', 'today'],
      });

      queryClient.refetchQueries({
        queryKey: ['tasks', id],
      });
    },
  });

  const onCheckedChange = async (value: boolean) => {
    mutate({ id, completed: value });
  };

  const onClick = async () => {
    router.push(`?taskId=${id}`);
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer active:scale-[.97] transition-transform duration-200 has-[.checkbox:active]:scale-100',
        className,
      )}
      ref={ref}
      {...props}
    >
      <CardHeader className="p-4 flex-row gap-2 items-center">
        <Checkbox
          className="checkbox size-5 rounded-full"
          onCheckedChange={onCheckedChange}
          onClick={(e) => e.stopPropagation()}
          checked={completed}
        />
        <CardTitle
          className={cn(
            '!m-0',
            'peer-data-[state=checked]:line-through peer-data-[state=checked]:text-muted-foreground',
          )}
        >
          {title}
        </CardTitle>
        {/* <span className="text-muted-foreground text-xs">test</span> */}
      </CardHeader>
    </Card>
  );
};
