import { migrate } from "drizzle-orm/postgres-js/migrator";
import { exit } from "process";
import { db } from "./index";

migrate(db, { migrationsFolder: "drizzle" })
  .then(() => {
    console.log("migrated");
    exit(0);
  })
  .catch((e) => {
    console.error("failed to apply migrations", e);
    exit(1);
  });
