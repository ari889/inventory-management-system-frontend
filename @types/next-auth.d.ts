// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  // Flat session: only accessToken
  interface Session {
    accessToken: unknown | string;
    error?: string;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    error?: string;
  }
}
