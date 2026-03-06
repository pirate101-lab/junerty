# Business Platform

A production-ready, modern web application with task management, analytics, and team collaboration. Built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and NextAuth.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Radix UI
- **Backend:** Next.js Server Actions, Prisma ORM, PostgreSQL
- **Auth:** NextAuth.js (Auth.js v5)

## Features

- **Modern UI & Dark Mode** – Responsive design with seamless light/dark/system theme switching
- **Landing Page** – High-conversion landing page with animated sections
- **Authentication** – Login, Registration, Forgot Password with secure session management
- **Admin Dashboard** – Data visualizations (charts), user management, system analytics
- **Task Management** – Full CRUD, Kanban & list views, status tracking, task assignment
- **Profile & Settings** – User profile, global search, notifications dropdown

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example env and configure:

```bash
cp .env.example .env
```

Edit `.env` and set:

- `DATABASE_URL` – PostgreSQL connection string (e.g. `postgresql://postgres:postgres@localhost:5432/business_platform`)
- `NEXTAUTH_SECRET` – Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` – Your app URL (e.g. `http://localhost:3000`)

### 3. Database Setup

```bash
# Push schema to database
npm run db:push

# Seed with demo data (optional)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Credentials (after seed)

- **Admin:** admin@example.com / password123
- **User:** user@example.com / password123

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── dashboard/       # Protected dashboard routes
│   ├── api/auth/        # NextAuth API
│   └── actions/         # Server Actions
├── components/
│   ├── ui/              # Reusable UI components
│   ├── dashboard-*      # Dashboard-specific components
│   └── task-*          # Task management components
└── lib/
    ├── auth.ts         # NextAuth config
    ├── db.ts           # Prisma client
    └── utils.ts        # Utilities
```

## Database Schema

- **User** – id, email, name, password, role, image, emailVerified
- **Task** – id, title, description, status, priority, assigneeId, dueDate
- **Notification** – id, userId, title, message, read, type
- **Account, Session, VerificationToken** – NextAuth models

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run db:generate` – Generate Prisma client
- `npm run db:push` – Push schema to database
- `npm run db:seed` – Seed database
- `npm run db:studio` – Open Prisma Studio

## License

MIT
