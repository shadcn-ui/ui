import {
    timestamp,
    text,
    primaryKey,
    integer,
    pgEnum,
    jsonb,
    pgTable,
  } from "drizzle-orm/pg-core";
  import { type AdapterAccount } from "next-auth/adapters";
import { relations } from "drizzle-orm";
  
  /**
   * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
   * database instance for multiple projects.
   *
   * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
   */
  
  export const roleEnum = pgEnum('role', ["USER", "OWNER"])
  export const componentsEnum = pgEnum('components', ['components:ui', 'components:component', 'components:example', 'components:addons'])
  
  
  export const users = pgTable("user", {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    username: text("username").unique().notNull(),
    role: roleEnum('role').default("USER")
  });
  
  export const accounts = pgTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccount["type"]>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      refresh_token_expires_in: integer("refresh_token_expires_in"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    },
    (account) => ({
      compoundKey: primaryKey(account.provider, account.providerAccountId),
    }),
  );
  
  export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  });
  
  export const verificationTokens = pgTable(
    "verificationToken",
    {
      identifier: text("identifier").notNull(),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
      compoundKey: primaryKey(vt.identifier, vt.token),
    }),
  );

  export const packages = pgTable(
    "packages",
    {
      name: text("name").notNull().primaryKey(),
      description: text("description").notNull(),
      author: text("author").notNull(),
      created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
      updated_at: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
      version: text("version").notNull(),
      downloads: integer('downloads').default(0).notNull(),
      type: componentsEnum('components').default("components:addons"),
      dependencies: text('dependencies').array(),
      registryDependencies: text('registryDependencies').array(),
      files: jsonb("files").notNull()
    },
  )

  export const usersRelations = relations(users, ({ many }) => ({
    packages: many(packages),
  }));

  export const packagesRelations = relations(packages, ({ one }) => ({
    author: one(users, {
      fields: [packages.author],
      references: [users.id],
    }),
  }));