import "server-only";

import { gameTypes, questions } from "@/server/schema";
import Database from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { parse } from "csv-parse/sync";
import path from "path";
import fs from "fs";

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
  await db
    .insert(gameTypes)
    .values({ id: 0, name: "Learning" })
    .onConflictDoUpdate({ target: gameTypes.id, set: { name: "Learning" } });
  await db
    .insert(gameTypes)
    .values({ id: 1, name: "Compete" })
    .onConflictDoUpdate({ target: gameTypes.id, set: { name: "Compete" } });

  // questions
  const questionPromises: Promise<any>[] = [];
  const rows = getQuestions();
  rows.forEach((row) => {
    questionPromises.push(
      db
        .insert(questions)
        .values({ value: row.value, id: row.id })
        .onConflictDoUpdate({ target: questions.id, set: { value: row.value } })
    );
  });

  await Promise.all(questionPromises);
}

const QUESTION_FILE = path.join(".", "src", "server", "questions.csv");
const getQuestions = (): { id: number; value: string }[] => {
  const data = fs.readFileSync(QUESTION_FILE, { encoding: "utf-8" });
  const records: {id: string, question: string}[] = parse(data, { columns: true, skip_empty_lines: true });
  return records.map(record => ({
    id: parseInt(record.id),
    value: record.question,
  }));
};
