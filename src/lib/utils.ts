import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A shorthand for `twMerge(clsx(inputs))`.
 *
 * @param inputs - The class names to merge.
 * @returns The merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const messages = [
  'Gathering your tasks... one procrastination at a time. 🐞',
  "Loading your responsibilities... don't panic! 🐻",
  'Bringing order to the chaos of your day... 🌈',
  'Organizing your plans... so you don’t have to. 🧋',
  'Arranging priorities... coffee first, then work. ☕️',
  'Loading the to-do list... brace yourself! ⚽️',
  'Just a moment... finding your motivation. 🛹',
  'Bringing clarity to your schedule... or at least trying! ✨',
  'Loading your tasks... because naps aren’t on the list. 🌚',
  'Almost ready... building your productivity! 🦄',
  'Please wait while the minions do their work 👷🏿‍♂️',
];

/**
 * Returns a random funny message from the predefined list of messages.
 * @returns {string} a message to be displayed while loading
 */
export function getLoadingMessage(): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Formats a given date to a string in the format: "day month | weekday".
 * @example
 * getFormattedDate(new Date('2022-07-25')) // '25 Jul | Monday'
 * @param {Date} date the date to be formatted
 * @returns {string} a string representing the given date
 */
export const getFormattedDate = (date: Date): string => {
  const formattedParts = new Intl.DateTimeFormat('en-EU', {
    day: 'numeric',
    month: 'short',
    weekday: 'long',
  }).formatToParts(date);

  const weekday = formattedParts.find((part) => part.type === 'weekday')?.value;
  const month = formattedParts.find((part) => part.type === 'month')?.value;
  const day = formattedParts.find((part) => part.type === 'day')?.value;

  return `${day} ${month} | ${weekday}`;
};

/**
 * Formats a given date into a human-readable string relative to the current date.
 * - Returns 'Today' if the date is the current day.
 * - Returns 'Tomorrow' if the date is the next day.
 * - Returns the weekday name if the date is within the current week.
 * - Returns 'day month' if the date is later in the current year.
 * - Returns 'day month year' if the date is in a different year.
 *
 * @example
 * formatDate(new Date()); // Today
 * formatDate(new Date(new Date().setDate(new Date().getDate() + 1))); // Tomorrow
 * formatDate(new Date(new Date().setDate(new Date().getDate() + 3))); // Wednesday
 * formatDate(new Date(new Date().setDate(new Date().getDate() + 10))); // 20 Nov (if in this year)
 * formatDate(new Date('2025-01-20')); // 20 Jan 2025
 *
 * @param {Date | string | number} date - The date to format, can be a Date object,
 *   a date string, or a timestamp.
 * @returns {string} A string representing the formatted date.
 */
export function formatDate(date: Date | string | number): string {
  const today = new Date();
  const targetDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const dayDiff = Math.floor((+targetDate - +today) / (1000 * 60 * 60 * 24));
  const isSameYear = targetDate.getFullYear() === today.getFullYear();

  if (dayDiff === 0) {
    return 'Today';
  }
  if (dayDiff === 1) {
    return 'Tomorrow';
  }
  if (dayDiff > 1 && dayDiff < 7) {
    return targetDate.toLocaleDateString('en-US', { weekday: 'long' });
  }
  if (dayDiff >= 7 && isSameYear) {
    return targetDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  }

  return targetDate
    .toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .replace(',', '');
}

export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

export const getNextWeek = () => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);
  return nextWeek;
};
