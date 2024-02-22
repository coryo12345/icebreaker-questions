import "server-only";
import { getDb } from "@/server/db";
import {
  users,
  gameTypes as gameTypesSchema,
  games as gamesSchema,
  questions as questionsSchema,
  gameQuestions,
} from "@/server/schema";
import { and, eq, or, desc } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { isNil } from "@/lib/utils";

export function fullGameQuery(
  db: Awaited<ReturnType<typeof getDb>>,
  userId: number,
  gameId?: number
) {
  const safeUsers = db
    .select({ id: users.id, username: users.username })
    .from(users);
  const player1 = db.$with("player1").as(safeUsers);
  const player2 = db.$with("player2").as(safeUsers);
  const gameTypes = alias(gameTypesSchema, "gameTypes");

  const playerCondition = or(
    eq(gamesSchema.player1, userId),
    eq(gamesSchema.player2, userId)
  );
  const condition = isNil(gameId)
    ? playerCondition
    : and(eq(gamesSchema.id, gameId as number), playerCondition);

  return db
    .with(player1, player2)
    .select()
    .from(gamesSchema)
    .innerJoin(player1, eq(gamesSchema.player1, player1.id))
    .innerJoin(player2, eq(gamesSchema.player2, player2.id))
    .innerJoin(gameTypes, eq(gamesSchema.gameType, gameTypes.id))
    .where(condition)
    .orderBy(desc(gamesSchema.lastModified));
}

export function gameQuestionsQuery(db: Awaited<ReturnType<typeof getDb>>, gameId: number) {
  return db
    .select({
      gameId: gameQuestions.gameId,
      questionId: questionsSchema.id,
      question: questionsSchema.value,
      questionNumber: gameQuestions.questionNumber,
      player1Answer: gameQuestions.player1Answer,
      player2Answer: gameQuestions.player2Answer,
    })
    .from(gameQuestions)
    .innerJoin(
      questionsSchema,
      eq(gameQuestions.questionId, questionsSchema.id)
    )
    .where(eq(gameQuestions.gameId, gameId));
}