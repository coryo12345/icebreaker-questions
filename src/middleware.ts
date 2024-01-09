import "server-only";
// import { verifyJWT } from "@/server/auth";
import { NextResponse, type NextRequest } from "next/server";
import { User } from "@/models/auth";

const REQUIRE_AUTH_ROUTES = ["/home", "/view", "/answer"];

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("Authorization");
  if (cookie) {
    console.log(parseJwtPaylod(cookie.value));
  }
  // if (request.nextUrl.pathname === "/") {
  //   const jwtCookie = request.cookies.get("Authorization")
  //   if (jwtCookie && verifyJWT(jwtCookie.value) !== null) {
  //     return NextResponse.redirect(new URL("/home", request.url));
  //   }
  // } else if (REQUIRE_AUTH_ROUTES.includes(request.nextUrl.pathname)) {
  //   const jwtCookie = request.cookies.get("Authorization")
  //   if (!jwtCookie || !verifyJWT(jwtCookie.value)) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
function parseJwtPaylod(token: string): User {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
