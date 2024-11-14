'use server';

import {
  AddTaskParams,
  UpdateTaskParams,
  DeleteTaskParams,
  ToggleTaskParams,
} from './types';
import { requireAuth } from '../auth/middlewares';
import { taskService } from './service';

export const getTasks = await requireAuth(({ session }) => {
  return taskService.getUserTasks(session.user.id);
});

export const getTaskById = await requireAuth(({ session }, id: string) => {
  return taskService.getUserTaskById(session.user.id, id);
});

export const addTask = await requireAuth(
  ({ session }, { title, description }: AddTaskParams) => {
    return taskService.createTask(session.user.id, { title, description });
  },
);

export const updateTask = await requireAuth(
  async ({ session }, { id, title, description }: UpdateTaskParams) => {
    const authorId = session.user.id;
    const task = await taskService.getUserTaskByIdOrThrow(authorId, id);

    return taskService.updateTaskById(task.id, { title, description });
  },
);

export const deleteTask = await requireAuth(
  async ({ session }, { id }: DeleteTaskParams) => {
    const authorId = session.user.id;
    const task = await taskService.getUserTaskByIdOrThrow(authorId, id);

    return taskService.deleteTaskById(task.id);
  },
);

export const toggleTaskStatus = await requireAuth(
  async ({ session }, { id }: ToggleTaskParams) => {
    const authorId = session.user.id;
    const task = await taskService.getUserTaskByIdOrThrow(authorId, id);

    return taskService.updateTaskById(task.id, { completed: !task.completed });
  },
);
