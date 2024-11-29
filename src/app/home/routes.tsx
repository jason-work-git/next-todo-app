import {
  CalendarCheck,
  Inbox,
  ListTodo,
  LucideProps,
  User,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

type Route = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  href: string;
};

export const routes: Route[] = [
  {
    title: 'Today',
    icon: CalendarCheck,
    href: '/home/today',
  },
  {
    title: 'All tasks',
    icon: ListTodo,
    href: '/home/all',
  },
  {
    title: 'Inbox',
    icon: Inbox,
    href: '/home/inbox',
  },
  {
    title: 'Profile',
    icon: User,
    href: '/home/profile',
  },
];
