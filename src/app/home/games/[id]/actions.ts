"use server";

import { FullGame, GameQuestion } from "@/models/games";
import { getDb } from "@/server/db";
import { fullGameQuery, gameQuestionsQuery } from "@/server/queries";
import { userAnswers } from "@/server/schema";
import { getSession } from "@/server/session";
import { and, eq } from "drizzle-orm";
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

export async function getGameQuestionsById(
  id: number
): Promise<GameQuestion[] | null> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return null;
  }

  const db = await getDb();

  try {
    const questions = await gameQuestionsQuery(db, id);
    return questions;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getUserSavedAnswer(
  userId: number,
  questionId: number
): Promise<string | undefined> {
  const db = await getDb();

  try {
    const answers = await db
      .select()
      .from(userAnswers)
      .where(
        and(
          eq(userAnswers.questionId, questionId),
          eq(userAnswers.userId, userId)
        )
      );

    if (answers.length != 1) {
      return undefined;
    }

    return answers[0].value;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function submitAnswer(
  gameId: number,
  answer: string,
  saveAnswer: boolean
): Promise<boolean> {
  const session = await getSession();
  if (!session.isLoggedIn) return false;

  return false;
}
