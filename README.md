# Business Platform

A modern, production-ready SaaS business platform built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- **Modern UI & Dark Mode** - Polished, responsive design with seamless dark/light/system theme support
- **High-Conversion Landing Page** - Animated, modern landing page funneling users to auth
- **Authentication** - Login, Registration, Forgot Password with NextAuth + credentials
- **Admin Dashboard** - Data visualizations, user management, system analytics
- **Task Management** - Full CRUD, Kanban board, status changes, task assignment
- **Rich Features** - User profile, settings, global search, notifications

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui (Radix)
- **Backend**: Next.js Server Actions, API Routes
- **Database**: Prisma ORM, PostgreSQL
- **Auth**: NextAuth.js (Auth.js)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and update:

   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

3. **Initialize database**

   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Scripts

- `npm run dev` - Start dev server (Turbopack)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, register, forgot-password)
│   ├── api/             # API routes
│   ├── dashboard/       # Protected dashboard pages
│   └── actions/         # Server actions
├── components/
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Sidebar, header
│   ├── tasks/           # Task management components
│   └── ui/              # shadcn/ui components
└── lib/                 # Utilities, auth, prisma
```

## License

MIT
