import { generateId } from '@/shared/infra/generate-id';
import { ID_LENGHT, userPlanEnum } from '@/shared/infra/import.schema';
import { index, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const usersSchema = pgTable(
  'users',
  {
    id: varchar('id', { length: ID_LENGHT })
      .primaryKey()
      .$defaultFn(() => generateId({ type: 'cuid' })),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password_hash: varchar('password_hash', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    municipality: varchar('municipality', { length: 255 }).notNull(),
    plan: userPlanEnum('plan').notNull().default('free'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('idx_users_email_unique').on(table.email),
    index('idx_users_created_at').on(table.createdAt),
  ],
);

export type User = typeof usersSchema.$inferSelect;
export type NewUser = typeof usersSchema.$inferInsert;
