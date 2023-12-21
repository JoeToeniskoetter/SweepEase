import { createTRPCRouter } from "~/server/api/trpc";
import { customerRouter } from "./routers/customer";
import { companyRouter } from "./routers/company";
import { appointmentRouter } from "./routers/appointment";
import { serviceRouter } from "./routers/service";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customer: customerRouter,
  company: companyRouter,
  appointment: appointmentRouter,
  service: serviceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
