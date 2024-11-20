'use server';

import { AddTaskDto, DeleteTaskDto, UpdateTaskDto } from './types';
import { requireAuth } from '../auth/middlewares';
import { taskService } from './service';
import { Prisma, Task } from '@prisma/client';

export const getTasks = requireAuth(async ({ session }) => {
  return taskService.getUserTasks(session.user.id);
});

export const getTaskById = requireAuth(async ({ session }, id: Task['id']) => {
  return taskService.getUserTaskById(session.user.id, id);
});

export const addTask = requireAuth(async ({ session }, data: AddTaskDto) => {
  try {
    const task = await taskService.createTask(session.user.id, data);
    return task;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw Error('Task with this id already exists');
      }
    } else {
      throw e;
    }
  }
  throw Error('Task was not created due to an unexpected error');
});

export const updateTask = requireAuth(
  async ({ session }, data: UpdateTaskDto) => {
    const authorId = session.user.id;
    const task = await taskService.getUserTaskByIdOrThrow(authorId, data.id);

    return taskService.updateTaskById(task.id, data);
  },
);

export const deleteTask = requireAuth(
  async ({ session }, { id }: DeleteTaskDto) => {
    const authorId = session.user.id;
    const task = await taskService.getUserTaskByIdOrThrow(authorId, id);

    return taskService.deleteTaskById(task.id);
  },
);
