import { and, between, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { appointment, customer } from "~/server/db/schema";

export const appointmentRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.appointment.findMany({
        where: and(
          eq(appointment.company_id, ctx.session.user.company_id),
          between(appointment.date, input.startDate, input.endDate)
        ),
        with: {
          customer: true,
          service: true,
        },
      });
    }),
  upcomingByCustomerId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.appointment.findMany({
        where: and(
          eq(appointment.customer_id, input.id),
          gte(appointment.date, sql`now()`),
          eq(appointment.company_id, ctx.session.user.company_id)
        ),
      });
    }),
});
