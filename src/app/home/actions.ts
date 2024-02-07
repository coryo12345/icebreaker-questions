"use server";

import { AnswerPreview } from "@/models/answer";
import { FullGame } from "@/models/games";
import { getDb } from "@/server/db";
import {
  gameTypes as gameTypesSchema,
  games as gamesSchema,
  questions as questionSchema,
  userAnswers,
  users,
} from "@/server/schema";
import { getSession } from "@/server/session";
import { desc, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";

export async function getLatestAnswers(): Promise<null | AnswerPreview[]> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return null;
  }

  const db = await getDb();

  try {
    const answers = await db
      .select()
      .from(userAnswers)
      .where(eq(userAnswers.userId, session.id))
      .orderBy(desc(userAnswers.lastModified))
      .limit(5);
    const questions = await db.select().from(questionSchema);

    return answers
      .map<AnswerPreview | undefined>((answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        if (!question) return undefined;
        return {
          questionId: answer.questionId,
          question: question.value,
          answer: answer.value,
          updatedAt: answer.lastModified,
        };
      })
      .filter((a) => a !== undefined) as AnswerPreview[];
  } catch (err) {
    return null;
  }
}

export async function getLatestGames(): Promise<FullGame[] | null> {
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
        or(
          eq(gamesSchema.player1, session.id),
          eq(gamesSchema.player2, session.id)
        )
      )
      .limit(5)
      .orderBy(desc(gamesSchema.lastModified));
    return games;
  } catch (err) {
    return null;
  }
}
