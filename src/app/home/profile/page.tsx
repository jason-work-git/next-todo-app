import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';

export default function Page() {
  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-center">
          Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Tabs className="space-y-4">
        {/* Profile Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="John Doe" />
        </div>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue="name@example.com" disabled />
        </div>
      </Tabs>
      <Tabs className="space-y-4 mt-4">
        <Button className="w-full sm:w-auto" variant="outline">
          Change password
        </Button>
        <Button className="w-full sm:w-auto ml-1" variant="default">
          Save changes
        </Button>
      </Tabs>
    </div>
  );
}
