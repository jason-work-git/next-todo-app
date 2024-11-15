'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import TaskDrawer from '@/components/task-drawer';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { routes } from './routes';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Tabs asChild value={pathname} className="h-full">
      <div className="!h-dvh flex flex-col">
        <main className="flex flex-col flex-grow overflow-y-auto px-8 pt-4">
          <TaskDrawer />
          {children}
        </main>
        <TabsList className="flex w-full justify-evenly md:hidden py-2 h-auto rounded-none">
          {routes.map(({ children, href }) => (
            <TabsTrigger
              className="data-[state=active]:!text-primary flex flex-col gap-1 items-center text-xs"
              key={href}
              value={href}
              asChild
            >
              <Link href={href}>{children}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
