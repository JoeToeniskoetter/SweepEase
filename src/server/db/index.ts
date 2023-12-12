import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// import { env } from "~/env";
import dotenv from "dotenv";
dotenv.config();
import * as schema from "./schema";

export const db = drizzle(
  postgres(process.env.DATABASE_URL ?? "", {
    max: 2,
    ssl: process.env.NODE_ENV != "development" ? "require" : "prefer",
  }),
  {
    logger: process.env.NODE_ENV === "development",
    schema: schema,
  }
);
