import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, API routes, brand assets, and uploads
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/uploads") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check redirects from internal API
  try {
    const origin = request.nextUrl.origin;
    const res = await fetch(`${origin}/api/admin/redirects`, {
      headers: { "x-internal-middleware": "true" },
      next: { revalidate: 15 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.rules)) {
        const normalized = pathname.toLowerCase();
        const rule = data.rules.find(
          (r: any) =>
            r.isActive &&
            (r.sourcePath === pathname ||
              r.sourcePath === normalized ||
              r.sourcePath === pathname + "/" ||
              r.sourcePath + "/" === pathname)
        );

        if (rule) {
          const target = rule.targetPath.startsWith("http")
            ? rule.targetPath
            : new URL(rule.targetPath, request.url).toString();
          return NextResponse.redirect(target, rule.statusCode === 302 ? 302 : 301);
        }
      }
    }
  } catch {
    // If redirect check fails, gracefully proceed
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
