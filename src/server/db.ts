import "server-only";

import Database from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const sqlite = new Database("data.db");
let db: BetterSQLite3Database<Record<string, never>>;

export async function getDb() {
  if (!db) {
    db = drizzle(sqlite);
    await migrate(db, { migrationsFolder: "./drizzle" });
    await seedDb();
  }
  return db;
}


async function seedDb() {
  // This must be re-runable!
  
  // game types

  // questions
}