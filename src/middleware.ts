import { CONSTANTS } from "./constants";
import { NextResponse, type NextRequest } from "next/server";

const REQUIRE_AUTH_ROUTES = ["/home", "/view", "/answer"];

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    if (request.cookies.get(CONSTANTS.ICEBREAKER_COOKIE_AUTH_ID)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  } else if (REQUIRE_AUTH_ROUTES.includes(request.nextUrl.pathname)) {
    if (request.cookies.get(CONSTANTS.ICEBREAKER_COOKIE_AUTH_ID) === undefined) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
