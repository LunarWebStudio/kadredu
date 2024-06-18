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

export const statusEnum = pgEnum("role", [
  "SEARCH",
  "WORK",
  "OPEN_TO_OFFERS"
]);

export const statusSchema = z.enum(statusEnum.enumValues, {
  message: "Недопустимый статус"
});

export type Status = z.infer<typeof statusSchema>;

export const resume = createTable("resumes", {
  id: text("id")
  .$defaultFn(()=> createId())
  .notNull()
  .primaryKey(),
  userId:text("userId")
  .notNull()
  .unique()
  .references(()=>users.id),
  roleId: text("roleId")
  .references(()=>teamRoles.id)
  .notNull(),
  status:statusEnum("status")
  .default("SEARCH")
  .notNull(),
  experience: text("experience")
});

export const resumeRelations = relations(resume,({one})=>({
  role:one(teamRoles,{fields:[resume.roleId],references:[teamRoles.id]}),
  user:one(users,{fields:[resume.userId],references:[users.id]})
}))

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
  createdBy: one(users, { fields: [buildings.createdById], references: [users.id] }),
}))

export const groups = createTable("groups", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),

  buildingId: text("buildingId").references(() => buildings.id, { onDelete: "cascade" }).notNull(),
  imageId: text("imageId").references(() => images.id, { onDelete: "cascade" }).notNull(),
});

export const groupsRelations = relations(groups, ({ many, one }) => ({
  users: many(users),
  image: one(images, { fields: [groups.imageId], references: [images.id] }),
  building: one(buildings, { fields: [groups.buildingId], references: [buildings.id] }),
}));

export const teamRoles = createTable("rolesTeam", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: text("name")
    .notNull()
    .unique(),
});

export const topics = createTable("topics", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique()
});

export const type = createTable("type", {
  id: text("id")
  .$defaultFn(() => createId())
  .notNull()
  .primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique()
})

export const events = createTable("events", {
  id: text("id")
  .$defaultFn(() => createId())
  .notNull()
  .primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  imageId: text("imageId").references(() => images.id, { onDelete: "cascade" }).notNull(),
  dateStart: timestamp("dateStart", {
    mode: "date",
    withTimezone: true,
  }),
  dateEnd: timestamp("dateEnd", {
    mode: "date",
    withTimezone: true,
  }),
  typeId: text("typeId").references(() => type.id).notNull(),
  groupId: text("groupId").references(() => groups.id).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
})

export const eventsRelations = relations(events, ({one}) => ({
  type: one(type, { fields: [events.typeId], references: [type.id] }),
  group: one(groups, { fields: [events.groupId], references: [groups.id] }),
  image: one(images, { fields: [events.imageId], references: [images.id] }),
}))

export const tutorials = createTable("tutorials", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  imageId: text("imageId").references(() => images.id, { onDelete: "cascade" }).notNull(),
  text: varchar("text", { length: 255 }).notNull(),
  authorId: text("authorId").references(() => users.id).notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  price: integer("price").notNull().default(0), // число+
  timeRead: integer("timeRead").notNull().default(0), // число+
  topicId: text("topicId").references(() => topics.id).notNull(),
  subjectId: text("subjectId").references(() => subjects.id),
})

export const tutorialsRelations = relations(tutorials, ({ one }) => ({
  author: one(users, { fields: [tutorials.authorId], references: [users.id] }),
  topic: one(topics, { fields: [tutorials.topicId], references: [topics.id] }),
  subject: one(subjects, { fields: [tutorials.subjectId], references: [subjects.id] }),
  image: one(images, { fields: [tutorials.imageId], references: [images.id] }),
}))

export const tasks = createTable("tasks", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  deadline: timestamp("deadline", {
    mode: "date",
    withTimezone: true,
  }),
  experience: integer("experience").notNull().default(0), // число+
  coin: integer("coin").notNull().default(0), // число+
  tutorialId: text("tutorialId").references(() => tutorials.id),
  subjectId: text("subjectId").notNull().references(() => subjects.id),
  groupId: text("groupId").notNull().references(() => groups.id),
  authorId: text("authorId").references(() => users.id).notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
})

export const tasksRelations = relations(tasks, ({ one }) => ({
  author: one(users, { fields: [tasks.authorId], references: [users.id] }),
  subject: one(subjects, { fields: [tasks.subjectId], references: [subjects.id] }),
  group: one(groups, { fields: [tasks.groupId], references: [groups.id] }),
  tutorial: one(tutorials, { fields: [tasks.tutorialId], references: [tutorials.id] }),
}))

export const rolesEnum = pgEnum("role", [
  "ADMIN",
  "LEAD_CYCLE_COMISSION",
  "TEACHER",
  "EMPLOYER",
  "STUDENT",
  "UNKNOWN",
]);

export const roleSchema = z.enum(rolesEnum.enumValues, {
  message: "Недопустимая роль"
});
export type Role = z.infer<typeof roleSchema>;

export const users = createTable("user", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),

  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }),

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
  resumeId:text("resumeId").references((): AnyPgColumn => resume.id ),
  githubUsername: varchar("githubUsername", { length: 255 }),
  githubToken: text("githubToken"),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  group: one(groups, { fields: [users.groupId], references: [groups.id] }),
  profilePicture: one(images, { fields: [users.profilePictureId], references: [images.id] }),
  resume:one(resume,{fields:[users.resumeId],references:[resume.userId]})
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

export const subjects = createTable("subjects", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),

  name: text("name")
    .notNull(),

  teacherId: text("teacherId")
    .references(() => users.id)
    .notNull()
})

export const subjectsRelations = relations(subjects, ({ one }) => ({
  teacherInfo: one(users, { fields: [subjects.teacherId], references: [users.id] })
}))

