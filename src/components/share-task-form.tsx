import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { TaskRole } from '@prisma/client';
import { z } from 'zod';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

const availableRoles = Object.values(TaskRole).filter(
  (role) => role !== TaskRole.OWNER,
);

export const schema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(TaskRole).refine((role) => role !== 'OWNER', {
    message: 'Role OWNER is not allowed.',
  }),
});

export const ShareTaskForm = ({
  onSubmit,
  isPending,
  className,
  children,
  ...props
}: Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  onSubmit: (data: z.infer<typeof schema>) => void;
  isPending: boolean;
}) => {
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const parsedFields = schema.safeParse({
      email: formData.get('email'),
      role: formData.get('role'),
    });

    if (parsedFields.error) {
      const errors = parsedFields.error.formErrors.fieldErrors;

      if (errors.email) {
        toast.error(errors.email);
      }

      if (errors.role) {
        toast.error(errors.email);
      }

      return;
    }

    const { email, role } = parsedFields.data;

    onSubmit({ email, role });
  };

  return (
    <form onSubmit={submit} className={cn('space-y-4', className)} {...props}>
      <Label className="flex flex-col gap-2">
        Email
        <Input disabled={isPending} required type="email" name="email" />
      </Label>
      <Label className="flex flex-col gap-2">
        Role
        <Select
          disabled={isPending}
          required
          name="role"
          defaultValue={TaskRole.VIEWER}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem value={role} key={role}>
                {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>

      {children}
    </form>
  );
};
