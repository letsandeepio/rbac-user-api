import {
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const applicaton = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("update_at").defaultNow().notNull(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    applicatonId: uuid("applicationId").references(() => applicaton.id),
    password: varchar("password", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("update_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      cpk: primaryKey(users.email, users.applicatonId),
      idIndex: uniqueIndex("users_id_index").on(users.id),
    };
  }
);
