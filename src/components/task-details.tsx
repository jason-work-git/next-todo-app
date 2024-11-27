'use client';

import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { DeleteTaskButton } from './delete-task-button';

import { TaskRole } from '@prisma/client';
import { useTaskDrawerData } from './task-drawer-provider';
import useUpdateTaskMutation from '@/hooks/useUpdateTaskMutation';
import { EditFormData, EditTaskForm } from './edit-task-form';
import { ShareTaskButton } from './share-task-button';
import { DetailedTask } from '@/actions/task/types';
import { InfoIcon } from 'lucide-react';
import { User } from 'next-auth';

export const TaskDetails = ({
  task,
  user,
}: {
  task: DetailedTask;
  user: Required<User>;
}) => {
  const { close } = useTaskDrawerData();
  const { mutate } = useUpdateTaskMutation({
    onMutate: () => close(),
  });

  const isShared = task.assignments.length > 1;
  const owner = task.assignments.find((a) => a.role === TaskRole.OWNER)?.user;
  const role = task.assignments.find((a) => a.userId === user.id)
    ?.role as TaskRole;

  const handleSubmit = (formData: EditFormData) => {
    mutate({
      id: task.id,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
    });
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Edit task</DrawerTitle>
        <DrawerDescription>Provide new task details</DrawerDescription>
      </DrawerHeader>

      {role === TaskRole.OWNER && (
        <>
          {isShared && (
            <div className="px-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <InfoIcon className="text-blue-500" />
                <span>This task has been shared to: </span>
              </div>
              <ul className="list-disc pl-8">
                {task.assignments
                  .filter((a) => a.role !== TaskRole.OWNER)
                  .map((a) => (
                    <li key={a.id}>
                      {a.user.name} ({a.user.email})
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end px-4 mb-2">
            <ShareTaskButton variant={'ghost'} taskId={task.id} />
          </div>
        </>
      )}

      <EditTaskForm
        disabled={role === TaskRole.VIEWER}
        className="pb-0"
        initialState={{
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
        }}
        onSubmit={handleSubmit}
      />

      <DrawerFooter>
        {isShared && owner && role !== TaskRole.OWNER && (
          <div className="px-4 flex gap-2">
            <InfoIcon className="text-blue-500" />
            <div>
              <span>
                This task has been shared by: {owner.name} ({owner.email})
              </span>
              <br />
              <span>
                {role === TaskRole.VIEWER && 'You can only view it'}
                {role === TaskRole.EDITOR && 'You can edit it'}
              </span>
            </div>
          </div>
        )}
        {role === TaskRole.OWNER && (
          <DeleteTaskButton taskId={task.id} onDelete={close} />
        )}
      </DrawerFooter>
    </>
  );
};
