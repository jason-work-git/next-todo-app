'use server';

import prisma from '@/prisma-client';
import { Task, TaskRole } from '@prisma/client';
import { getTaskById } from '../queries/task';
import { getUserId } from '../queries/user';

type AddTaskDto = Pick<Task, 'title' | 'description' | 'dueDate'>;

export const addTask = async (data: AddTaskDto) => {
  const authorId = await getUserId();

  return prisma.task.create({
    data: {
      ...data,
      assignments: {
        create: { userId: authorId, role: TaskRole.OWNER, accepted: true },
      },
    },
  });
};

type UpdateTaskDto = Omit<
  Partial<Task> & {
    id: string;
  },
  'createdAt' | 'updatedAt'
>;

export const updateTask = async ({ id, ...data }: UpdateTaskDto) => {
  const authorId = await getUserId();

  const task = await getTaskById(id);

  if (!task) {
    throw new Error('Task not found');
  }

  return prisma.task.update({
    where: { id, assignments: { some: { userId: authorId } } },
    data,
  });
};

type DeleteTaskDto = {
  id: string;
};

export const deleteTask = async ({ id }: DeleteTaskDto) => {
  const authorId = await getUserId();

  const task = await getTaskById(id);

  if (!task) {
    throw new Error('Task not found');
  }

  return prisma.task.delete({
    where: { id, assignments: { some: { userId: authorId } } },
  });
};
