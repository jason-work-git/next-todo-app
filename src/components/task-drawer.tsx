'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';

import { TaskDetails } from '@/components/task-details';
import { Drawer, DrawerContent } from '@/components/ui/drawer';

function TaskDrawer() {
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
    <Drawer open={open} onOpenChange={setOpen} onClose={close}>
      <DrawerContent>{taskId && <TaskDetails taskId={taskId} />}</DrawerContent>
    </Drawer>
  );
}

export default memo(TaskDrawer);
