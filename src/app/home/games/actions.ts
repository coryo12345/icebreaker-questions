"use server";

import { getDb } from "@/server/db";
import { games as gamesSchema } from "@/server/schema";
import { getSession } from "@/server/session";
import { desc, eq, or } from "drizzle-orm";
import "server-only";

export async function getAllGames(): Promise<
  (typeof gamesSchema.$inferSelect)[] | null
> {
  const session = await getSession();
  const db = await getDb();

  try {
    const games = db
      .select()
      .from(gamesSchema)
      .where(
        or(
          eq(gamesSchema.player1, session.id),
          eq(gamesSchema.player2, session.id)
        )
      ).orderBy(desc(gamesSchema.lastModified));
    return games;
  } catch (err) {
    return null;
  }
}
