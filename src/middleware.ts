import { auth } from "@/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isPublic = path === "/" || path.startsWith("/auth");

  if (isPublic) return;

  if (!req.auth) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return Response.redirect(loginUrl);
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
