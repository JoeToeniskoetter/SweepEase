import { SQLWrapper, and, eq, ilike, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { Address, address, customer } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

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
      const conditions: SQLWrapper[] = [
        eq(customer.company_id, ctx.session.user.company_id),
      ];
      const countConditions: SQLWrapper[] = [
        eq(customer.company_id, ctx.session.user.company_id),
      ];

      if (input.first_name) {
        conditions.push(ilike(customer.first_name, `%${input.first_name}%`));
        countConditions.push(
          ilike(customer.first_name, `%${input.first_name}%`)
        );
      }
      if (input.last_name) {
        conditions.push(ilike(customer.last_name, `%${input.last_name}%`));
        countConditions.push(ilike(customer.last_name, `%${input.last_name}%`));
      }
      if (input.phone) {
        conditions.push(ilike(customer.phone, `%${input.phone}%`));
        countConditions.push(ilike(customer.phone, `%${input.phone}%`));
      }
      if (input.email) {
        conditions.push(ilike(customer.email, `%${input.email}%`));
        countConditions.push(ilike(customer.email, `%${input.email}%`));
      }
      if (input.address) {
        const filter = `%${input.address}%`;

        conditions.push(
          inArray(
            customer.address_id,
            ctx.db
              .select({ id: address.id })
              .from(address)
              .where(ilike(address.address1, filter))
          )
        );
        countConditions.push(sql`address1 ilike ${addressFilter()}`);
      }

      function addressFilter() {
        return `%${input.address}%`;
      }

      //pagination
      const limit = input.page_size;
      const offset = input.page == 1 ? 0 : (input.page - 1) * limit;

      const count = await ctx.db
        .select({ count: sql<number>`count(*)`.mapWith(Number) })
        .from(customer)
        .innerJoin(address, eq(customer.address_id, address.id))
        .where(and(...countConditions));
      if (count == undefined || count.length < 1 || count[0] == undefined) {
        return;
      }

      const customers = await ctx.db.query.customer.findMany({
        where: and(...conditions),
        with: {
          address: true,
        },
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
        address1: z.string().min(1),
        address2: z.string().optional(),
        city: z.string().min(1),
        state: z.string().min(1),
        zip: z.string().min(5),
        phone: z.string().min(10),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const newAddressResult: Address[] = await tx
          .insert(address)
          .values({
            address1: input.address1,
            address2: input.address2,
            city: input.city,
            state: input.state,
            zip: input.zip,
            created_by: ctx.session.user.id,
          })
          .returning();

        if (
          newAddressResult == undefined ||
          newAddressResult.length < 1 ||
          newAddressResult[0] == undefined
        ) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        await tx.insert(customer).values({
          ...input,
          address_id: newAddressResult[0].id,
          created_by: ctx.session.user.id,
          company_id: ctx.session.user.company_id,
        });
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        address_id: z.string(),
        address1: z.string().min(1),
        address2: z.string().optional(),
        city: z.string().min(1),
        state: z.string().min(1),
        zip: z.string().min(5),
        phone: z.string().min(10),
        email: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        await tx
          .update(address)
          .set({
            address1: input.address1,
            address2: input.address2,
            city: input.city,
            state: input.state,
            zip: input.zip,
            created_by: ctx.session.user.id,
          })
          .where(eq(address.id, input.address_id));

        try {
          await tx
            .update(customer)
            .set({
              first_name: input.first_name,
              last_name: input.last_name,
              email: input.email,
              phone: input.phone,
            })
            .where(eq(customer.id, input.id));
        } catch (e) {
          console.log(e);
        }
      });
    }),
});
