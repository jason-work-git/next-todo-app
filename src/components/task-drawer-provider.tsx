'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { TaskDetails } from '@/components/task-details';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useQuery } from '@tanstack/react-query';
import { getTaskById } from '@/actions/task/controller';
import { Task } from '@prisma/client';
import { Skeleton } from './ui/skeleton';

const TaskDrawerContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
  task: Task | null;
}>({
  open: false,
  setOpen: () => {},
  close: () => {},
  task: null,
});

const TempLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DrawerHeader>
      <DrawerTitle>{children}</DrawerTitle>
      <DrawerDescription hidden>No description</DrawerDescription>
    </DrawerHeader>
  );
};

function TaskDrawerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const taskId = searchParams.get('taskId');

  const [open, setOpen] = useState(!!taskId);

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    enabled: !!taskId,
    queryFn: () => {
      if (taskId) {
        return getTaskById(taskId);
      }
      return undefined;
    },
    queryKey: ['tasks', taskId],
  });

  useEffect(() => {
    setOpen(!!taskId);
  }, [taskId]);

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('taskId');

    router.push(pathname + '?' + params.toString());
  }, [pathname, router, searchParams]);

  return (
    <TaskDrawerContext.Provider
      value={{ open, setOpen, close, task: task || null }}
    >
      <Drawer open={open} onOpenChange={setOpen} onClose={close}>
        <DrawerContent>
          {isLoading && <Skeleton className="w-full h-[4.625rem]" />}
          {error && <TempLayout>{error.message}</TempLayout>}
          {task && <TaskDetails task={task} />}
        </DrawerContent>
      </Drawer>
      {children}
    </TaskDrawerContext.Provider>
  );
}

export function useTaskDrawerData() {
  const context = useContext(TaskDrawerContext);
  if (!context) {
    throw new Error(
      'useTaskDrawerData must be used within a TaskDrawerProvider',
    );
  }
  return context;
}

export default memo(TaskDrawerProvider);
