import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { families } from './families';
import { children } from './children';

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  childId: uuid('child_id').references(() => children.id, { onDelete: 'cascade' }),
  documentType: varchar('document_type', { length: 50 }).notNull(), // 'court_order', 'medical', 'school', 'legal', 'birth_certificate'
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  fileUrl: varchar('file_url', { length: 500 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: varchar('file_size', { length: 50 }),
  mimeType: varchar('mime_type', { length: 100 }),
  uploadedById: uuid('uploaded_by_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
