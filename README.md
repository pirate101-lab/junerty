# Business Platform

A modern, production-ready business platform built with Next.js 16, TypeScript, Tailwind CSS, and Prisma. Features include authentication, task management, admin dashboard, and analytics.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Radix UI components
- **Backend**: Next.js Server Actions, API Routes
- **Database**: PostgreSQL with Prisma ORM 7
- **Authentication**: NextAuth.js v5 (Auth.js) with Credentials provider

## Features

- **Landing Page**: Animated, conversion-focused landing page
- **Authentication**: Login, Registration, Forgot Password
- **Dashboard**: KPI cards, charts (Recharts), recent tasks
- **Task Management**: Full CRUD, Kanban & List views, status updates, assignment
- **User Management**: Users table (admin view)
- **Analytics**: Task distribution charts
- **Settings**: Profile management
- **Dark Mode**: System-aware theme toggle (next-themes)
- **Global Search**: Search bar in header
- **Notifications**: Notifications dropdown

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and set:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/business_platform"
AUTH_SECRET="your-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

Generate `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Run migrations (creates tables)
npx prisma migrate dev

# Or push schema without migrations
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create First User

1. Go to `/auth/register`
2. Create an account
3. Sign in at `/auth/login`
4. Access the dashboard at `/dashboard`

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, register, forgot-password)
│   ├── (dashboard)/     # Protected dashboard layout
│   ├── api/             # API routes
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # shadcn-style components
│   ├── app-sidebar.tsx
│   ├── app-header.tsx
│   ├── task-dialog.tsx
│   └── ...
├── actions/             # Server Actions
├── auth.ts              # NextAuth config
├── lib/
│   ├── db.ts           # Prisma client
│   └── utils.ts
└── middleware.ts        # Protected routes
```

## Database Schema

- **User**: id, name, email, password, role, sessions
- **Task**: id, title, description, status, priority, dueDate, creatorId, assigneeId
- **Notification**: id, title, message, type, read, userId
- **Account**, **Session**, **VerificationToken**: NextAuth models

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
