import { LogoutButton } from '@/components/logout-button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  const { name, email } = session.user;

  return (
    <div className="flex flex-col h-full gap-4 pb-4">
      <div className="text-center sm:text-start">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Your profile information and settings.
        </p>
      </div>
      <form className="space-y-4">
        <Label className="flex flex-col gap-2">
          Name
          <Input value={name || ''} readOnly />
        </Label>
        <Label className="flex flex-col gap-2">
          Email
          <Input value={email || ''} readOnly />
        </Label>
      </form>

      <LogoutButton variant={'outline'} className="w-full mt-auto" />
    </div>
  );
}
