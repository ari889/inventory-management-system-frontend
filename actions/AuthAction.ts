"use server";

import { MyJWT } from "@/@types/auth.types";
import { fetchData } from "@/lib/api";
import { ChangePasswordSchemaType } from "@/schemas/password.schema";
import { revalidatePath, revalidateTag } from "next/cache";

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

    if (!data?.success && !data?.errors) throw new Error(data.message);

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
 * Fetched user details
 * @returns User
 */
export const getUser = async () => {
  try {
    const response = await fetchData("auth/user", {
      next: {
        revalidate: 3600 * 24 * 7,
        tags: ["user"],
      },
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        status: (error as Error & { status?: number }).status ?? 500,
        message: error.message || "Something went wrong",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Something went wrong",
    };
  }
};

/**
 * Update Profile
 * @param id
 * @param data
 * @returns User
 */
export const updateProfile = async (data: FormData) => {
  try {
    const response = await fetchData(`auth/profile`, {
      method: "PATCH",
      body: data,
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidatePath("/admin/profile");
    revalidateTag("user", "max");

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        status: (error as Error & { status?: number }).status ?? 500,
        message: error.message || "Something went wrong",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Something went wrong",
    };
  }
};

/**
 * Update Password
 * @param data
 * @returns none
 */
export const updatePassword = async (data: ChangePasswordSchemaType) => {
  try {
    const response = await fetchData(`auth/password`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        status: (error as Error & { status?: number }).status ?? 500,
        message: error.message || "Something went wrong",
      };
    }
    return {
      success: false,
      status: 500,
      message: "Something went wrong",
    };
  }
};
