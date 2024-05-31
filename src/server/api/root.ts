import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { buildingRouter } from "~/server/api/routers/building";

export const appRouter = createTRPCRouter({
  user: userRouter,
  building: buildingRouter
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
