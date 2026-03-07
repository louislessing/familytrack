import { pgTable, uuid, varchar, timestamp, text, boolean } from 'drizzle-orm/pg-core';
import { families } from './families';
import { children } from './children';

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  childId: uuid('child_id').references(() => children.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  eventType: varchar('event_type', { length: 50 }).notNull(), // 'appointment', 'school', 'activity', 'custody', 'medical'
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  location: varchar('location', { length: 500 }),
  isRecurring: boolean('is_recurring').default(false),
  recurrencePattern: varchar('recurrence_pattern', { length: 100 }), // 'daily', 'weekly', 'monthly'
  createdById: uuid('created_by_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
