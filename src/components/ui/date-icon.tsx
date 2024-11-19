import { isToday } from 'date-fns/isToday';
import { isTomorrow } from 'date-fns/isTomorrow';

import {
  CalendarClock,
  CalendarDays,
  CalendarOff,
  LucideProps,
  Sunrise,
} from 'lucide-react';

interface DateIconProps extends LucideProps {
  date?: Date;
}

const getIcon = (date?: Date) => {
  if (!date) return CalendarOff;
  if (isToday(date)) return CalendarClock;
  if (isTomorrow(date)) return Sunrise;
  return CalendarDays;
};

export const DateIcon = ({ date, ...rest }: DateIconProps) => {
  const Icon = getIcon(date);
  return <Icon {...rest} />;
};
