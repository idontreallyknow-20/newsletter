# Daily Brief

A free morning newsletter on economics and AI, written before school and sent about 7:00 AM Eastern in English and Simplified Chinese. This repo is the whole thing: the public site at [dailybriefhq.com](https://www.dailybriefhq.com), the subscriber list, the writing dashboard, and the cron jobs that send each issue.

## Stack

Next.js 15 (App Router) and React 19, Neon Postgres with Drizzle, Resend for email, GSAP and Lenis for the front-page motion, hosted on Vercel with two daily cron jobs.

## Run it locally

```bash
cp .env.local.example .env.local   # fill in the values
npm install
npm run dev                        # http://localhost:3000
npm test
```

Open `/api/setup` once after logging in to create the tables. Environment variables, the daily schedule, the Claude Routine hand-off and the dashboard pages are documented in [docs/operations.md](docs/operations.md).

To use a portrait on the site, put a JPEG at `public/joseph.jpg`; without it a monogram is shown.

## Built by

Built by [Joseph Leung](https://josephleung-site.vercel.app), a Grade 11 student in Richmond Hill, Ontario.
