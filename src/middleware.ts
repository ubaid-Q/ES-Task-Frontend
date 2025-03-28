import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isTasks = request.nextUrl.pathname.startsWith("/tasks");
  const token = request.cookies.get("token")?.value;

  if ((isDashboard || isTasks) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*"],
};
