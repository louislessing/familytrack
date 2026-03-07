import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { families } from './families';

export const communications = pgTable('communications', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  fromUserId: uuid('from_user_id').notNull(),
  toUserId: uuid('to_user_id'),
  subject: varchar('subject', { length: 255 }).notNull(),
  content: text('content').notNull(),
  communicationType: varchar('communication_type', { length: 50 }).notNull(), // 'email', 'sms', 'call', 'in-person', 'app-message'
  attachmentUrl: varchar('attachment_url', { length: 500 }),
  isRead: varchar('is_read', { length: 10 }).default('false'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
