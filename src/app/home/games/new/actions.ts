"use server";

import { getDb } from "@/server/db";
import { gameTypes } from "@/server/schema";
import "server-only";

export async function getGameTypes(): Promise<
  (typeof gameTypes.$inferSelect)[] | null
> {
  const db = await getDb();

  try {
    const results = await db.select().from(gameTypes);
    return results;
  } catch (err) {
    return null;
  }
}
