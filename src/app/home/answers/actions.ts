"use server";
import "server-only";

import { getDb } from "@/server/db";
import { questions, userAnswers } from "@/server/schema";

export async function getAllQuestions(): Promise<
  (typeof questions.$inferSelect)[] | null
> {
  const db = await getDb();
  try {
    const results = await db.select().from(questions);
    return results;
  } catch (err) {
    return null;
  }
}

export async function getUserAnswers(): Promise<
  (typeof userAnswers.$inferSelect)[] | null
> {
  const db = await getDb();
  try {
    const results = await db.select().from(userAnswers);
    return results;
  } catch (err) {
    return null;
  }
}

export async function saveAnswers(
  answers: (typeof userAnswers.$inferSelect)[]
): Promise<boolean> {
  const db = await getDb();
  try {
    const promises: Promise<any>[] = [];
    answers.forEach((answer) => {
      promises.push(
        db
          .insert(userAnswers)
          .values(answer)
          .onConflictDoUpdate({
            target: [userAnswers.questionId, userAnswers.userId],
            set: { value: answer.value },
          })
      );
    });
    await Promise.all(promises);
  } catch (err) {
    return false;
  }
  return true;
}
