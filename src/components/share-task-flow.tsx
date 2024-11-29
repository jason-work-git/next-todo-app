'use client';

import { DialogProps } from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';

import { Share } from 'lucide-react';
import { Button } from './ui/button';
import { LoadingButton } from './ui/loading-button';
import { schema, ShareTaskForm } from './share-task-form';

import { z } from 'zod';
import { Task } from '@prisma/client';
import { toast } from 'sonner';
import { shareTask } from '@/actions/assignment/controller';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type ShareTaskFlowProps = Omit<
  DialogProps,
  'children' | 'open' | 'onOpenChange'
> & { trigger?: React.ReactNode; taskId: Task['id'] };

export const ShareTaskFlow = ({
  trigger: propsTrigger,
  taskId,
  ...props
}: ShareTaskFlowProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { mutate, isPending } = useMutation({
    mutationFn: shareTask,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success('Task has been shared successfully');
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutate({ taskId, email: data.email, role: data.role });
  };

  const trigger = propsTrigger ?? (
    <Button>
      <Share /> Share
    </Button>
  );

  const title = 'Share task';

  const description = 'Share this task with someone else';

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} {...props}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <ShareTaskForm onSubmit={onSubmit} isPending={isPending}>
            <DialogFooter>
              <LoadingButton type="submit" isLoading={isPending}>
                Share
              </LoadingButton>
            </DialogFooter>
          </ShareTaskForm>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} {...props}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <ShareTaskForm
          className="px-4 pb-4"
          onSubmit={onSubmit}
          isPending={isPending}
        >
          <LoadingButton type="submit" isLoading={isPending} className="w-full">
            Share
          </LoadingButton>
        </ShareTaskForm>
      </DrawerContent>
    </Drawer>
  );
};
