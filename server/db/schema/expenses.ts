import { pgTable, uuid, varchar, timestamp, text, decimal, date } from 'drizzle-orm/pg-core';
import { families } from './families';
import { children } from './children';

export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  childId: uuid('child_id').references(() => children.id, { onDelete: 'set null' }),
  category: varchar('category', { length: 50 }).notNull(), // 'clothing', 'food', 'education', 'medical', 'activities', 'transport'
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('GBP'),
  description: text('description').notNull(),
  expenseDate: date('expense_date').notNull(),
  receiptUrl: varchar('receipt_url', { length: 500 }),
  paidById: uuid('paid_by_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
