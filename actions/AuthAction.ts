"use server";

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

export const getRefreshToken = async (refreshToken: string) => {
  try {
    const data = await fetchData("auth/refresh-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

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
