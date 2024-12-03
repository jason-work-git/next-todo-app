import { LogoutButton } from '@/components/logout-button';
import UpdateProfileForm from '@/components/update-profile-form';
import { getCurrentUser } from '@/actions/auth/controller';
import { createServerActionHandler } from '@/lib/safe-action';

const getUser = createServerActionHandler(getCurrentUser);

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <div className="flex flex-col h-full gap-4 pb-4">
      <div className="text-center sm:text-start">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Your profile information and settings.
        </p>
      </div>

      <UpdateProfileForm user={user} />

      <LogoutButton variant={'outline'} className="w-full mt-auto" />
    </div>
  );
}
