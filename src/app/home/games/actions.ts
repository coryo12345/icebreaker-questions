"use server";

import { FullGame } from "@/models/games";
import { getDb } from "@/server/db";
import { gameTypes as gameTypesSchema, games as gamesSchema, users } from "@/server/schema";
import { getSession } from "@/server/session";
import { desc, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import "server-only";

export async function getAllGames(): Promise<FullGame[] | null> {
  const session = await getSession();
  const db = await getDb();

  try {
    const player1 = alias(users, "player1");
    const player2 = alias(users, "player2");
    const gameTypes = alias(gameTypesSchema, "gameTypes");
    const games = db
      .select()
      .from(gamesSchema)
      .innerJoin(player1, eq(gamesSchema.player1, player1.id))
      .innerJoin(player2, eq(gamesSchema.player2, player2.id))
      .innerJoin(gameTypes, eq(gamesSchema.gameType, gameTypes.id))
      .where(
        or(
          eq(gamesSchema.player1, session.id),
          eq(gamesSchema.player2, session.id)
        )
      )
      .orderBy(desc(gamesSchema.lastModified));
    return games;
  } catch (err) {
    return null;
  }
}
