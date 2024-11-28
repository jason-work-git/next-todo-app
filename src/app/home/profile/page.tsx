import { Button } from '@/components/ui/button';

import { signOut } from '@/auth';
import { LogOut } from 'lucide-react';
import UpdateProfileForm from '@/components/update-profile-form';
import { getCurrentUser } from '@/actions/auth/controller';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col h-full gap-4 pb-4">
      <div className="text-center sm:text-start">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Your profile information and settings.
        </p>
      </div>

      <UpdateProfileForm user={user} />

      <form
        className="mt-auto"
        action={async () => {
          'use server';

          await signOut();
        }}
      >
        <Button className="w-full" variant={'outline'}>
          <LogOut />
          Logout
        </Button>
      </form>
    </div>
  );
}
