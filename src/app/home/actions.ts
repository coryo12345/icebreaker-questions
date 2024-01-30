"use server";

import { getSession } from "@/server/session";

export async function getLatestAnswers(): Promise<null | any[]> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return null
  }
  // TODO query db to find latest updated answers for user
  return [];
}

export async function getRecentGames(): Promise<null | any[]> {
    const session = await getSession();
  if (!session.isLoggedIn) {
    return null;
  }
  // TODO query db to find recent games for user
  return [];
}
