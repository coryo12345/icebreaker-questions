"use server";

import { FullGame, GameQuestion } from "@/models/games";
import { getDb } from "@/server/db";
import { fullGameQuery, gameQuestionsQuery } from "@/server/queries";
import { gameQuestions, games, userAnswers } from "@/server/schema";
import { getSession } from "@/server/session";
import { and, eq, or } from "drizzle-orm";
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

/**
 * Submit answer for user for a given game
 * @returns true if the submission was successful. If so, the page should reload.
 * if there was an error, returns false. should probably show an error message to the user.
 */
export async function submitAnswer(
  gameId: number,
  answer: string,
  saveAnswer: boolean
): Promise<boolean> {
  // get game with gameId to find currentRound
  // determine if user is player1 or player2 using userId
  // update userAnswer row with gameId & questionId
  // if saveAnswer is true, update answers table with answer
  // if both players have answered, increment currentRound

  if (answer.length < 1) {
    return false;
  }

  const session = await getSession();
  if (!session.isLoggedIn) return false;

  const db = await getDb();

  try {
    const gameResults = await db
      .select()
      .from(games)
      .where(
        and(
          eq(games.id, gameId),
          or(eq(games.player1, session.id), eq(games.player2, session.id))
        )
      );
    if (gameResults.length != 1) {
      throw new Error(
        `expected 1 game with id ${gameId}, but found ${gameResults.length}`
      );
    }
    const game = gameResults[0];

    // check if game is completed
    if (game.currentQuestion >= game.totalQuestions) {
      return false;
    }

    let updateQuestionValue:
      | Pick<typeof gameQuestions.$inferSelect, "player1Answer">
      | Pick<typeof gameQuestions.$inferSelect, "player2Answer">;

    if (session.id === game.player1) {
      updateQuestionValue = { player1Answer: answer };
    } else if (session.id === game.player2) {
      updateQuestionValue = { player2Answer: answer };
    } else {
      throw new Error(
        `User ${session.id} attempted to update answer for game ${gameId}, which they are not a part of`
      );
    }

    await db
      .update(gameQuestions)
      .set(updateQuestionValue)
      .where(
        and(
          eq(gameQuestions.gameId, game.id),
          eq(gameQuestions.questionNumber, game.currentQuestion)
        )
      );

    const newRowResults = await db
      .select()
      .from(gameQuestions)
      .where(
        and(
          eq(gameQuestions.gameId, game.id),
          eq(gameQuestions.questionNumber, game.currentQuestion)
        )
      );
    if (newRowResults.length !== 1) {
      throw new Error(
        `Expected 1 row for question number ${game.currentQuestion} for game ${game.id} but found ${newRowResults.length}`
      );
    }
    const newRow = newRowResults[0];

    if (
      newRow.player1Answer &&
      newRow.player1Answer.length > 0 &&
      newRow.player2Answer &&
      newRow.player2Answer.length > 0
    ) {
      await db
        .update(games)
        .set({ currentQuestion: game.currentQuestion + 1 })
        .where(eq(games.id, game.id));
    }

    if (saveAnswer) {
      await db.insert(userAnswers)
        .values({
          value: answer,
          createdAt: new Date(),
          lastModified: new Date(),
          questionId: newRow.questionId,
          userId: session.id,
        })
        .onConflictDoUpdate({
          target: [userAnswers.questionId, userAnswers.userId],
          set: { value: answer, lastModified: new Date() },
        });
    }
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
}
