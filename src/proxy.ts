import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAdminLoginRoute = nextUrl.pathname === "/admin/login";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isUserDashboardRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/tasks") ||
    nextUrl.pathname.startsWith("/profile") ||
    nextUrl.pathname.startsWith("/settings") ||
    nextUrl.pathname.startsWith("/wallet") ||
    nextUrl.pathname.startsWith("/referrals") ||
    nextUrl.pathname.startsWith("/activate") ||
    nextUrl.pathname.startsWith("/withdraw");

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  if (isAdminRoute && !isAdminLoginRoute && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  if (isUserDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/wallet/:path*",
    "/referrals/:path*",
    "/activate/:path*",
    "/withdraw/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
};
