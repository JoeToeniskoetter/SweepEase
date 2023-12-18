import { createTRPCRouter } from "~/server/api/trpc";
import { customerRouter } from "./routers/customer";
import { companyRouter } from "./routers/company";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customer: customerRouter,
  company: companyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
