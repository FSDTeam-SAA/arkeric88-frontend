import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User { id: string; role: "user" | "admin"; accessToken: string; }
  interface Session { user: DefaultSession["user"] & { id: string; role: "user" | "admin"; accessToken: string; }; }
}
declare module "next-auth/jwt" {
  interface JWT { id: string; role: "user" | "admin"; accessToken: string; }
}
