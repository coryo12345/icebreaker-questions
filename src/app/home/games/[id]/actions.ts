"use server";

import { FullGame } from "@/models/games";
import { getDb } from "@/server/db";
import { fullGameQuery } from "@/server/queries";
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
    const games = await fullGameQuery(db, session.id, id);
    if (games.length !== 1) {
      return null;
    }
    return games[0];
  } catch (err) {
    return null;
  }
}
