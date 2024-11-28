import { getCurrentUser } from '@/actions/auth/controller';
import TabsLayout from './tabs-layout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getCurrentUser();
  return <TabsLayout>{children}</TabsLayout>;
}
