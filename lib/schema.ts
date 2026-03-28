import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const sentEmails = pgTable('sent_emails', {
  id: serial('id').primaryKey(),
  subject: text('subject').notNull(),
  previewText: text('preview_text'),
  bodyHtml: text('body_html'),
  bodyMarkdown: text('body_markdown'),
  slug: text('slug'),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  recipientCount: integer('recipient_count'),
  status: text('status').notNull().default('sent'),
})

export const drafts = pgTable('drafts', {
  id: serial('id').primaryKey(),
  subject: text('subject'),
  previewText: text('preview_text'),
  bodyMarkdown: text('body_markdown'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: text('value'),
})

export type Subscriber = typeof subscribers.$inferSelect
export type SentEmail = typeof sentEmails.$inferSelect
export type Draft = typeof drafts.$inferSelect
export type Setting = typeof settings.$inferSelect
