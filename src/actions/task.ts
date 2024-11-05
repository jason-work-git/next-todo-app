'use server';

import { auth } from '@/auth';
import prisma from '@/prisma-client';

type AddTaskParams = {
  title: string;
  description?: string;
};

type UpdateTaskParams = {
  id: string;
  title: string;
  description?: string;
};

type DeleteTaskParams = {
  id: string;
};

type ToggleTaskParams = {
  id: string;
};

export const getTasks = async () => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const authorId = session.user.id as string;

  return prisma.task.findMany({ where: { authorId } });
};

export const addTask = async ({ title, description }: AddTaskParams) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const authorId = session.user.id as string;

  return prisma.task.create({
    data: {
      title,
      description: description ?? null,
      authorId,
    },
  });
};

export const updateTask = async ({
  id,
  title,
  description,
}: UpdateTaskParams) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const authorId = session.user.id as string;

  const task = await prisma.task.findUnique({ where: { id, authorId } });

  if (!task) {
    throw new Error('Task not found');
  }

  return prisma.task.update({
    where: { id, authorId },
    data: {
      title,
      ...(description !== undefined && { description }),
      updatedAt: new Date(),
    },
  });
};

export const deleteTask = async ({ id }: DeleteTaskParams) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const authorId = session.user.id as string;

  const task = await prisma.task.findUnique({ where: { id, authorId } });

  if (!task) {
    throw new Error('Task not found');
  }

  return prisma.task.delete({ where: { id, authorId } });
};

export const toggleTaskStatus = async ({ id }: ToggleTaskParams) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const authorId = session.user.id as string;

  const task = await prisma.task.findUnique({ where: { id, authorId } });

  if (!task) {
    throw new Error('Task not found');
  }

  return prisma.task.update({
    where: { id, authorId },
    data: {
      completed: !task.completed,
    },
  });
};
