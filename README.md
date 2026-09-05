# Daily Brief

Joseph's morning newsletter on economics and AI. Public site, subscriber management, and a fully automatic daily send that runs in the cloud.

Live at [dailybriefhq.com](https://dailybriefhq.com).

## Stack

- Next.js 14 (App Router), Tailwind for the admin, hand-written CSS for the public site
- react-three-fiber + drei for the hero ribbon, Lenis for smooth scrolling
- Neon PostgreSQL + Drizzle ORM
- Resend for delivery, Anthropic API for the morning draft (with web search)
- Vercel for hosting and the two daily cron jobs

## How a morning works

Everything is keyed by the **issue date**, the calendar day in `America/Toronto`. The cron jobs never check the clock. They ask the database whether today's step is done.

| UTC | Toronto (summer / winter) | Route | What happens |
|---|---|---|---|
| 09:00 | 5:00 / 4:00 AM | `/api/cron/generate` | Writes today's issue (Claude Opus 5 with web search, no-search fallback that forbids invented citations), writes the Chinese edition, emails a **preview to you** with a one-tap *Skip today's send* link. |
| 11:00 | 7:00 / 6:00 AM | `/api/cron/send` | Sends to subscribers, unless autosend is off, today is skipped, no preview was delivered, or it already went out. |

Safety rails:

- A unique index on `sent_emails.issue_date` means a second trigger on the same day does nothing.
- The send refuses to run if the preview never reached you.
- Autosend has a kill switch on the Settings and Schedule pages.
- Every run is written to `send_log` and shown on the dashboard. Failures email you.

Vercel Hobby crons are UTC only and can fire anywhere inside the hour. If you want the send at exactly 7:00 AM Toronto year-round, add a free [cron-job.org](https://cron-job.org) job for `GET https://dailybriefhq.com/api/cron/send` at 07:00 `America/Toronto` with the header `Authorization: Bearer <CRON_SECRET>`. The idempotency above makes the extra trigger harmless.

## Environment variables (Vercel, Production)

| Name | Purpose |
|---|---|
| `DATABASE_URL` | Neon connection string |
| `RESEND_API_KEY` | Resend API key |
| `FROM_EMAIL` | Sender address on a domain verified in Resend (the Settings page value overrides this) |
| `OWNER_EMAIL` | Where previews, test sends, and failure alerts go (Settings page overrides) |
| `ANTHROPIC_API_KEY` | Morning draft generation and translation |
| `CRON_SECRET` | Bearer token the cron routes require |
| `EMAIL_TOKEN_SECRET` | Signs unsubscribe, preferences, and skip links |
| `DASHBOARD_PASSWORD` | Admin login |
| `NEXT_PUBLIC_BASE_URL` | `https://dailybriefhq.com` |

## First run after deploying

1. Log in to the dashboard and open `/api/setup` once. It creates any missing tables, columns, and the unique index. Safe to repeat.
2. Set your email and the from address on **Settings**.
3. On **Schedule**, pick every day, weekdays, or weekly, choose the weekly edition day, and turn on automatic sending. Daily readers get every issue; weekly readers get the one sent on the weekly edition day.
4. Optional dry run from a terminal:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://dailybriefhq.com/api/cron/generate
curl -H "Authorization: Bearer $CRON_SECRET" https://dailybriefhq.com/api/cron/send
```

The first call returns `{ ok, issueDate, subject, searched, previewSentTo }` and the preview lands in your inbox. The second returns `{ ok, sent }` the first time and `{ skipped, reason: "already_sent" }` if you run it again.

## Local development

```bash
cp .env.local.example .env.local   # fill in values
npm install
npm run dev
npm test
```

## Site

The public site keeps the newsletter's section headers (About, Topics, Issues, Subscribe). The hero is a chrome ribbon carrying the newsletter's own headlines, rendered in WebGL and layered between two lines of the masthead type. Reduced-motion users and browsers without WebGL get `public/img/ribbon-poster.png` instead. Drop a portrait at `public/joseph.jpg` to replace the monogram in the About section.

## Pages

| Page | URL |
|---|---|
| Front page | `/` |
| Issue | `/issues/[slug]` |
| Subscribe | `/subscribe` |
| Dashboard | `/dashboard` |
| Compose | `/compose/en`, `/compose/zh` |
| Subscribers | `/subscribers` |
| Schedule | `/schedule` |
| History | `/history` |
| Settings | `/settings` |
