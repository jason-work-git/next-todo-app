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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type Props = ButtonProps & {
  onSelectDate: (value: Date | null) => void;
  selectedDate: Date | null;
};

export const DateSelect = ({ onSelectDate, selectedDate, ...props }: Props) => {
  const [dueDate, setDueDate] = useState<Date | null>(selectedDate);
  const [isOpened, setIsOpened] = useState(false);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const select = (value: Date | null) => {
    setDueDate(value);
    onSelectDate(value);
    if (!isDesktop) {
      setIsOpened(false);
    }
  };

  const trigger = (
    <Button {...props} variant={'outline'}>
      <DateIcon date={selectedDate || undefined} />
      {selectedDate ? formatDate(selectedDate) : 'No due date'}
    </Button>
  );

  const buttons = (
    <>
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
    </>
  );

  if (isDesktop) {
    return (
      <Popover open={isOpened} onOpenChange={setIsOpened}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          side="top"
          className="w-auto flex flex-col items-center p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={dueDate || undefined}
            onSelect={(date) => {
              select(date || null);
            }}
            initialFocus
          />
          <div className="p-4 grid grid-cols-2 gap-1">{buttons}</div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer
      open={isOpened}
      onClose={() => setDueDate(selectedDate)}
      onOpenChange={setIsOpened}
      nested
    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
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
        <div className="p-4 grid grid-cols-2 gap-3">{buttons}</div>
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
