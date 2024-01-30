import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, defaultSession } from "@/lib/session";
import { sessionOptions } from "@/server/session";
import { getDb } from "@/server/db";
import { users } from "@/server/schema";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";

const passwordHashSecret = process.env.PASSWORD_HASH_SECRET ?? null;

// login
export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const { username = "", password = "" } = (await request.json()) as {
    username: string;
    password: string;
  };

  if (username === "" || password === "") {
    return Response.json("username & password are required", { status: 400 });
  }

  const db = await getDb();
  let results: { id: number }[];
  try {
    results = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.username, username),
          eq(users.passwordHash, hashPassword(password))
        )
      );
  } catch (err) {
    return Response.json("unable to log in - generic err", { status: 500 });
  }

  if (results.length !== 1) {
    return Response.json("invalid username & password", { status: 400 });
  }

  session.isLoggedIn = true;
  session.username = username;
  session.id = results[0].id;
  await session.save();

  return Response.json(session);
}

// read session
export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.isLoggedIn !== true) {
    return Response.json({ ...defaultSession });
  }

  return Response.json(session);
}

// logout
export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  session.destroy();

  return Response.json({ ...defaultSession });
}

// register
export async function PUT(request: NextRequest, response: NextResponse) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const { username = "", password = "" } = (await request.json()) as {
    username: string;
    password: string;
  };

  if (passwordHashSecret === null) {
    return Response.json("unable to create user - err: password hash", {
      status: 500,
    });
  }
  const passwordHash = hashPassword(password);

  const db = await getDb();

  let results: { id: number }[];
  try {
    results = await db
      .insert(users)
      .values({ username, passwordHash: passwordHash })
      .returning({ id: users.id });
  } catch (err) {
    if ((err as Error).message.toLocaleLowerCase().includes("unique")) {
      return Response.json("username already in use", { status: 400 });
    }
    return Response.json("unable to create user - generic err", {
      status: 500,
    });
  }

  if (results.length !== 1) {
    return Response.json("unable to create user", { status: 500 });
  }

  session.isLoggedIn = true;
  session.username = username;
  session.id = results[0].id;
  await session.save();

  return Response.json(session);
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}
