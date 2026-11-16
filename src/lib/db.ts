import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema.js";

// Run commands from this project folder so the app and Drizzle Kit use the same file.
const sqlite = new Database("chat.sqlite");
sqlite.exec("PRAGMA foreign_keys = ON;");

export const db = drizzle({ client: sqlite, schema });

// Call once when your application shuts down, not after each query.
export function closeDb() {
  sqlite.close();
}
