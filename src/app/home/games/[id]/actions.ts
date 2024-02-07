"use server";

import { FullGame } from "@/models/games";
import { getDb } from "@/server/db";
import {
  gameTypes as gameTypesSchema,
  games as gamesSchema,
  users,
} from "@/server/schema";
import { getSession } from "@/server/session";
import { and, desc, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import "server-only";

export async function getGameById(id: number): Promise<FullGame | null> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return null;
  }

  const db = await getDb();

  try {
    // TODO don't include password hash
    const player1 = alias(users, "player1");
    const player2 = alias(users, "player2");
    const gameTypes = alias(gameTypesSchema, "gameTypes");
    const games = await db
      .select()
      .from(gamesSchema)
      .innerJoin(player1, eq(gamesSchema.player1, player1.id))
      .innerJoin(player2, eq(gamesSchema.player2, player2.id))
      .innerJoin(gameTypes, eq(gamesSchema.gameType, gameTypes.id))
      .where(
        and(
          eq(gamesSchema.id, id),
          or(
            eq(gamesSchema.player1, session.id),
            eq(gamesSchema.player2, session.id)
          )
        )
      )
      .orderBy(desc(gamesSchema.lastModified));
    if (games.length !== 1) {
      return null;
    }
    return games[0];
  } catch (err) {
    return null;
  }
}
