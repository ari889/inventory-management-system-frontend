"use server";

import { fetchData } from "@/lib/api";
import {
  CreateUserSchemaType,
  UpdateUserSchemaType,
} from "@/schemas/user.schema";
import { revalidatePath } from "next/cache";

/**
 * Get menu from server
 * @param param0
 * @returns Menu
 */
export const getUsers = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
}) => {
  try {
    const url = `users?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    const data = await fetchData(url);

    if (!data?.success && !data?.errors) throw new Error(data.message);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    } else {
      return {
        success: false,
        message: error || "Something went wrong",
      };
    }
  }
};

/**
 * Create new user
 * @param formData
 * @returns User
 */
export const createUser = async (formData: CreateUserSchemaType) => {
  try {
    const data = await fetchData("users", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!data?.success && !data?.errors) throw new Error(data.message);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
};

/**
 * Delete user by id
 * @param id
 * @returns User
 */
export const deleteUserById = async (id: number) => {
  try {
    const data = await fetchData(`users/${id}`, {
      method: "DELETE",
    });

    if (!data?.success && !data?.errors) throw new Error(data.message);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
};

/**
 * Get user by id
 * @param id
 * @returns User
 */
export const getUserById = async (id: number) => {
  try {
    const data = await fetchData(`users/${id}`);

    if (!data?.success && !data?.errors) throw new Error(data.message);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
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

    if (!response.success && !response?.errors)
      throw new Error(response.message);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
};

/**
 * Bulk delete users
 * @param ids
 * @returns Users
 */
export const bulkDeleteUsers = async (ids: number[]) => {
  try {
    const data = await fetchData(`users/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });

    if (!data?.success && !data?.errors) throw new Error(data.message);
    revalidatePath("/admin/users");
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }
};
