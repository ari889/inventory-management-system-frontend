import CredentialsProvider from "next-auth/providers/credentials";
import { getAuth, getRefreshToken } from "./actions/AuthAction";
import { authSchema } from "./schemas/auth.schema";
import { NextAuthOptions } from "next-auth";
import { ZodError } from "zod";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: Number(process.env.NEXTAUTH_SESSION_MAX_AGE),
  },
  jwt: {
    maxAge: Number(process.env.NEXTAUTH_JWT_MAX_AGE),
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials) {
        try {
          const { email, password } = await authSchema.parseAsync(credentials);
          const res = await getAuth(email, password);

          if (!res.success) throw new Error(res.message);

          return {
            id: email,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            expiresIn: res.data.expiresIn,
          };
        } catch (error) {
          if (error instanceof ZodError || error instanceof Error)
            throw new Error(error.message);
          throw new Error("Something went wrong");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      if (Date.now() < Number(token.expiresIn)) {
        return token;
      }

      if (token.error === "RefreshAccessTokenError") {
        return {};
      }

      return await getRefreshToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};
