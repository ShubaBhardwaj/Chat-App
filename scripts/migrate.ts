import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db, closeDb } from "../src/lib/db.js";

try {
  migrate(db, {
    migrationsFolder: "./drizzle",
  });

  console.log("Database migrations applied.");
} finally {
  closeDb();
}
