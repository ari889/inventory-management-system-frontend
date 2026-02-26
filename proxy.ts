import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname, searchParams } = req.nextUrl;
    const token = req.nextauth.token;

    // If logged in user tries to access auth routes
    if (token && pathname.startsWith("/login")) {
      const callbackUrl = searchParams.get("callbackUrl");

      return NextResponse.redirect(
        new URL(callbackUrl || "/admin/dashboard", req.url),
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public auth routes always
        if (pathname.startsWith("/login")) {
          return true;
        }

        // Protect admin routes
        if (pathname.startsWith("/admin")) {
          return !!token;
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
