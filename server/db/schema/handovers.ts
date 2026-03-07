import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { families } from './families';
import { children } from './children';

export const handovers = pgTable('handovers', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  childId: uuid('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  fromUserId: uuid('from_user_id').notNull(),
  toUserId: uuid('to_user_id').notNull(),
  handoverTime: timestamp('handover_time').notNull(),
  location: varchar('location', { length: 500 }),
  photoUrl: varchar('photo_url', { length: 500 }),
  notes: text('notes'),
  childCondition: varchar('child_condition', { length: 50 }), // 'happy', 'tired', 'upset', 'ill'
  itemsHandedOver: text('items_handed_over'), // JSON array of items
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
