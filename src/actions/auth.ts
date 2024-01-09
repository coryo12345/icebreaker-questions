"use server";
import "server-only";

import { authenticateUser, createJWT, createUser } from "@/server/auth";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

export async function register(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const user = await createUser(username, password);
    if (user === null) {
      return false;
    }
    const jwt = createJWT(user);
    cookies().set("Authorization", jwt);
  } catch (err) {
    console.error(err);
    return false;
  }
  redirect("/home", RedirectType.push);
  return true;
}

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  try {
    const user = await authenticateUser(username, password);
    if (user === null) {
      return false;
    }
    const jwt = createJWT(user);
    cookies().set("Authorization", jwt);
  } catch (err) {
    console.error(err);
    return false;
  }
  redirect("/home", RedirectType.push);
  return true;
}

export async function logout() {
  cookies().delete("Authorization");
  // this doesnt work b/c of a bug in nextjs https://github.com/vercel/next.js/issues/58263
  redirect("/", RedirectType.replace);
}
