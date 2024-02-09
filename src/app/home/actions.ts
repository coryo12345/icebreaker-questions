"use server";

import { AnswerPreview } from "@/models/answer";
import { FullGame } from "@/models/games";
import { getDb } from "@/server/db";
import { fullGameQuery } from "@/server/queries";
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
    const games = await fullGameQuery(db, session.id).limit(5);
    console.log(games);
    return games;
  } catch (err) {
    console.error(err);
    return null;
  }
}
