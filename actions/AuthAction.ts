"use server";

import { MyJWT } from "@/@types/auth.types";
import { fetchData } from "@/lib/api";

/**
 * Login user with email and password
 * @param email
 * @param password
 * @returns {Promise<{ success: boolean; message: string; accessToken: string; refreshToken: string; expiresIn: number }>}
 */
export const getAuth = async (email: string, password: string) => {
  try {
    const data = await fetchData("auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!data.success) throw new Error(data.message);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

/**
 * Generate new access token using refresh token
 */
let isCalled = false;
export const getRefreshToken = async (token: MyJWT) => {
  if (isCalled) return token;
  isCalled = true;
  try {
    const data = await fetchData("auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token?.refreshToken}`,
      },
    });

    if (!data.success) throw new Error(data.message);

    return {
      ...token,
      accessToken: data?.data?.accessToken,
      expiresIn: data?.data?.expiresIn,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }
    return token;
  } finally {
    isCalled = false;
  }
};
