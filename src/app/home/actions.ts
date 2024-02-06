"use server";

import { AnswerPreview } from "@/models/answer";
import { getDb } from "@/server/db";
import { questions as questionSchema, userAnswers } from "@/server/schema";
import { getSession } from "@/server/session";
import { desc, eq } from "drizzle-orm";

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

export async function getRecentGames(): Promise<null | any[]> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return null;
  }
  // TODO query db to find recent games for user
  return [];
}
