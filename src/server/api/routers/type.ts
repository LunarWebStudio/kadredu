import { and, eq, ilike } from "drizzle-orm";
import { z } from "zod";
import {  IdInputSchema, EventTypeInputShema } from "~/lib/shared/types";
import { adminProcedure, createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import { eventType } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const eventTypeRouter = createTRPCRouter ({
    create: adminProcedure 
        .input(EventTypeInputShema)
        .mutation(async ({ ctx, input}) => {
          try {
            return (
              await ctx.db.insert(eventType).values({ name: input.name }).returning()
            )[0];
          } catch (err: any) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (err.code === "23505") {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Тип мероприятия с таким названием уже существует"
              })
            }
    
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Не удалось создать тип мероприятия"
            })
          }
        }),
    
    delete: adminProcedure
        .input(IdInputSchema)
        .mutation(async ({ctx, input}) => {
            await ctx.db.delete(eventType).where(eq(eventType.id, input.id))
        }),

    getAll: publicProcedure
        .input(z.object({
          search: z.string().optional()
        }).optional())

        .query(async ({ ctx, input }) => {
          return await ctx.db.query.eventType.findMany({
            where: and(
              input?.search ? ilike(eventType.name, `%${input.search}%`) : undefined
            ),
          })
    }),

    update: adminProcedure
        .input(z.intersection(IdInputSchema, EventTypeInputShema))
        .mutation(async ({ctx, input}) => {
          const existTypeEvent = await ctx.db.query.eventType.findFirst({
            where: eq(eventType.id, input.id)
          });
          if (!existTypeEvent) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Тип мероприятия не найден"
            });
          }
          try {
            return (
              await ctx.db
                .update(eventType)
                .set({
                  name: input.name
                })
                .where(eq(eventType.id, input.id))
                .returning()
            )[0];
          } catch (err: any) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (err.code === "23505") {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Тип мероприятия с таким названием уже существует"
              })
            }
    
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Не удалось обновить тип мероприятия"
            })
          }
        }),
});