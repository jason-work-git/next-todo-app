import { CalendarCheck, ListTodo, User } from 'lucide-react';

export const routes = [
  {
    children: (
      <>
        <CalendarCheck />
        <span>Today</span>
      </>
    ),
    href: '/home/today',
  },
  {
    children: (
      <>
        <ListTodo />
        <span>All tasks</span>
      </>
    ),
    href: '/home/all',
  },
  {
    children: (
      <>
        <User />
        <span>Profile</span>
      </>
    ),
    href: '/home/profile',
  },
];
