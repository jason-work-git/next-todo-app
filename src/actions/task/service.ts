import prisma from '@/prisma-client';
import { Task, TaskRole, User } from '@prisma/client';
import { AddTaskDto, UpdateTaskDto } from './types';

function getUserTaskById(authorId: User['id'], taskId: Task['id']) {
  return prisma.task.findUnique({
    where: { id: taskId, assignments: { some: { userId: authorId } } },
  });
}

function getDetailedUserTaskById(userId: User['id'], taskId: Task['id']) {
  return prisma.task.findUnique({
    where: { id: taskId, assignments: { some: { userId } } },
    include: {
      assignments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
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

function getAcceptedUserTasks(authorId: User['id']) {
  return prisma.task.findMany({
    where: { assignments: { some: { userId: authorId, accepted: true } } },
  });
}

function getAcceptedDetailedUserTasks(userId: User['id']) {
  return prisma.task.findMany({
    where: { assignments: { some: { userId, accepted: true } } },
    include: {
      assignments: true,
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

function createDetailedTask(authorId: User['id'], dto: AddTaskDto) {
  return prisma.task.create({
    data: {
      ...dto,
      assignments: {
        create: { userId: authorId, role: TaskRole.OWNER, accepted: true },
      },
    },
    include: {
      assignments: true,
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
  getDetailedUserTaskById,
  getUserTasks,
  getAcceptedUserTasks,
  getAcceptedDetailedUserTasks,
  deleteTaskById,
  updateTaskById,
  createTask,
  createDetailedTask,
};
