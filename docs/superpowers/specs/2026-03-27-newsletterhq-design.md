# NewsletterHQ — Design Spec
**Date:** 2026-03-27
**Status:** Approved

---

## Overview

NewsletterHQ is a full-stack newsletter management application for sending daily AI & economy update emails. It is a personal tool for one operator (Joseph) to manage subscribers, compose and send emails, schedule automated sends, and review send history. It will be deployed to Vercel and connected to the `idontreallyknow-20/newsletter` GitHub repo.

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server components, API routes, file-based routing |
| Styling | Tailwind CSS | Spec requirement, utility-first |
| Email provider | Resend SDK | Spec requirement |
| Database | Neon (PostgreSQL) | Hosted serverless Postgres, works on Vercel |
| ORM | Drizzle ORM | Lightweight, type-safe, works with Neon serverless driver |
| Scheduling | Vercel Cron Jobs | Replaces node-cron; triggers `/api/cron/send` on schedule |
| Deployment | Vercel | Connected to GitHub repo, auto-deploys on push |
| Markdown | `marked` | Client-side markdown → HTML for live preview |
| Toasts | `react-hot-toast` | User feedback for all async actions |
| Fonts | Google Fonts (Playfair Display + Inter) | Editorial aesthetic |

---

## Database Schema (Neon PostgreSQL via Drizzle ORM)

### `subscribers`
| Column | Type | Notes |
|---|---|---|
| id | serial primary key | |
| name | text | |
| email | text unique not null | |
| status | text | `active` or `unsubscribed` |
| created_at | timestamp | default now() |

### `sent_emails`
| Column | Type | Notes |
|---|---|---|
| id | serial primary key | |
| subject | text not null | |
| preview_text | text | |
| body_html | text | Final rendered HTML sent |
| body_markdown | text | Source markdown |
| sent_at | timestamp | default now() |
| recipient_count | integer | |
| status | text | `sent` or `failed` |

### `drafts`
| Column | Type | Notes |
|---|---|---|
| id | serial primary key | |
| subject | text | |
| preview_text | text | |
| body_markdown | text | |
| updated_at | timestamp | default now(), updates on save |

### `settings`
| Column | Type | Notes |
|---|---|---|
| key | text primary key | |
| value | text | |

Settings keys: `from_name`, `from_email`, `owner_email`, `newsletter_name`, `newsletter_description`, `schedule_frequency`, `schedule_time`, `schedule_day`

**Note:** The Resend API key is stored as a Vercel environment variable (`RESEND_API_KEY`), not in the database. It is a secret and must not be persisted in the DB.

**Migration:** Run `drizzle-kit push` once after setting up Neon to create all tables. No ongoing migration files needed for this project scale.

---

## Pages

### `/` — Dashboard
- Stats cards (animated count-up on mount): total subscribers, emails sent, open rate placeholder, next scheduled send
- Recent sends table (last 10): subject, date, recipient count, status badge
- Quick "Compose" button

### `/compose` — Compose
- Left panel: subject input, preview text input, markdown body textarea with toolbar (bold, italic, H2, bullets, horizontal rule, link)
- Right panel: live HTML email preview, re-renders as user types (client-side via `marked`)
- Actions: "Send Now" (to all active subscribers), "Save Draft", "Send Test to Myself"
- All buttons show loading spinner while in-flight

### `/subscribers` — Subscribers
- Paginated table: name, email, date added, status badge
- "Add Subscriber" inline form
- "Import CSV" button — parses file client-side, POST bulk to `/api/subscribers/import`
- "Export CSV" button — GET `/api/subscribers/export`
- Per-row delete with confirmation modal

### `/schedule` — Schedule
- Frequency selector: Daily, Weekdays only, Weekly, Manual
- Time picker (hour + minute)
- Day picker (shown only for Weekly)
- Displays next 5 scheduled send times based on current config
- Shows current cron expression
- **Note:** The actual Vercel Cron schedule in `vercel.json` defaults to daily at 8am UTC. Changing the frequency requires a redeploy. The UI will display a notice explaining this clearly.

### `/history` — History
- Table of all sent emails: subject, sent date, recipient count, status badge
- Click any row to open a modal showing the full rendered HTML of that email

### `/settings` — Settings
- From name, from email (display only — email sending identity)
- Owner email (used for test sends)
- Newsletter name and description
- All saved to `settings` table in DB via `/api/settings`
- Resend API key is NOT editable here — UI notes that it must be set in the Vercel dashboard

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/send` | POST | Send to all active subscribers via Resend |
| `/api/send-test` | POST | Send to owner email only |
| `/api/subscribers` | GET | List all subscribers |
| `/api/subscribers` | POST | Add single subscriber |
| `/api/subscribers/[id]` | DELETE | Remove subscriber |
| `/api/subscribers/import` | POST | Bulk insert from parsed CSV data |
| `/api/subscribers/export` | GET | Return CSV file download |
| `/api/drafts` | GET | List all drafts |
| `/api/drafts` | POST | Create or update draft |
| `/api/history` | GET | List all sent emails |
| `/api/schedule` | GET | Get current schedule settings |
| `/api/schedule` | POST | Update schedule settings |
| `/api/settings` | GET | Get all settings |
| `/api/settings` | POST | Upsert settings keys |
| `/api/cron/send` | POST | Called by Vercel Cron — reads schedule, sends if due |

---

## UI Design System

- **Background:** `#0A0A0A`
- **Primary text:** `#F5F0E8`
- **Borders:** white at 10–15% opacity (`rgba(255,255,255,0.1)`)
- **Accent:** subtle gold/amber tones for active states
- **Headings:** Playfair Display (Google Fonts)
- **Body:** Inter (Google Fonts)
- **Sidebar:** fixed left, 240px wide, collapses to hamburger menu on mobile
- **Cards:** dark surface (`#111111`), 1px border, generous padding
- **Stats cards:** CSS count-up animation on mount
- **Toasts:** react-hot-toast, bottom-right, dark themed
- **Modals:** confirmation required for all destructive actions (delete subscriber, send to all)
- **Buttons:** loading spinner state while async in-flight
- **Fully mobile responsive**

---

## Email Template

- Inline CSS only (email client safe)
- Max-width 600px, centered
- Header: newsletter name in Playfair Display
- Two content sections: "AI Updates" and "Economy" with visual dividers
- Body text: rendered from markdown
- Footer: unsubscribe link → `GET /api/unsubscribe?email=...` sets subscriber status to `unsubscribed`
- Compatible with Gmail, Apple Mail, Outlook

---

## Scheduling (Vercel Cron)

`vercel.json` defines a cron job pointing to `/api/cron/send`. Default schedule: daily at 8am UTC. The `/api/cron/send` route reads the `schedule_frequency` from the settings table to determine if a send should fire (e.g., skips weekends if "Weekdays only"). Changing the base cron expression requires updating `vercel.json` and redeploying.

---

## Environment Variables

```
RESEND_API_KEY=re_your_key_here
DATABASE_URL=postgresql://...  (from Neon dashboard)
CRON_SECRET=some_random_secret  (to secure the cron endpoint)
```

### `.env.local.example`
```
RESEND_API_KEY=re_your_key_here
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
CRON_SECRET=replace_with_random_string
```

---

## Project Structure

```
newsletter/
├── app/
│   ├── layout.tsx          # Root layout with sidebar + Google Fonts
│   ├── page.tsx            # Dashboard
│   ├── compose/page.tsx
│   ├── subscribers/page.tsx
│   ├── schedule/page.tsx
│   ├── history/page.tsx
│   ├── settings/page.tsx
│   └── api/
│       ├── send/route.ts
│       ├── send-test/route.ts
│       ├── subscribers/route.ts
│       ├── subscribers/[id]/route.ts
│       ├── subscribers/import/route.ts
│       ├── subscribers/export/route.ts
│       ├── drafts/route.ts
│       ├── history/route.ts
│       ├── schedule/route.ts
│       ├── settings/route.ts
│       └── cron/send/route.ts
├── components/
│   ├── Sidebar.tsx
│   ├── StatsCard.tsx
│   ├── SubscriberTable.tsx
│   ├── ComposeEditor.tsx
│   ├── EmailPreview.tsx
│   ├── MarkdownToolbar.tsx
│   ├── ConfirmModal.tsx
│   └── Toast.tsx
├── lib/
│   ├── db.ts               # Drizzle + Neon client
│   ├── schema.ts           # Drizzle table definitions
│   ├── email.ts            # Resend send logic + HTML template
│   └── markdown.ts         # marked config
├── drizzle.config.ts
├── vercel.json             # Cron job config
├── .env.local.example
├── README.md
└── docs/
    └── superpowers/specs/
        └── 2026-03-27-newsletterhq-design.md
```

---

## Out of Scope

- User authentication (this is a personal tool, no login needed)
- Open rate tracking (placeholder stat on dashboard only)
- Multiple newsletters or users
- Rich text WYSIWYG editor (markdown toolbar is sufficient)
