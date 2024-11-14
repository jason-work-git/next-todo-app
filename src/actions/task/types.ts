import { Task } from '@prisma/client';

export type AddTaskParams = {
  title: Task['title'];
  description?: Task['description'];
};

export type UpdateTaskParams = {
  id: Task['id'];
  title?: Task['title'];
  description?: Task['description'];
};

export type DeleteTaskParams = {
  id: Task['id'];
};

export type ToggleTaskParams = {
  id: Task['id'];
};
