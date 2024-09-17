import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { z } from "zod";

export const createTable = pgTableCreator((name) => `kadredu_${name}`);

export const files = createTable("files", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(),
  contentType: varchar("content_type", { length: 255 }).notNull(),

  objectId: varchar("object_id", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const buildings = createTable("buildings", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),

  createdById: text("createdById").references(() => users.id),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const buildingsRelations = relations(buildings, ({ many, one }) => ({
  groups: many(groups),
  createdBy: one(users, {
    fields: [buildings.createdById],
    references: [users.id],
  }),
}));

export const groups = createTable("groups", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: varchar("title", { length: 255 }).notNull(),

  buildingId: text("buildingId")
    .references(() => buildings.id, { onDelete: "cascade" })
    .notNull(),
  imageId: text("imageId")
    .references(() => files.id, { onDelete: "cascade" })
    .notNull(),
});

export const groupsRelations = relations(groups, ({ many, one }) => ({
  students: many(users),
  image: one(files, { fields: [groups.imageId], references: [files.id] }),
  building: one(buildings, {
    fields: [groups.buildingId],
    references: [buildings.id],
  }),
}));

export const teamRoles = createTable("rolesTeam", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: text("name").notNull().unique(),
});

export const topics = createTable("topics", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

export const tutorials = createTable("tutorials", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),

  content: text("content").notNull(),

  timeRead: integer("timeRead").notNull().default(0),

  imageId: text("imageId")
    .references(() => files.id, { onDelete: "cascade" })
    .notNull(),

  authorId: text("authorId")
    .references(() => users.id)
    .notNull(),
  topicId: text("topicId")
    .references(() => topics.id)
    .notNull(),
  subjectId: text("subjectId").references(() => subjects.id),

  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});
export const tutorialsRelations = relations(tutorials, ({ one }) => ({
  author: one(users, { fields: [tutorials.authorId], references: [users.id] }),
  topic: one(topics, { fields: [tutorials.topicId], references: [topics.id] }),
  subject: one(subjects, {
    fields: [tutorials.subjectId],
    references: [subjects.id],
  }),
  image: one(files, { fields: [tutorials.imageId], references: [files.id] }),
}));

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

  experience: integer("experience").notNull().default(0),
  coins: integer("coins").notNull().default(0),

  tutorialId: text("tutorialId").references(() => tutorials.id),

  subjectId: text("subjectId")
    .notNull()
    .references(() => subjects.id),

  authorId: text("authorId")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("createdAt", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  author: one(users, { fields: [tasks.authorId], references: [users.id] }),
  subject: one(subjects, {
    fields: [tasks.subjectId],
    references: [subjects.id],
  }),
  tutorial: one(tutorials, {
    fields: [tasks.tutorialId],
    references: [tutorials.id],
  }),
  groups: many(taskToGroups),
}));

export const taskToGroups = createTable("taskToGroups", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),

  taskId: text("taskId")
    .notNull()
    .references(() => tasks.id),
  groupId: text("groupId")
    .notNull()
    .references(() => groups.id),
  subjectId: text("subjectId")
    .notNull()
    .references(() => subjects.id),
});

export const taskToGroupsRelations = relations(taskToGroups, ({ one }) => ({
  task: one(tasks, { fields: [taskToGroups.taskId], references: [tasks.id] }),
  group: one(groups, {
    fields: [taskToGroups.groupId],
    references: [groups.id],
  }),
  subject: one(subjects, {
    fields: [taskToGroups.subjectId],
    references: [subjects.id],
  }),
}));

export const rolesEnum = pgEnum("role", [
  "ADMIN",
  "LEAD_CYCLE_COMISSION",
  "TEACHER",
  "EMPLOYER",
  "STUDENT",
  "UNKNOWN",
]);

export const roleSchema = z.enum(rolesEnum.enumValues, {
  message: "Недопустимая роль",
});
export type Role = z.infer<typeof roleSchema>;

export const users = createTable("user", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),

  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }).unique(),

  imageId: varchar("image", { length: 255 }),
  description: text("description"),

  experiencePoints: integer("experiencePoints").notNull().default(0),
  coins: integer("coins").notNull().default(0),

  roles: rolesEnum("role").array().notNull().default(["UNKNOWN"]),
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
  githubUsername: varchar("githubUsername", { length: 255 }),
  githubToken: text("githubToken"),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  group: one(groups, { fields: [users.groupId], references: [groups.id] }),
  image: one(files, { fields: [users.imageId], references: [files.id] }),
  subjects: many(subjects),
  projects: many(projects),
}));

export const projects = createTable("projects", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  emoji: varchar("emoji", { length: 15 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),

  userId: text("userId")
    .notNull()
    .references(() => users.id),
  repoName: varchar("repoName", { length: 255 }).notNull(),
  repoOwner: varchar("repoOwner", { length: 255 }).notNull(),
  isDeleted: boolean("isDeleted").notNull().default(false)
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  likes: many(projectLike),
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
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
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
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
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
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const subjects = createTable("subjects", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),

  name: text("name").notNull(),

  buildingId: text("buildingId")
    .references(() => buildings.id)
    .notNull(),
  teacherId: text("teacherId")
    .references(() => users.id)
    .notNull(),
});

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  building: one(buildings, {
    fields: [subjects.buildingId],
    references: [buildings.id],
  }),
  teacher: one(users, {
    fields: [subjects.teacherId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const projectLike = createTable(
  "projectLike",
  {
    userId: text("userId")
      .notNull()
      .unique()
      .references(() => users.id),

    projectId: text("projectId")
      .notNull()
      .unique()
      .references(() => projects.id),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.projectId, t.userId],
    }),
  })
);

export const projectLikeRelations = relations(projectLike, ({ one }) => ({
  user: one(users, { fields: [projectLike.userId], references: [users.id] }),
  project: one(projects, {
    fields: [projectLike.projectId],
    references: [projects.id],
  }),
}));

export const resumeStatusEnum = pgEnum("role", [
  "SEARCH",
  "WORK",
  "OPEN_TO_OFFERS",
]);

export const resume = createTable("resumes", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => users.id),
  roleId: text("roleId")
    .references(() => teamRoles.id)
    .notNull(),
  status: resumeStatusEnum("status").notNull(),
  experience: text("experience"),
});

export const resumeRelations = relations(resume, ({ one }) => ({
  role: one(teamRoles, { fields: [resume.roleId], references: [teamRoles.id] }),
  user: one(users, { fields: [resume.userId], references: [users.id] }),
}));
