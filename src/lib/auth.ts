import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const apiUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  cookies: {
    sessionToken: {
      name: "velari-frontend.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [CredentialsProvider({
    name: "Credentials",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) throw new Error("Email and password are required");
      try {
        const response = await fetch(`${apiUrl}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store", body: JSON.stringify({ email: credentials.email, password: credentials.password }) });
        const result = await response.json();
        if (!response.ok || !result?.success) throw new Error(result?.message || "Invalid email or password");
        const { user, accessToken } = result.data || {};
        if (!user?._id || !user?.email || !accessToken) throw new Error("Invalid authentication response");
        if (user.status === "suspended") throw new Error("Your account is suspended");
        return { id: user._id, name: user.fullName, email: user.email, role: user.role || "user", accessToken };
      } catch (error) { if (error instanceof Error) throw error; throw new Error("Unable to connect to the authentication server"); }
    },
  })],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) { if (user) { token.id = user.id; token.name = user.name; token.email = user.email; token.role = user.role; token.accessToken = user.accessToken; } return token; },
    async session({ session, token }) {
      session.user = { ...session.user, id: token.id, name: token.name, email: token.email, role: token.role, accessToken: token.accessToken };
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
