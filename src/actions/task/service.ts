import prisma from '@/prisma-client';
import { Task, TaskRole, User } from '@prisma/client';
import { AddTaskParams } from './types';

function getUserTaskById(authorId: User['id'], taskId: Task['id']) {
  return prisma.task.findUnique({
    where: { id: taskId, assignments: { some: { userId: authorId } } },
  });
}

function getUserTasks(authorId: User['id']) {
  return prisma.task.findMany({
    where: { assignments: { some: { userId: authorId } } },
  });
}

function deleteTaskById(taskId: Task['id']) {
  return prisma.task.delete({ where: { id: taskId } });
}

function getUserTaskByIdOrThrow(authorId: User['id'], taskId: Task['id']) {
  return getUserTaskById(authorId, taskId).then((task) => {
    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  });
}

function createTask(authorId: User['id'], dto: AddTaskParams) {
  return prisma.task.create({
    data: {
      ...dto,
      assignments: {
        create: { userId: authorId, role: TaskRole.OWNER, accepted: true },
      },
    },
  });
}

function updateTaskById(taskId: Task['id'], dto: Partial<Task>) {
  return prisma.task.update({ where: { id: taskId }, data: dto });
}

export const taskService = {
  getUserTaskByIdOrThrow,
  getUserTaskById,
  getUserTasks,
  deleteTaskById,
  updateTaskById,
  createTask,
};
