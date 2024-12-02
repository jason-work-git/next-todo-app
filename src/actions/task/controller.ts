'use server';

import { AddTaskDto, DeleteTaskDto, UpdateTaskDto } from './types';
import { requireAuth } from '../auth/middlewares';
import { taskService } from './service';
import { Prisma, Task, TaskRole } from '@prisma/client';
import { createServerAction, ServerActionError } from '@/lib/safe-action';

export const getTasks = requireAuth(async ({ session }) => {
  return taskService.getUserTasks(session.user.id);
});

export const getAcceptedTasks = requireAuth(async ({ session }) => {
  return taskService.getAcceptedUserTasks(session.user.id);
});

export const getAcceptedDetailedTasks = requireAuth(async ({ session }) => {
  return taskService.getAcceptedDetailedUserTasks(session.user.id);
});

export const getTaskById = requireAuth(async ({ session }, id: Task['id']) => {
  return taskService.getUserTaskById(session.user.id, id);
});

export const getDetailedTaskById = requireAuth(
  async ({ session }, id: Task['id']) => {
    return taskService.getDetailedUserTaskById(session.user.id, id);
  },
);

export const addTask = createServerAction(
  requireAuth(async ({ session }, data: AddTaskDto) => {
    try {
      const task = await taskService.createTask(session.user.id, data);
      return task;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ServerActionError('Task with this id already exists');
        }
      } else {
        throw e;
      }
    }
    throw new ServerActionError(
      'Task was not created due to an unexpected error',
    );
  }),
);

export const updateTask = createServerAction(
  requireAuth(async ({ session }, data: UpdateTaskDto) => {
    const authorId = session.user.id;
    const task = await taskService.getDetailedUserTaskById(authorId, data.id);

    if (!task) {
      throw new ServerActionError('Task not found.');
    }

    const role = task.assignments[0].role;

    if (role === TaskRole.OWNER) {
      return taskService.updateTaskById(task.id, data);
    }

    if (role === TaskRole.VIEWER) {
      return taskService.updateTaskById(task.id, {
        id: task.id,
        completed: data.completed,
      });
    }

    if (role === TaskRole.EDITOR) {
      return taskService.updateTaskById(task.id, {
        id: task.id,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        completed: data.completed,
      });
    }

    throw new ServerActionError('You are not allowed to update this task.');
  }),
);

export const deleteTask = createServerAction(
  requireAuth(async ({ session }, { id }: DeleteTaskDto) => {
    const authorId = session.user.id;
    const task = await taskService.getUserTaskByIdOrThrow(authorId, id);

    return taskService.deleteTaskById(task.id);
  }),
);
