import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

const restrictedPaths = ["/n", "/d", "/p"];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  const currentUrl = req.nextUrl;
  const role = token?.role;

  if (
    (!token || !role) &&
    restrictedPaths.some((path) => currentUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    token &&
    role === "patient" &&
    (currentUrl.pathname.startsWith("/n") ||
      currentUrl.pathname.startsWith("/d") ||
      currentUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/p/dashboard", req.url));
  }

  if (
    token &&
    role === "ngo" &&
    (currentUrl.pathname.startsWith("/p") ||
      currentUrl.pathname.startsWith("/d") ||
      currentUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/n/dashboard", req.url));
  }

  if (
    token &&
    role === "healthcare_provider" &&
    (currentUrl.pathname.startsWith("/p") ||
      currentUrl.pathname.startsWith("/n") ||
      currentUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/d/dashboard", req.url));
  }
}

export const config = {
  matcher: ["/u/:path*", "/d/:path*", "/p/:path*", "/n/:path*", "/:path*"],
};
