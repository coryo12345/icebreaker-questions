import "server-only";

import { JWT } from "@/models/auth";
import "dotenv/config";
import { getDb } from "@/db";

const JWT_DURATION = "1800s";

export async function createUser(
  username: string,
  password: string
): Promise<JWT> {
  const db = await getDb();
  return "";
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<JWT> {
  const db = await getDb();
  return "";
}
