'use client';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { DialogProps } from '@radix-ui/react-dialog';
import { Button } from './ui/button';
import { LoadingButton } from './ui/loading-button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export type ConfirmFlowProps = Omit<DialogProps, 'children'> & {
  title: React.ReactNode;
  trigger: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  isLoading?: boolean;

  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmFlow: React.FC<ConfirmFlowProps> = ({
  title,
  description,
  confirmText = 'Confirm',
  isLoading = false,
  onCancel,
  onConfirm,
  trigger,
  ...rest
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog {...rest}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-stretch">
            <DialogClose asChild>
              <Button className="w-full" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </DialogClose>

            <LoadingButton
              className="w-full"
              isLoading={isLoading}
              onClick={onConfirm}
            >
              {confirmText}
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...rest}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="flex-row">
          <DrawerClose className="w-full" asChild>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </DrawerClose>

          <LoadingButton
            isLoading={isLoading}
            onClick={onConfirm}
            className="w-full"
          >
            {confirmText}
          </LoadingButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ConfirmFlow;
