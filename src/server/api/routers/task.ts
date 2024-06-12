import { eq, and, ilike } from "drizzle-orm";
import { z } from "zod";
import { IdInputSchema, TaskInputShema } from "~/lib/shared/types";
import { adminProcedure, createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";

export const tasksRouter = createTRPCRouter ({
    create: adminProcedure
        .input(TaskInputShema)
        .mutation(async ({ctx, input}) => {
            await ctx.db.insert(tasks).values({
                ...input,
                author: ctx.session.user.id
            });
        }),
    delete: adminProcedure
        .input(IdInputSchema)
        .mutation(async ({ctx, input}) => {
            await ctx.db.delete(tasks).where(eq(tasks.id, input.id))
        }),
    getAll: publicProcedure
        .input(z.object({
            search: z.string().optional()
        }).optional())

        .query(async ({ ctx, input }) => {
            return await ctx.db.query.tasks.findMany({
              where: and(
                input?.search ? ilike(tasks.name, `%${input.search}%`) : undefined
              ), 

              with: {
                authorInfo: {
                    columns: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
              }
            })
        }),
    update: adminProcedure
        .input(z.intersection(IdInputSchema, TaskInputShema))
        .mutation(async ({ctx, input}) => {
            await ctx.db.update(tasks).set({
              ...input,
            }).where(eq(tasks.id, input.id));
        }),
})