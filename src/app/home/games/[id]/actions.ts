"use server";

import { FullGame } from "@/models/games";
import { getDb } from "@/server/db";
import { fullGameQuery } from "@/server/queries";
import { getSession } from "@/server/session";
import "server-only";

export async function getGameById(id: number): Promise<FullGame | null> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return null;
  }

  const db = await getDb();

  try {
    const games = await fullGameQuery(db, session.id, id);
    if (games.length !== 1) {
      return null;
    }
    return games[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}
