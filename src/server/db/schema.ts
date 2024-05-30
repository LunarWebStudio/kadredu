import { relations, sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

export const createTable = pgTableCreator(name => `kadredu_${name}`);

// https://medium.com/@Furki4_4/make-your-image-loading-blurry-in-next-js-0f0e5bf3dc7c
export const images = createTable("images", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  storageId: varchar("storageId", { length: 255 }).notNull(),
  blurPreview: text("blurPreview").notNull(),
});

export const buildings = createTable("buildings", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  title: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),

  createdById: text("createdById").references(() => users.id),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const buildingsRelations = relations(buildings, ({ many, one }) => ({
  groups: many(groups),
  createdBy: one(users)
}))

export const groups = createTable("groups", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),

  buildingId: text("buildingId").references(() => buildings.id).notNull(),
  imageId: text("imageId").references(() => images.id),
});

export const groupsRelations = relations(groups, ({ many, one }) => ({
  users: many(users),
  image: one(images),
  building: one(buildings),
}));

export const rolesEnum = pgEnum("role", [
  "ADMIN",
  "LEAD_CYCLE_COMISSION",
  "TEACHER",
  "EMPLOYER",
  "STUDENT",
  "UNKNOWN",
]);
export const roleSchema = z.enum(rolesEnum.enumValues);
export type Role = z.infer<typeof roleSchema>;

export const users = createTable("user", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),

  name: varchar("name", { length: 255 }),

  image: varchar("image", { length: 255 }),
  profilePictureId: text("profilePictureId").references(() => images.id, { onDelete: "set null" }),
  description: text("description"),

  experiencePoints: integer("experiencePoints").notNull().default(0),
  coins: integer("coins").notNull().default(0),

  role: rolesEnum("role").default("UNKNOWN").array().notNull().default(sql`ARRAY[]::role[]`),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),

  verified: boolean("verified").notNull().default(false),
  onboarding: boolean("onboarding").notNull().default(false),

  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  groupId: text("groupId").references((): AnyPgColumn => groups.id),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  group: one(groups, { fields: [users.groupId], references: [groups.id] }),
  profilePicture: one(images, { fields: [users.profilePictureId], references: [images.id] }),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  session => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  vt => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
