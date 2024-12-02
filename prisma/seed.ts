import {
  PrismaClient,
  Task,
  User as PrismaUser,
  Assignment,
  TaskRole,
} from '@prisma/client';
import * as fs from 'fs';
import * as bcrypt from 'bcryptjs';

type MockUser = Omit<PrismaUser, 'id' | 'password'> & {
  password: string;
};

const prisma = new PrismaClient();
const usersData = JSON.parse(
  fs.readFileSync('prisma/mocks/mock-users.json', 'utf8'),
) as MockUser[];
const tasksData = JSON.parse(
  fs.readFileSync('prisma/mocks/mock-tasks.json', 'utf8'),
) as Omit<Task, 'id'>[];

const importantUsers = [
  {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'password',
    verified: true,
  },
];

const hashPasswords = (users: MockUser[]) => {
  console.group('Hashing passwords...');
  for (let i = 0; i < users.length; i++) {
    users[i].password = bcrypt.hashSync(users[i].password, 1);
    console.log('hashed password', i + 1, '/', users.length);
  }
  console.groupEnd();
  console.log('Hashed');
};

const deleteOldData = async () => {
  console.log('Deleting old assignments...');
  await prisma.assignment.deleteMany();
  console.log('Assignments deleted');

  console.log('Deleting old users...');
  await prisma.user.deleteMany({
    where: { email: { notIn: importantUsers.map((u) => u.email) } },
  });
  console.log('Users deleted');

  console.log('Deleting old tasks...');
  await prisma.task.deleteMany();
  console.log('Tasks deleted');
};

const createNewData = async () => {
  console.log('Creating new users...');
  const users = await prisma.user.createManyAndReturn({
    data: usersData,
  });
  console.log('Users created');

  console.log('Creating tasks and assignments...');
  await prisma.$transaction(async (prisma) => {
    const tasks = await prisma.task.createManyAndReturn({
      data: tasksData,
    });

    const taskRoles = Object.values(TaskRole);

    const assignments: Omit<Assignment, 'id'>[] = tasks.map((task) => {
      return {
        role: taskRoles[Math.floor(Math.random() * taskRoles.length)],
        taskId: task.id,
        accepted: Math.random() > 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: users[Math.floor(Math.random() * users.length)].id,
      };
    });

    await prisma.assignment.createMany({
      data: assignments,
    });

    return tasks;
  });
  console.log('Tasks and assignments created');
};

const createImportantUserAndTasksIfNotExists = async () => {
  console.log('Creating important user if needed...');

  const importantUser = await prisma.user.findUnique({
    where: { email: importantUsers[0].email },
  });

  if (!importantUser) {
    await prisma.user.create({
      data: {
        ...importantUsers[0],
        password: bcrypt.hashSync(importantUsers[0].password, 1),
      },
    });

    console.log('Important user created');
  } else {
    console.log('Important user already exists');
  }

  console.log('Creating tasks for important user...');

  await prisma.task.create({
    data: {
      title: 'Important task',
      description: 'Important task description',
      dueDate: new Date(),
      assignments: {
        create: {
          role: TaskRole.OWNER,
          accepted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            connect: {
              email: importantUsers[0].email,
            },
          },
        },
      },
    },
  });
  console.log('Tasks created');
};

async function main() {
  hashPasswords(usersData);
  await deleteOldData();
  await createNewData();
  await createImportantUserAndTasksIfNotExists();
}

console.time('Execution Time');

main()
  .then(async () => {
    console.log('Done');
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.timeEnd('Execution Time');
  });
