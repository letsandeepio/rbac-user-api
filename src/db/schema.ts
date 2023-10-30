import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const applicatons = pgTable("applications", {
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
    applicationId: uuid("applicationId").references(() => applicatons.id),
    password: varchar("password", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("update_at").defaultNow().notNull(),
  },
  (_users) => {
    return {
      cpk: primaryKey(_users.email, _users.applicationId),
      idIndex: uniqueIndex("users_id_index").on(_users.id),
    };
  }
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    applicationId: uuid("applicationId").references(() => applicatons.id),
    permissions: text("permissions").array().$type<Array<string>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("update_at").defaultNow().notNull(),
  },
  (_roles) => {
    return {
      cpk: primaryKey(_roles.name, _roles.applicationId),
      idIndex: uniqueIndex("roles_id_index").on(_roles.id),
    };
  }
);

export const userToRoles = pgTable(
  "userToRoles",
  {
    applicationId: uuid("applicationId")
      .references(() => applicatons.id)
      .notNull(),

    roleId: uuid("roleId")
      .references(() => roles.id)
      .notNull(),

    userId: uuid("userId")
      .references(() => users.id)
      .notNull(),
  },
  (_userToRoles) => {
    return {
      cpk: primaryKey(
        _userToRoles.applicationId,
        _userToRoles.roleId,
        _userToRoles.userId
      ),
    };
  }
);
