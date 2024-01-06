"use server";

import { CONSTANTS } from "@/constants";
import { cookies } from "next/headers";

export async function logout() {
  cookies().delete(CONSTANTS.ICEBREAKER_COOKIE_AUTH_ID);
  // this doesnt work b/c of a bug in nextjs https://github.com/vercel/next.js/issues/58263
  // redirect("/", RedirectType.replace);
}
