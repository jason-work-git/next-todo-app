'use server';

import prisma from '@/prisma-client';
import { TaskRole } from '@prisma/client';
import {
  AddTaskParams,
  UpdateTaskParams,
  DeleteTaskParams,
  ToggleTaskParams,
} from './types';
import { requireAuth } from '../auth/middlewares';

export const getTasks = await requireAuth(({ session }) => {
  const authorId = session.user.id;

  return prisma.task.findMany({
    where: { assignments: { some: { userId: authorId } } },
  });
});

export const getTaskById = await requireAuth(({ session }, id: string) => {
  const authorId = session.user.id;

  return prisma.task.findUnique({
    where: { id, assignments: { some: { userId: authorId } } },
  });
});

export const addTask = await requireAuth(
  ({ session }, { title, description }: AddTaskParams) => {
    const authorId = session.user.id;

    return prisma.task.create({
      data: {
        title,
        description: description ?? null,
        assignments: {
          create: { userId: authorId, role: TaskRole.OWNER, accepted: true },
        },
      },
    });
  },
);

export const updateTask = await requireAuth(
  async ({ session }, { id, title, description }: UpdateTaskParams) => {
    const authorId = session.user.id;
    const task = await getTaskById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    return prisma.task.update({
      where: { id, assignments: { some: { userId: authorId } } },
      data: {
        title,
        ...(description !== undefined && { description }),
        updatedAt: new Date(),
      },
    });
  },
);

export const deleteTask = await requireAuth(
  async ({ session }, { id }: DeleteTaskParams) => {
    const authorId = session.user.id;
    const task = await getTaskById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    return prisma.task.delete({
      where: { id, assignments: { some: { userId: authorId } } },
    });
  },
);

export const toggleTaskStatus = await requireAuth(
  async ({ session }, { id }: ToggleTaskParams) => {
    const authorId = session.user.id;
    const task = await getTaskById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    return prisma.task.update({
      where: { id, assignments: { some: { userId: authorId } } },
      data: {
        completed: !task.completed,
      },
    });
  },
);
