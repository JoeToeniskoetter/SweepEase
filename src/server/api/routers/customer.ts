import { and, eq, or, ilike, sql, desc, asc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createCustomerSchema, customer } from "~/server/db/schema";
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
        page: z.number(),
        page_size: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log(input);
      const conditions = [];

      if (input.first_name) {
        conditions.push(ilike(customer.first_name, `%${input.first_name}%`));
      }
      if (input.last_name) {
        conditions.push(ilike(customer.last_name, `%${input.last_name}%`));
      }
      if (input.address) {
        conditions.push(ilike(customer.address, `%${input.address}%`));
      }
      if (input.phone) {
        conditions.push(ilike(customer.phone, `%${input.phone}%`));
      }
      if (input.email) {
        conditions.push(ilike(customer.email, `%${input.email}%`));
      }

      //pagination
      const limit = input.page_size;
      const offset = input.page == 1 ? 0 : (input.page - 1) * limit;

      const count = await ctx.db
        .select({ count: sql<number>`count(*)`.mapWith(Number) })
        .from(customer)
        .where(
          and(
            eq(customer.company_id, ctx.session.user.company_id),
            ...conditions
          )
        );
      if (count == undefined || count.length < 1 || count[0] == undefined) {
        return;
      }

      const customers = await ctx.db.query.customer.findMany({
        where: and(
          eq(customer.company_id, ctx.session.user.company_id),
          ...conditions
        ),
        limit,
        offset,
        orderBy: (customer, { asc }) => [
          asc(customer.last_name),
          asc(customer.first_name),
        ],
      });

      return {
        data: customers,
        meta: {
          page: input.page,
          page_size: input.page_size,
          total_rows: count[0]?.count ?? 0,
          total_pages: Math.ceil(count[0].count / input.page_size),
        },
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        address: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        zip: z.string().min(5),
        phone: z.string().min(10),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(customer).values({
        ...input,
        created_by: ctx.session.user.id,
        company_id: ctx.session.user.company_id,
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        address: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        zip: z.string().min(5),
        phone: z.string().min(10),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(customer)
        .set({
          ...input,
          created_by: ctx.session.user.id,
          company_id: ctx.session.user.company_id,
        })
        .where(eq(customer.id, input.id));
    }),
});
