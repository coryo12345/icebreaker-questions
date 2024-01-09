import "server-only";

import jsonwebtoken from 'jsonwebtoken';
import { JWT, User } from "@/models/auth";
import "dotenv/config";
import { getDb } from "@/server/db";
import { users } from "@/server/schema";
import { and, eq } from "drizzle-orm";
import { createHmac } from "crypto";

const PASSWORD_HASH_SECRET = process.env["PASSWORD_HASH_SECRET"] ?? "";

const JWT_DURATION = "1800s";
const JWT_TOKEN = process.env["JWT_TOKEN"] ?? "";

export async function createUser(
  username: string,
  password: string
): Promise<User | null> {
  const db = await getDb();

  // check if username available
  const rows = await db
    .select({ id: users.id, username: users.username })
    .from(users)
    .where(eq(users.username, username));
  if (rows.length > 0) {
    return null;
  }

  const info = await db.insert(users).values({
    username: username,
    passwordHash: hashPassword(password),
  });
  if (info.lastInsertRowid == null) {
    throw new Error("failed to create user in db.");
  }

  const user = await getUserById(db, info.lastInsertRowid as number);
  if (!user) {
    throw new Error("failed to create user in db");
  }

  return user;
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<User | null> {
  const db = await getDb();

  const user = await getUserByCreds(db, username, hashPassword(password));
  if (user === null) {
    return null;
  }

  return user;
}

async function getUserById(
  db: Awaited<ReturnType<typeof getDb>>,
  id: number
): Promise<User | null> {
  const rows = await db
    .select({ username: users.username, id: users.id })
    .from(users)
    .where(eq(users.id, id));
  if (rows.length > 1) {
    console.error(`user id collision for id ${id}`);
    return null;
  } else if (rows.length === 0) {
    return null;
  }
  return rows[0];
}

async function getUserByCreds(
  db: Awaited<ReturnType<typeof getDb>>,
  username: string,
  passwordHash: string
): Promise<User | null> {
  const rows = await db
    .select({ username: users.username, id: users.id })
    .from(users)
    .where(
      and(eq(users.username, username), eq(users.passwordHash, passwordHash))
    );
  if (rows.length > 1) {
    console.error(`user collision for username ${username}`);
    return null;
  } else if (rows.length === 0) {
    return null;
  }
  return rows[0];
}

function hashPassword(password: string): string {
  const md5Hasher = createHmac("md5", PASSWORD_HASH_SECRET);
  const hash = md5Hasher.update(password).digest("hex");
  md5Hasher.destroy();
  return hash;
}

export function createJWT(user: object): JWT {
  return jsonwebtoken.sign(user, JWT_TOKEN, { expiresIn: JWT_DURATION });
}

export function verifyJWT(jwt: JWT): User | null {
  try {
    const user = jsonwebtoken.verify(jwt, JWT_TOKEN) as User;
    return user;
  } catch (err) {
    return null;
  }
}