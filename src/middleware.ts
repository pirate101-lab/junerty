import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

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
