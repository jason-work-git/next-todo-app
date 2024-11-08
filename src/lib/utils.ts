import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
