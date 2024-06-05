import { eq } from "drizzle-orm";
import { z } from "zod";
import { TopicsInputShema, IdInputSchema } from "~/lib/shared/types";
import { adminProcedure, createTRPCRouter} from "~/server/api/trpc";
import { topics } from "~/server/db/schema";

export const topicsRouter = createTRPCRouter ({
    create: adminProcedure 
        .input(TopicsInputShema)
        .mutation(async ({ ctx, input}) => {
            await ctx.db.insert(topics).values(input)
        }),
    
    delete: adminProcedure
        .input(IdInputSchema)
        .mutation(async ({ctx, input}) => {
            await ctx.db.delete(topics).where(eq(topics.id, input.id))
        }),

    getAll: adminProcedure.query(async ({ctx}) => {
        return await ctx.db.query.topics.findMany()
    }),

    update: adminProcedure
        .input(z.intersection(IdInputSchema, TopicsInputShema))
        .mutation(async ({ctx, input}) => {
            await ctx.db.update(topics).set(input).where(eq(topics.id, input.id))
        }),
});