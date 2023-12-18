import { and, eq, or, ilike } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { customer, selectCustomerSchema } from "~/server/db/schema";
import { z } from "zod";

export const customerRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      console.log(ctx.session);
      const conditions = [];

      for (const key in input) {
        console.log(key);
        conditions.push(ilike(customer[key], `%${input[key]}%`));
      }

      return ctx.db.query.customer.findMany({
        where: and(
          eq(customer.company_id, ctx.session.user.company_id),
          or(...conditions)
        ),
      });
    }),
});
