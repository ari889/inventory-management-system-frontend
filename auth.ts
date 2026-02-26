import CredentialsProvider from "next-auth/providers/credentials";
import { getAuth, getRefreshToken } from "./actions/AuthAction";
import { authSchema } from "./schemas/auth.schema";
import { NextAuthOptions } from "next-auth";
import { ZodError } from "zod";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
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

      if (token.expiresIn && (token.expiresIn as number) < Date.now()) {
        const refreshResponse = await getRefreshToken(
          token.refreshToken as string,
        );
        return {
          ...token,
          accessToken: refreshResponse.data.accessToken,
          expiresIn: refreshResponse.data.expiresIn,
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};
