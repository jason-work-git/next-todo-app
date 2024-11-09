## Getting started

### Scripts

- `npm run dev`: start development server
- `npm run build`: build production bundle
- `npm run start`: start production server
- `npm run lint`: check for lint errors
- `npm run format`: format all source files
- `npm run seed`: seed database with mock data

### Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with the following variables:
   - `DATABASE_URL`: the URL of your Postgres database
   - `NEXTAUTH_SECRET`: a secret key for NextAuth
   - `NEXTAUTH_URL`: the URL of your NextAuth instance
4. Run `npm run seed` to seed the database with mock data
5. Run `npm run dev` to start the development server
