import { PrismaClient, Task, User, Assignment, TaskRole } from '@prisma/client';
import * as fs from 'fs';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const usersData = JSON.parse(
  fs.readFileSync('prisma/mocks/mock-users.json', 'utf8'),
) as Omit<User, 'id'>[];
const tasksData = JSON.parse(
  fs.readFileSync('prisma/mocks/mock-tasks.json', 'utf8'),
) as Omit<Task, 'id'>[];

const importantEmails = ['maks.naumovich@gmail.com'];

async function main() {
  console.log('Hashing passwords...');
  usersData.forEach((user, i) => {
    user.password = bcrypt.hashSync(user.password, 1);
    console.log('hashed password', i + 1, '/', usersData.length);

    return user;
  });
  console.log('Hashed');

  console.log('Deleting old assignments...');
  await prisma.assignment.deleteMany();
  console.log('Assignments deleted');

  console.log('Deleting old users...');
  await prisma.user.deleteMany({
    where: { email: { notIn: importantEmails } },
  });
  console.log('Users deleted');

  console.log('Deleting old tasks...');
  await prisma.task.deleteMany();
  console.log('Tasks deleted');

  console.log('Creating new users...');
  await prisma.user.createMany({
    data: usersData,
  });
  console.log('Users created');

  const users = await prisma.user.findMany({
    where: { email: { notIn: importantEmails } },
  });

  console.log('Creating tasks...');
  await prisma.$transaction(async (prisma) => {
    await prisma.task.createMany({
      data: tasksData,
    });

    const tasks = await prisma.task.findMany();

    const taskRoles = Object.values(TaskRole);

    const assignments: Assignment[] = tasks.map((task) => {
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
  console.log('Tasks created');
}

console.time('Execution Time');

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    console.log('Done');
    console.timeEnd('Execution Time');
  });
