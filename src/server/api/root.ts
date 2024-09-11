import { buildingRouter } from "~/server/api/routers/building";
import { fileRouter } from "~/server/api/routers/file";
// import { githubRouter } from "~/server/api/routers/github";
import { groupRouter } from "~/server/api/routers/group";
// import { portfolioRouter } from "~/server/api/routers/portfolio";
import { resumeRouter } from "~/server/api/routers/resume";
import { teamRolesRouter } from "~/server/api/routers/roles";
import { subjectsRouter } from "~/server/api/routers/subjects";
import { tasksRouter } from "~/server/api/routers/task";
import { topicsRouter } from "~/server/api/routers/topics";
import { tutorialsRouter } from "~/server/api/routers/tutorial";
import { userRouter } from "~/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  building: buildingRouter,
  group: groupRouter,
  teamRoles: teamRolesRouter,
  topic: topicsRouter,
  tutorial: tutorialsRouter,
  subject: subjectsRouter,
  resume: resumeRouter,
  task: tasksRouter,
  // portfolio: portfolioRouter,
  // github: githubRouter,
  file: fileRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
