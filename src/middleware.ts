import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // const token = await getToken({
  //   req: request,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });
  // const pathname = request.nextUrl.pathname;
  // const authRoutes = ["/login", "/register"];
  // if (!token && !authRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  // const protectedRoutes = ["/", "/profile", "/settings", "/projects"];
  // const isProtectedRoute = protectedRoutes.includes(pathname);
  // if (isProtectedRoute && !token) {
  //   const loginUrl = new URL("/login", request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  // const isAuthRoute = authRoutes.includes(pathname);
  // if (isAuthRoute && token) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/(dashboard)/:path*", "/login", "/register"],
};
