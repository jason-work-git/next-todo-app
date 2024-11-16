import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

export default async function ProfilePage() {
  const session = await auth();

  return (
    <main className="p-8 flex items-center justify-center min-h-dvh">
      <div className="min-w-64 w-72 flex flex-col space-y-4">
        <h1 className="text-center tracking-tight text-3xl font-semibold">
          Profile
        </h1>
        <span className="text-xs self-center text-muted-foreground">
          {session?.user?.email}
        </span>
        <span className="text-xs self-center text-muted-foreground">
          {session?.user?.name}
        </span>
      </div>
      <form
        action={async () => {
          await signOut();
        }}
      >
        <Button>Logout</Button>
      </form>
    </main>
  );
}
