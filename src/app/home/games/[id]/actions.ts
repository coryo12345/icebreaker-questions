"use server";

import { FullGame, GameQuestion } from "@/models/games";
import { getDb } from "@/server/db";
import { fullGameQuery, gameQuestionsQuery } from "@/server/queries";
import { getSession } from "@/server/session";
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

export async function submitAnswer(answer: string): Promise<boolean> {
  return false;
}