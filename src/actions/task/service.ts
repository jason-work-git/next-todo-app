import prisma from '@/prisma-client';
import { Task, TaskRole, User } from '@prisma/client';
import { AddTaskDto, UpdateTaskDto } from './types';

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

async function getUserTaskByIdOrThrow(
  authorId: User['id'],
  taskId: Task['id'],
) {
  const task = await getUserTaskById(authorId, taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
}

function getTodayUserTasks(authorId: User['id']) {
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
}

function getTodayUncompletedUserTasks(authorId: User['id']) {
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
}

function createTask(authorId: User['id'], dto: AddTaskDto) {
  return prisma.task.create({
    data: {
      ...dto,
      assignments: {
        create: { userId: authorId, role: TaskRole.OWNER, accepted: true },
      },
    },
  });
}

function updateTaskById(taskId: Task['id'], dto: UpdateTaskDto) {
  return prisma.task.update({ where: { id: taskId }, data: dto });
}

function deleteTaskById(taskId: Task['id']) {
  return prisma.task.delete({ where: { id: taskId } });
}

export const taskService = {
  getUserTaskByIdOrThrow,
  getUserTaskById,
  getUserTasks,
  getTodayUserTasks,
  getTodayUncompletedUserTasks,
  deleteTaskById,
  updateTaskById,
  createTask,
};
