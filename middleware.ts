import { NextResponse, type NextRequest } from "next/server";

// Basic-auth gate for the admin panel. Username: admin, password: ADMIN_PASSWORD.
export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse("Set ADMIN_PASSWORD to use the admin panel.", { status: 503 });

  const header = req.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const [user, pass] = atob(encoded).split(":");
    if (user === "admin" && pass === password) return NextResponse.next();
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin"' },
  });
}

export const config = { matcher: ["/admin/:path*"] };
