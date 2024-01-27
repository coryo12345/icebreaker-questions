import "server-only";

import { SessionData } from "@/lib/session";
import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

const sessionSecret = process.env.SESSION_SECRET;
if (sessionSecret === undefined) {
  process.exit(1);
}
export const sessionOptions: SessionOptions = {
  password: sessionSecret,
  cookieName: "icebreaker-questions-app-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  return await getIronSession<SessionData>(cookies(), sessionOptions);
}

export async function redirectIfLoggedIn(to: string) {
  const session = await getSession();
  if (session.isLoggedIn) {
    redirect(to);
  }
}

export async function redirectIfNotLoggedIn(to: string) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect(to, RedirectType.replace);
  }
}