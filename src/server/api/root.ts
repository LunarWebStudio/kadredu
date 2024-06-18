import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { buildingRouter } from "~/server/api/routers/building";
import { imageRouter } from "~/server/api/routers/image";
import { groupRouter } from "~/server/api/routers/group";
import { teamRolesRouter } from "~/server/api/routers/roles";
import { subjectsRouter } from "~/server/api/routers/subjects";
import { topicsRouter } from "~/server/api/routers/topics";
import { tutorialsRouter } from "~/server/api/routers/tutorial";
import { tasksRouter } from "~/server/api/routers/task";
import { typeRouter } from "~/server/api/routers/type";
import { eventRouter } from "~/server/api/routers/event";

export const appRouter = createTRPCRouter({
  user: userRouter,
  building: buildingRouter,
  image: imageRouter,
  group: groupRouter,
  teamRoles: teamRolesRouter,
  topic: topicsRouter,
  tutorial: tutorialsRouter,
  subject: subjectsRouter,
  task: tasksRouter,
  type: typeRouter,
  event: eventRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
