'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

import { Task } from '@prisma/client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import useUpdateTaskMutation from '@/hooks/useUpdateTaskMutation';

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

  const { mutate } = useUpdateTaskMutation();

  const onCheckedChange = async (value: boolean) => {
    mutate({ id, completed: value });
  };

  const onClick = () => {
    router.push(`?taskId=${id}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        'cursor-pointer active:scale-[.97] transition-transform duration-200 has-[.checkbox:active]:scale-100',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        className,
      )}
      ref={ref}
      {...props}
    >
      <CardHeader className="p-4 flex-row gap-2 items-center">
        <Checkbox
          className="checkbox size-5 rounded-full"
          onCheckedChange={onCheckedChange}
          onKeyDown={(e) => e.stopPropagation()}
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
