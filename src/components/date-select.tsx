'use client';

import { useState } from 'react';
import { formatDate, getNextWeek, getToday, getTomorrow } from '@/lib/utils';

import { DateIcon } from './ui/date-icon';
import { Button, ButtonProps } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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

type Props = ButtonProps & {
  onSelectDate: (value: Date | null) => void;
  selectedDate: Date | null;
};

export const DateSelect = ({ onSelectDate, selectedDate, ...props }: Props) => {
  const [dueDate, setDueDate] = useState<Date | null>(selectedDate);
  const [isOpened, setIsOpened] = useState(false);

  const select = (value: Date | null) => {
    onSelectDate(value);
    setIsOpened(false);
  };

  return (
    <Drawer
      open={isOpened}
      onClose={() => setDueDate(selectedDate)}
      onOpenChange={setIsOpened}
      nested
    >
      <DrawerTrigger asChild>
        <Button {...props} variant={'outline'}>
          <DateIcon date={selectedDate || undefined} />
          {selectedDate ? formatDate(selectedDate) : 'No due date'}
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
            <DateIcon date={getToday()} />
            Today
          </Button>
          <Button onClick={() => select(getTomorrow())} variant={'outline'}>
            <DateIcon date={getTomorrow()} />
            Tomorrow
          </Button>
          <Button onClick={() => select(getNextWeek())} variant={'outline'}>
            <DateIcon date={getNextWeek()} />
            Next week
          </Button>
          <Button onClick={() => select(null)} variant="secondary">
            <DateIcon />
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
