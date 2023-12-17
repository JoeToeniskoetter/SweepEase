import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { customer } from "~/server/db/schema";

export const customerRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.customer.findMany({
      where: eq(customer.company_id, ""),
    });
  }),
});
