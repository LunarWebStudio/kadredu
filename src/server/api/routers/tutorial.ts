import { eq, and, ilike } from "drizzle-orm";
import { z } from "zod";
import { TutorialInputShema, IdInputSchema } from "~/lib/shared/types";
import { adminProcedure, createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import { tutorials } from "~/server/db/schema";

export const tutorialsRouter = createTRPCRouter ({
    create: adminProcedure
        .input(TutorialInputShema)
        .mutation(async ({ctx, input}) => {
            await ctx.db.insert(tutorials).values({
                ...input,
                authorId: ctx.session.user.id
            })
        }),
    delete: adminProcedure
        .input(IdInputSchema)
        .mutation(async ({ctx, input}) => {
            await ctx.db.delete(tutorials).where(eq(tutorials.id, input.id))
        }),
    getAll: publicProcedure
        .input(z.object({
            search: z.string().optional()
        }).optional())

        .query(async ({ ctx, input }) => {
            return await ctx.db.query.tutorials.findMany({
              where: and(
                input?.search ? ilike(tutorials.name, `%${input.search}%`) : undefined
              ), 

              with: {
                authorInfo: {
                    columns: {
                        id: true
                    }
                }
              }
            })
        }),
    update: adminProcedure
        .input(z.intersection(IdInputSchema, TutorialInputShema))
        .mutation(async ({ctx, input}) => {
            await ctx.db.update(tutorials).set(input).where(eq(tutorials.id, input.id))
        }),
})