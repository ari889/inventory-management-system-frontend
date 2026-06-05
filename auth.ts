import CredentialsProvider from "next-auth/providers/credentials";
import { getAuth } from "./actions/AuthAction";
import { authSchema } from "./schemas/auth.schema";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { ZodError } from "zod";

interface CachedResult {
  token: JWT;
  cachedAt: number;
}

const refreshCache = new Map<string, Promise<JWT>>();
const resultCache = new Map<string, CachedResult>();

async function refreshAccessToken(token: JWT): Promise<JWT> {
  const cacheKey = token.refreshToken as string;

  const cached = resultCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < 10_000) {
    return cached.token;
  }

  if (refreshCache.has(cacheKey)) {
    return refreshCache.get(cacheKey)!;
  }

  const promise = (async (): Promise<JWT> => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/admin/v1/auth/refresh`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.refreshToken}`,
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!data.success) throw new Error(data.message);

      const refreshedToken: JWT = {
        ...token,
        accessToken: data.data.accessToken,
        expiresIn: data.data.expiresIn, // already ms timestamp from backend
        error: undefined,
      };

      resultCache.set(cacheKey, {
        token: refreshedToken,
        cachedAt: Date.now(),
      });

      return refreshedToken;
    } catch {
      resultCache.delete(cacheKey);
      return {
        ...token,
        error: "RefreshAccessTokenError" as const,
      };
    } finally {
      refreshCache.delete(cacheKey);
    }
  })();

  refreshCache.set(cacheKey, promise);
  return promise;
}

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
            expiresIn: res.data.expiresIn, // already ms timestamp from backend
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

      if (token.error === "RefreshAccessTokenError") return token;

      const bufferMs = 60 * 1000;
      if (Date.now() < Number(token.expiresIn) - bufferMs) return token;

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};
