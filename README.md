# Next Todo App Documentation

## Table of Contents

- [Getting Started](#getting-started)
- [Setup](#setup)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (>= 20.x)
- npm (>= 10.x)

### Cloning the Repository

```bash
git clone https://github.com/Junk-debug/next-todo-app
cd next-todo-app
```

### Installing Dependencies

```bash
npm install
```

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory by copying the provided `.env.example` file:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file to satisfy .env.example requirements.

#### How to Obtain the Database URL

One option is to use [Vercel’s free storage](https://vercel.com/docs/storage/vercel-postgres). You can follow [Vercel's official guide](https://vercel.com/docs/storage/vercel-postgres/get-started) to create a free PostgreSQL database.

### 3. Seed the Database

Run the following command to populate the database with mock data:

```bash
npm run seed
```

### 4. Start the Development Server

```bash
npm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000).

---

## Scripts

The project includes several npm scripts to streamline development:

| Script           | Description                      |
| ---------------- | -------------------------------- |
| `npm run dev`    | Start the development server     |
| `npm run build`  | Build the project for production |
| `npm run start`  | Start the production server      |
| `npm run lint`   | Check for linting errors         |
| `npm run format` | Format all source files          |
| `npm run seed`   | Seed the database with mock data |

Additional build-related scripts:

| Script               | Description                  |
| -------------------- | ---------------------------- |
| `npm run build:seed` | Compile the seed script      |
| `npm run seed`       | Run the compiled seed script |

---

## Technologies Used

The project is built using the following technologies:

### Frontend

- **Next.js (v15.0.1)**: React framework for server-side rendering and static site generation.
- **React (v19.0.0)**: Core library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Radix UI**: Accessible React components (used for tabs and labels).
- **Lucide Icons**: Icon library for SVG icons.

### Backend

- **NextAuth.js (v5.0.0-beta.25)**: Authentication library for Next.js.
- **Prisma**: ORM for database management and migrations.
- **PostgreSQL**: Database used for storing application data.
- **bcryptjs**: Library for hashing and comparing passwords.

### State Management

- **TanStack React Query**: For managing server state and data fetching.

### Validation

- **Zod**: Type-safe schema validation.

### Development Tools

- **TypeScript**: Static type checking.
- **ESLint**: Code linting tool.
- **Prettier**: Code formatting tool.
- **Turbopack**: High-performance bundler for Next.js.
