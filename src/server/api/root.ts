import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { buildingRouter } from "~/server/api/routers/building";
import { imageRouter } from "~/server/api/routers/image";
import { groupRouter } from "~/server/api/routers/group";
import { topicsRouter } from "~/server/api/routers/topics";


export const appRouter = createTRPCRouter({
  user: userRouter,
  building: buildingRouter,
  image: imageRouter,
  group: groupRouter,
  topic: topicsRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
