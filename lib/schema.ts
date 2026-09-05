import { pgTable, serial, text, timestamp, integer, index, uniqueIndex } from 'drizzle-orm/pg-core'

export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  status: text('status').notNull().default('active'),
  language: text('language').notNull().default('en'),   // 'en' | 'zh'
  frequency: text('frequency').notNull().default('weekly'), // 'weekly' | 'daily' | 'both'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const sentEmails = pgTable('sent_emails', {
  id: serial('id').primaryKey(),
  subject: text('subject').notNull(),
  previewText: text('preview_text'),
  bodyHtml: text('body_html'),
  bodyMarkdown: text('body_markdown'),
  slug: text('slug'),
  // Toronto calendar date (YYYY-MM-DD) this issue belongs to. Unique so the
  // daily cron can never send the same issue twice.
  issueDate: text('issue_date'),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  recipientCount: integer('recipient_count'),
  status: text('status').notNull().default('sent'), // 'sending' | 'sent' | 'partial' | 'failed'
}, t => ({
  issueDateUq: uniqueIndex('sent_emails_issue_date_uq').on(t.issueDate),
}))

export const drafts = pgTable('drafts', {
  id: serial('id').primaryKey(),
  subject: text('subject'),
  previewText: text('preview_text'),
  bodyMarkdown: text('body_markdown'),
  language: text('language').notNull().default('en'),
  issueDate: text('issue_date'),
  previewSentAt: timestamp('preview_sent_at'),
  skippedAt: timestamp('skipped_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, t => ({
  issueDateIdx: index('drafts_issue_date_idx').on(t.issueDate, t.language),
}))

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: text('value'),
})

// One row per cron run so the dashboard can show what happened this morning.
export const sendLog = pgTable('send_log', {
  id: serial('id').primaryKey(),
  job: text('job').notNull(),          // 'generate' | 'send' | 'skip'
  issueDate: text('issue_date'),
  status: text('status').notNull(),    // 'ok' | 'skipped' | 'error'
  message: text('message'),
  detail: text('detail'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Subscriber = typeof subscribers.$inferSelect
export type SentEmail = typeof sentEmails.$inferSelect
export type Draft = typeof drafts.$inferSelect
export type Setting = typeof settings.$inferSelect
export type SendLogRow = typeof sendLog.$inferSelect
