import "server-only";
import { getDb } from "@/server/db";
import {
  users,
  gameTypes as gameTypesSchema,
  games as gamesSchema,
} from "@/server/schema";
import { and, eq, or, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { isNil } from "@/lib/utils";

export function fullGameQuery(
  db: Awaited<ReturnType<typeof getDb>>,
  userId: number,
  gameId?: number
) {
  const player1 = alias(users, "player1");
  const player2 = alias(users, "player2");
  const gameTypes = alias(gameTypesSchema, "gameTypes");

  const playerCondition = or(
    eq(gamesSchema.player1, userId),
    eq(gamesSchema.player2, userId)
  );
  const condition = isNil(gameId)
    ? playerCondition
    : and(eq(gamesSchema.id, gameId as number), playerCondition);

  // TODO don't include password hash
  return db
    .select()
    .from(gamesSchema)
    .innerJoin(player1, eq(gamesSchema.player1, player1.id))
    .innerJoin(player2, eq(gamesSchema.player2, player2.id))
    .innerJoin(gameTypes, eq(gamesSchema.gameType, gameTypes.id))
    .where(condition)
    .orderBy(desc(gamesSchema.lastModified));
}
