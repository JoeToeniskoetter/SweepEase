import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { service } from "~/server/db/schema";
import { z } from "zod";

export const serviceRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.service.findMany({
      where: eq(service.company_id, ctx.session.user.company_id),
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.string().min(1),
        description: z.string().min(1),
        price: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(service).values({
        ...input,
        price: input.price.toString(),
        company_id: ctx.session.user.company_id,
        created_by: ctx.session.user.id,
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        type: z.string().min(1),
        description: z.string().min(1),
        price: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(service)
        .set({
          ...input,
          price: input.price.toString(),
          company_id: ctx.session.user.company_id,
          created_by: ctx.session.user.id,
        })
        .where(eq(service.id, input.id));
    }),
});
