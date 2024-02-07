"use server";

import { getDb } from "@/server/db";
import { gameTypes, games as gamesSchema, users } from "@/server/schema";
import { getSession } from "@/server/session";
import { and, eq, not } from "drizzle-orm";
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

export interface GameFormData {
  name: string;
  gameType: string;
  opponent: string;
  questionCount: number;
}

export async function createGame(
  newGameData: GameFormData
): Promise<{ status: "success" } | { status: "error"; message: string }> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return {
      status: "error",
      message: "You must be logged in to create a game",
    };
  }

  const db = await getDb();

  // need to verify data
  // gameType is valid
  let gt: (typeof gameTypes.$inferSelect)[];
  try {
    gt = await db
      .select()
      .from(gameTypes)
      .where(eq(gameTypes.id, parseInt(newGameData.gameType)));
  } catch (err) {
    return { status: "error", message: "internal server error" };
  }
  if (gt.length !== 1) {
    return { status: "error", message: "Invalid game type selected." };
  }

  // opponent exists
  let op: (typeof users.$inferSelect)[];
  try {
    op = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.username, newGameData.opponent),
          not(eq(users.id, session.id))
        )
      );
  } catch (err) {
    return { status: "error", message: "internal server error" };
  }
  if (op.length !== 1) {
    return {
      status: "error",
      message:
        "Unable to find that user. Please check that you have typed in your opponent's username correctly.",
    };
  }

  // question count is whithin limits
  if (newGameData.questionCount < 1 || newGameData.questionCount > 10) {
    return {
      status: "error",
      message: "Invalid question count. Must be between 1 and 10",
    };
  }

  try {
    await db.insert(gamesSchema).values({
      status: 0,
      player1: session.id,
      player2: op[0].id,
      gameType: parseInt(newGameData.gameType),
      name: newGameData.name,
      totalQuestions: newGameData.questionCount,
      createdAt: new Date(),
      lastModified: new Date(),
    });
  } catch (err) {
    return { status: "error", message: "internal server error" };
  }

  return { status: "success" };
}
