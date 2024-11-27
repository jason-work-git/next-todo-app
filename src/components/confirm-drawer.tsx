'use client';
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerProps,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Button } from './ui/button';
import { LoadingButton } from './ui/loading-button';

export type ConfirmDrawerProps = Pick<DrawerProps, 'open' | 'onOpenChange'> & {
  title: React.ReactNode;
  trigger: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  isLoading?: boolean;

  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmDrawer: React.FC<ConfirmDrawerProps> = ({
  title,
  description,
  confirmText = 'Confirm',
  isLoading = false,
  onCancel,
  onConfirm,
  trigger,
  ...rest
}) => {
  return (
    <Drawer {...rest}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="flex gap-4 px-5 pb-2">
        <DrawerTitle className="">{title}</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>

        <div className="flex gap-4">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ConfirmDrawer;
