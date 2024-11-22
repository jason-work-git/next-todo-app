'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { DialogTriggerProps } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button';

import { useMutation } from '@tanstack/react-query';
import { requestPasswordReset } from '@/actions/auth/controller';
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function ForgotPasswordTrigger({
  ...props
}: DialogTriggerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { mutate, isPending } = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      toast.success('Password reset link was sent to your email');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    mutate(email);
  };

  const title = 'Forgot password? Donut worry 🍩';

  const description = (
    <>
      <br />
      We&apos;ll send a password reset link to the provided email address
    </>
  );

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger {...props} />
        <DialogContent className="rounded w-[400px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <Input
              disabled={isPending}
              className="my-4"
              required
              name="email"
              type="email"
              placeholder="name@example.com"
            />

            <DialogFooter>
              <LoadingButton isLoading={isPending} type="submit">
                Send
              </LoadingButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger {...props} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <form className="px-4" onSubmit={onSubmit}>
          <Input
            disabled={isPending}
            required
            name="email"
            type="email"
            placeholder="name@example.com"
          />
          <DrawerFooter className="px-0">
            <LoadingButton isLoading={isPending} type="submit">
              Send
            </LoadingButton>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
