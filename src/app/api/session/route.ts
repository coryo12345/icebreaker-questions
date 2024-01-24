import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, defaultSession } from "@/lib/session";
import { sessionOptions } from "@/server/session";

// login
export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  const { username = "No username" } = (await request.json()) as {
    username: string;
    password: string;
  };

  // TODO verify user

  session.isLoggedIn = true;
  session.username = username;
  await session.save();

  return Response.json(session);
}

// read session
export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // TODO verify user

  if (session.isLoggedIn !== true) {
    return Response.json(defaultSession);
  }

  return Response.json(session);
}

// logout
export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  session.destroy();

  return Response.json(defaultSession);
}

// register
export async function PUT(request: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  
  const { username = "No username" } = (await request.json()) as {
    username: string;
    password: string;
  };

  // TODO create user!
  session.isLoggedIn = true;
  session.username = username;
  await session.save();

  return Response.json(session);
}
