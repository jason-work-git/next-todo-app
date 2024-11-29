'use server';

import { Assignment, Task, TaskRole, User } from '@prisma/client';
import { assignmentService } from './service';
import { userService } from '../user/service';
import { requireAuth } from '../auth/middlewares';

export const shareTask = async ({
  taskId,
  role,
  email,
}: {
  taskId: Task['id'];
  role: TaskRole;
  email: User['email'];
}) => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new Error('User not found.');
  }

  return assignmentService.createAssignment({
    taskId,
    role,
    userId: user.id,
  });
};

export const getNewNonOwnerAssignmentsCount = requireAuth(
  async ({ session }) => {
    return assignmentService.getNewUserNonOwnerAssignmentsCount(
      session.user.id,
    );
  },
);

export const getTaskAssignments = requireAuth(async (_, taskId: Task['id']) => {
  return assignmentService.getTaskAssignments(taskId);
});

export const getNonOwnerAssignments = requireAuth(async ({ session }) => {
  return assignmentService.getUserNonOwnerAssignments(session.user.id);
});

export const getDetailedNonOwnerAssignments = requireAuth(
  async ({ session }) => {
    return assignmentService.getDetailedUserNonOwnerAssignments(
      session.user.id,
    );
  },
);

export type UpdateAcceptedStatusDto = {
  id: Assignment['id'];
  accepted: Assignment['accepted'];
};

export const updateAssignmentAcceptedStatus = requireAuth(
  async ({ session }, { id, accepted }: UpdateAcceptedStatusDto) => {
    const userId = session.user.id;

    const assignment = await assignmentService.getAssignmentById(id);

    if (!assignment || assignment.userId !== userId) {
      throw new Error('Unauthorized');
    }

    return assignmentService.updateAssignment(id, {
      accepted,
    });
  },
);
