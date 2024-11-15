'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      {/* Profile Name */}
      <div className="space-y-2 max-w-md w-full">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="John Doe" />
      </div>
      {/* Email */}
      <div className="space-y-2 max-w-md w-full">
        <Label htmlFor="email">Email</Label>
        <Input id="email" defaultValue="name@example.com" disabled />
      </div>
      {/* Change Password */}
      <Button className="w-full sm:w-auto" variant="outline">
        Change password
      </Button>
      <Button className="w-full sm:w-auto ml-1" variant="default">
        Save changes
      </Button>
    </div>
  );
}
