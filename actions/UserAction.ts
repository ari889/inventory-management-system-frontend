"use server";

import { fetchData } from "@/lib/api";
import {
  CreateUserSchemaType,
  UpdateUserSchemaType,
} from "@/schemas/user.schema";
import { revalidatePath } from "next/cache";

/**
 * Get users from server
 * @param param0
 * @returns Menu
 */
export const getUsers = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  search = "",
  gender = undefined,
  status = undefined,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search?: string;
  gender?: boolean;
  status?: boolean;
}) => {
  try {
    let url = `users?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (search) url += `&search=${search}`;
    if (gender !== undefined) url += `&gender=${gender}`;
    if (status !== undefined) url += `&status=${status}`;
    const response = await fetchData(url);

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
 * Create new user
 * @param formData
 * @returns User
 */
export const createUser = async (formData: CreateUserSchemaType) => {
  try {
    const response = await fetchData("users", {
      method: "POST",
      body: JSON.stringify(formData),
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
 * Delete user by id
 * @param id
 * @returns User
 */
export const deleteUserById = async (id: number) => {
  try {
    const response = await fetchData(`users/${id}`, {
      method: "DELETE",
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
 * Get user by id
 * @param id
 * @returns User
 */
export const getUserById = async (id: number) => {
  try {
    const response = await fetchData(`users/${id}`);

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
 * Update user schema
 * @param id
 * @param data
 * @returns User
 */
export const updateUser = async (id: number, data: UpdateUserSchemaType) => {
  try {
    const response = await fetchData(`users/${id}`, {
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

/**
 * Bulk delete users
 * @param ids
 * @returns Users
 */
export const bulkDeleteUsers = async (ids: number[]) => {
  try {
    const response = await fetchData(`users/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidatePath("/admin/users");
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
