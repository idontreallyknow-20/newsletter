# NewsletterHQ

A full-stack newsletter management app for sending daily AI & economy update emails.

## Stack

- Next.js 14 (App Router) + Tailwind CSS
- Neon PostgreSQL + Drizzle ORM
- Resend (email delivery)
- Vercel (hosting + cron)

## Setup

### 1. Create a Neon database

Go to [neon.tech](https://neon.tech), create a free account, create a project, and copy the connection string.

### 2. Get a Resend API key

Go to [resend.com](https://resend.com), create a free account, and copy your API key.

### 3. Set environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```
RESEND_API_KEY=re_your_key_here
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
CRON_SECRET=any_random_string_you_make_up
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Push the database schema

```bash
npx drizzle-kit push
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com), import the repo
3. Add all 4 environment variables in the Vercel dashboard (Settings → Environment Variables)
4. Change `NEXT_PUBLIC_BASE_URL` to your Vercel deployment URL
5. Deploy

The cron job (`vercel.json`) runs every hour and auto-sends if the schedule conditions are met.

## Pages

| Page | URL |
|---|---|
| Dashboard | `/` |
| Compose | `/compose` |
| Subscribers | `/subscribers` |
| Schedule | `/schedule` |
| History | `/history` |
| Settings | `/settings` |
