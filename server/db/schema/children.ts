import { pgTable, uuid, varchar, timestamp, text, date } from 'drizzle-orm/pg-core';
import { families } from './families';

export const children = pgTable('children', {
  id: uuid('id').defaultRandom().primaryKey(),
  familyId: uuid('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  gender: varchar('gender', { length: 20 }),

  // Medical Information
  medicalNotes: text('medical_notes'),
  allergies: text('allergies'),
  medications: text('medications'),
  doctorName: varchar('doctor_name', { length: 255 }),
  doctorPhone: varchar('doctor_phone', { length: 20 }),

  // School Information
  schoolName: varchar('school_name', { length: 255 }),
  schoolYear: varchar('school_year', { length: 50 }),
  teacherName: varchar('teacher_name', { length: 255 }),
  schoolPhone: varchar('school_phone', { length: 20 }),

  // Additional Info
  photoUrl: varchar('photo_url', { length: 500 }),
  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
