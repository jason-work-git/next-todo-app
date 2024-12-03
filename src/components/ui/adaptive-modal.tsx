import * as DrawerPrimitive from '@/components/ui/drawer';
import * as DialogPrimitive from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DrawerProps } from '@/components/ui/drawer';

const useIsDesktop = () => useMediaQuery('(min-width: 768px)');

type Props<Component extends React.ElementType> =
  React.ComponentProps<Component>;

type DualProps<C1 extends React.ElementType, C2 extends React.ElementType> =
  | Props<C1>
  | Props<C2>;

const Modal = (props: DrawerProps) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return (
      <DialogPrimitive.Dialog
        defaultOpen={props.defaultOpen}
        onOpenChange={props.onOpenChange}
        modal={props.modal}
        open={props.open}
      >
        {props.children}
      </DialogPrimitive.Dialog>
    );
  }
  return <DrawerPrimitive.Drawer {...props} />;
};

const ModalTrigger = DialogPrimitive.DialogTrigger;

const ModalClose = DialogPrimitive.DialogClose;

const ModalPortal = DialogPrimitive.DialogPortal;

const ModalOverlay = (
  props: DualProps<
    typeof DialogPrimitive.DialogOverlay,
    typeof DrawerPrimitive.DrawerOverlay
  >,
) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return <DialogPrimitive.DialogOverlay {...props} />;
  }
  return <DrawerPrimitive.DrawerOverlay {...props} />;
};

const ModalContent = (
  props: DualProps<
    typeof DrawerPrimitive.DrawerContent,
    typeof DialogPrimitive.DialogContent
  >,
) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return <DialogPrimitive.DialogContent {...props} />;
  }
  return <DrawerPrimitive.DrawerContent {...props} />;
};

const ModalHeader = (
  props: DualProps<
    typeof DialogPrimitive.DialogHeader,
    typeof DrawerPrimitive.DrawerHeader
  >,
) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return <DialogPrimitive.DialogHeader {...props} />;
  }
  return <DrawerPrimitive.DrawerHeader {...props} />;
};

const ModalFooter = (
  props: DualProps<
    typeof DialogPrimitive.DialogFooter,
    typeof DrawerPrimitive.DrawerFooter
  >,
) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return <DialogPrimitive.DialogFooter {...props} />;
  }
  return <DrawerPrimitive.DrawerFooter {...props} />;
};

const ModalTitle = (
  props: DualProps<
    typeof DialogPrimitive.DialogTitle,
    typeof DrawerPrimitive.DrawerTitle
  >,
) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return <DialogPrimitive.DialogTitle {...props} />;
  }
  return <DrawerPrimitive.DrawerTitle {...props} />;
};

const ModalDescription = (
  props: DualProps<
    typeof DialogPrimitive.DialogDescription,
    typeof DrawerPrimitive.DrawerDescription
  >,
) => {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return <DialogPrimitive.DialogDescription {...props} />;
  }
  return <DrawerPrimitive.DrawerDescription {...props} />;
};

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
