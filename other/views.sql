-- user assignments view
CREATE VIEW user_assignments_view AS
SELECT
  u.id AS user_id,
  u.email,
  u.name,
  a."taskId",
  a.role,
  a.accepted,
  a."createdAt" AS assignment_created_at,
  a."updatedAt" AS assignment_updated_at
FROM
  "User" u
  LEFT JOIN "Assignment" a ON u.id = a."userId";

-- all tasks with assigned users and roles
CREATE VIEW task_assignments_view AS
SELECT
  t.id AS task_id,
  t.title,
  t.description,
  t."dueDate" AS due_date,
  t.completed,
  a."userId" AS user_id,
  a.role,
  a.accepted,
  a."createdAt" AS assignment_created_at,
  a."updatedAt" AS assignment_updated_at
FROM
  "Task" t
  LEFT JOIN "Assignment" a ON t.id = a."taskId";

-- all tasks with their owners
CREATE VIEW task_owners_view AS
SELECT
  t.id AS task_id,
  t.title,
  t.description,
  t."dueDate" AS due_date,
  t.completed,
  u.id AS owner_id,
  u.email AS owner_email,
  u.name AS owner_name
FROM
  "Task" t
  JOIN "Assignment" a ON t.id = a."taskId"
  JOIN "User" u ON a."userId" = u.id
WHERE
  a.role = 'OWNER';

-- all tasks with their viewers
CREATE VIEW task_viewers_view AS
SELECT
  t.id AS task_id,
  t.title,
  t.description,
  t."dueDate" AS due_date,
  t.completed,
  u.id AS viewer_id,
  u.email AS viewer_email,
  u.name AS viewer_name
FROM
  "Task" t
  JOIN "Assignment" a ON t.id = a."taskId"
  JOIN "User" u ON a."userId" = u.id
WHERE
  a.role = 'VIEWER';

-- users with unaccepted assignments
CREATE VIEW unaccepted_assignments_view AS
SELECT
  u.id AS user_id,
  u.email,
  u.name,
  t.id AS task_id,
  t.title AS task_title,
  a.role,
  a.accepted,
  a."createdAt" AS assignment_created_at
FROM
  "User" u
  JOIN "Assignment" a ON u.id = a."userId"
  JOIN "Task" t ON a."taskId" = t.id
WHERE
  a.accepted = false;

-- tasks with overdue assignments
CREATE VIEW overdue_tasks_view AS
SELECT
  t.id AS task_id,
  t.title,
  t.description,
  t."dueDate" AS due_date,
  t.completed,
  a."userId" AS user_id,
  a.role
FROM
  "Task" t
  JOIN "Assignment" a ON t.id = a."taskId"
WHERE
  t."dueDate" < CURRENT_DATE
  AND t.completed = false;
