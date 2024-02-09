"use server";

import { FullGame } from "@/models/games";
import { getDb } from "@/server/db";
import { fullGameQuery } from "@/server/queries";
import { gameTypes as gameTypesSchema, games as gamesSchema, users } from "@/server/schema";
import { getSession } from "@/server/session";
import { desc, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import "server-only";

export async function getAllGames(): Promise<FullGame[] | null> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return null;
  }

  const db = await getDb();

  try {
    return await fullGameQuery(db, session.id);
  } catch (err) {
    return null;
  }
}
