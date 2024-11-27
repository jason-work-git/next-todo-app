import { Task } from '@prisma/client';
import { taskService } from './service';

export type DetailedTask = NonNullable<
  Awaited<ReturnType<typeof taskService.getDetailedUserTaskById>>
>;

export type AddTaskDto = Pick<Task, 'title' | 'description' | 'dueDate'> &
  Partial<Pick<Task, 'id' | 'completed' | 'createdAt' | 'updatedAt'>>;

export type UpdateTaskDto = Omit<
  Partial<Task> & {
    id: Task['id'];
  },
  'createdAt' | 'updatedAt'
>;

export type DeleteTaskDto = {
  id: Task['id'];
};
