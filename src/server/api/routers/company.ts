import { company, users } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { eq } from "drizzle-orm";

export const companyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), logo: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      let c = null;
      await ctx.db.transaction(async (tx) => {
        const result = await tx
          .insert(company)
          .values({
            ...input,
            created_by: ctx.session.user.id,
          })
          .returning();
        c = result[0];

        await tx
          .update(users)
          .set({ company_id: c?.id })
          .where(eq(users.id, ctx.session.user.id));
      });
      return c;
    }),
});
