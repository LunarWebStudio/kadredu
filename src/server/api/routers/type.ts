import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { TopicsInputShema, IdInputSchema, TypeInputShema } from "~/lib/shared/types";
import { adminProcedure, createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import { type } from "~/server/db/schema";

export const typeRouter = createTRPCRouter ({
    create: adminProcedure 
        .input(TypeInputShema)
        .mutation(async ({ ctx, input}) => {
            await ctx.db.insert(type).values(input)
        }),
    
    delete: adminProcedure
        .input(IdInputSchema)
        .mutation(async ({ctx, input}) => {
            await ctx.db.delete(type).where(eq(type.id, input.id))
        }),

    getAll: publicProcedure
        .input(z.object({
          search: z.string().optional()
        }).optional())

        .query(async ({ ctx, input }) => {
          return await ctx.db.query.type.findMany({
            where: and(
              input?.search ? ilike(type.name, `%${input.search}%`) : undefined
            ),
          })
    }),

    update: adminProcedure
        .input(z.intersection(IdInputSchema, TopicsInputShema))
        .mutation(async ({ctx, input}) => {
            await ctx.db.update(type).set(input).where(eq(type.id, input.id))
        }),
});