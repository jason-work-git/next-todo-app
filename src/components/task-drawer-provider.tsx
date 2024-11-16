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
import { Drawer, DrawerContent } from '@/components/ui/drawer';

const TaskDrawerContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
  taskId: string | null;
}>({
  open: false,
  setOpen: () => {},
  close: () => {},
  taskId: null,
});

function TaskDrawerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const taskId = searchParams.get('taskId');

  const [open, setOpen] = useState(!!taskId);

  useEffect(() => {
    setOpen(!!taskId);
  }, [taskId]);

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('taskId');

    router.push(pathname + '?' + params.toString());
  }, [pathname, router, searchParams]);

  return (
    <TaskDrawerContext.Provider value={{ open, setOpen, close, taskId }}>
      <Drawer open={open} onOpenChange={setOpen} onClose={close}>
        <DrawerContent>
          {taskId && <TaskDetails taskId={taskId} />}
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
