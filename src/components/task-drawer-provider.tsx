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
  DrawerProps,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from './ui/skeleton';
import { getDetailedTaskById } from '@/actions/task/controller';
import { DetailedTask } from '@/actions/task/types';

import useUserQuery from '@/hooks/use-user-query';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Dialog, DialogContent } from './ui/dialog';
import { DialogProps } from '@radix-ui/react-dialog';

const TaskDrawerContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
  task: DetailedTask | null;
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

const FlowLayout = ({
  children,
  open,
  onOpenChange,
  onClose,
}: {
  children: React.ReactNode;
  open: DialogProps['open'];
  onOpenChange: DialogProps['onOpenChange'];
  onClose: DrawerProps['onClose'];
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} onClose={onClose}>
      <DrawerContent>{children}</DrawerContent>
    </Drawer>
  );
};

function TaskDrawerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: user, isLoading: isUserLoading } = useUserQuery();

  const taskId = searchParams.get('taskId');

  const [open, setOpen] = useState(!!taskId);

  const {
    data: task,
    isLoading: isTaskLoading,
    error,
  } = useQuery({
    enabled: !!taskId,
    queryFn: () => {
      if (taskId) {
        return getDetailedTaskById(taskId);
      }
      return undefined;
    },
    queryKey: ['tasks', taskId],
  });

  const loading = isTaskLoading || isUserLoading;

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
      <FlowLayout open={open} onOpenChange={setOpen} onClose={close}>
        {loading && (
          <TempLayout>
            <Skeleton className="w-full h-[4.625rem]" />
          </TempLayout>
        )}
        {error && <TempLayout>{error.message}</TempLayout>}
        {task && user && <TaskDetails task={task} userId={user.id} />}
      </FlowLayout>
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
