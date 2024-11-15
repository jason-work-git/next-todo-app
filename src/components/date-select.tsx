'use client';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { formatDate, getNextWeek, getToday, getTomorrow } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

import {
  CalendarClock,
  CalendarDays,
  CalendarOff,
  Sunrise,
} from 'lucide-react';

// TODO: fix this bullshit
const getIcon = (type: string) => {
  const icons: Record<string, JSX.Element> = {
    today: <CalendarClock />,
    tomorrow: <Sunrise />,
    'no due date': <CalendarOff />,
  };

  return icons[type] || <CalendarDays />;
};

type Props = ButtonProps & {
  onSelectValue: (value: Date | null) => void;
  initialDate: Date | null;
};

export const DateSelect = ({
  onSelectValue: onSelect,
  initialDate,
  ...props
}: Props) => {
  const [dueDate, setDueDate] = useState<Date | null>(initialDate);
  const [isOpened, setIsOpened] = useState(false);

  const formattedDate = initialDate ? formatDate(initialDate) : 'No due date';
  const icon = getIcon(formattedDate.toLowerCase());

  const select = (value: Date | null) => {
    onSelect(value);
    setIsOpened(false);
  };

  return (
    <Drawer
      open={isOpened}
      onClose={() => setDueDate(initialDate)}
      onOpenChange={setIsOpened}
      nested
    >
      <DrawerTrigger asChild>
        <Button {...props} variant={'outline'}>
          {icon}
          {formattedDate}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Due date</DrawerTitle>
          <DrawerDescription>Set due date for your task</DrawerDescription>
        </DrawerHeader>

        <Calendar
          className="mx-auto"
          size="lg"
          mode="single"
          selected={dueDate || undefined}
          onSelect={(date) => {
            setDueDate(date || null);
          }}
          initialFocus
        />
        <div className="p-4 grid grid-cols-2 gap-3">
          <Button onClick={() => select(getToday())} variant={'outline'}>
            {getIcon('today')}
            Today
          </Button>
          <Button onClick={() => select(getTomorrow())} variant={'outline'}>
            {getIcon('tomorrow')}
            Tomorrow
          </Button>
          <Button onClick={() => select(getNextWeek())} variant={'outline'}>
            {getIcon('')}
            Next week
          </Button>
          <Button onClick={() => select(null)} variant="secondary">
            {getIcon('no due date')}
            No date
          </Button>
        </div>
        <DrawerFooter>
          <Button className="w-full" onClick={() => select(dueDate)}>
            Select
          </Button>
          <DrawerClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
