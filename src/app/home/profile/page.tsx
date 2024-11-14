import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="space-y-4">
          {/* Profile Name */}
          <div className="space-y-2 max-w-[430]">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="John Doe" />
          </div>
          {/* Email */}
          <div className="space-y-2 max-w-[430]">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="name@example.com" />
          </div>
          <Button>Save changes</Button>
        </TabsContent>
        {/* Change Password */}
        <TabsContent value="password" className="space-y-4">
          <div className="space-y-2 max-w-[436]">
            <Label htmlFor="current">Current password</Label>
            <Input id="current" type="password" />
          </div>
          <div className="space-y-2 max-w-[436]">
            <Label htmlFor="new">New password</Label>
            <Input id="new" type="password" />
          </div>
          <Button disabled>Change password</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
