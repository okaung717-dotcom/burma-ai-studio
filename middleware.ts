import { NextResponse, type NextRequest } from "next/server";

const hiddenAdminPrefix = "/admin6996";
const publicAdminPaths = ["/admin", "/admin/chat", "/admin/analytics"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicAdminPaths.includes(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (pathname.startsWith(hiddenAdminPrefix)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/chat", "/admin/analytics", "/admin6996/:path*"],
};
