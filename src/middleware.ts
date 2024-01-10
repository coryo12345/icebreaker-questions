import "server-only";

import { GenericToken, UserToken } from "@/models/auth";
import { NextResponse, type NextRequest } from "next/server";

const REQUIRE_AUTH_ROUTES = ["/home", "/view", "/answer"];

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("Authorization");
  if (request.nextUrl.pathname === "/") {
    if (cookie && !tokenExpired(parseJwtPaylod(cookie.value))) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  } else if (REQUIRE_AUTH_ROUTES.includes(request.nextUrl.pathname)) {
    if (!cookie || tokenExpired(parseJwtPaylod(cookie.value))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
function parseJwtPaylod(token: string): UserToken {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function tokenExpired(token: GenericToken): boolean {
  if (!token || !token.exp) return true;
  const exp = new Date(token.exp * 1000);
  return exp < new Date();
}
