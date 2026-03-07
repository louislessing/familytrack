import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const families = pgTable('families', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const familyMembers = pgTable('family_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  role: varchar('role', { length: 50 }).notNull(), // 'parent', 'guardian', 'social_worker', 'foster_carer'
  isAdmin: varchar('is_admin', { length: 10 }).default('false'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});
