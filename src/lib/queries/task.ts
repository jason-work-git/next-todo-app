'use server';

import prisma from '@/prisma-client';
import { getUserId } from './user';

export const getTodayTasks = async () => {
  const authorId = await getUserId();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.task.findMany({
    where: {
      assignments: { some: { userId: authorId } },
      AND: {
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    },
  });
};

export const getTodayUncompletedTasks = async () => {
  const authorId = await getUserId();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.task.findMany({
    where: {
      assignments: { some: { userId: authorId } },
      AND: {
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        completed: false,
      },
    },
  });
};

export const getAllTasks = async () => {
  const authorId = await getUserId();

  return prisma.task.findMany({
    where: { assignments: { some: { userId: authorId } } },
  });
};

export const getTaskById = async (id: string) => {
  const authorId = await getUserId();

  return prisma.task.findUnique({
    where: { id, assignments: { some: { userId: authorId } } },
  });
};
