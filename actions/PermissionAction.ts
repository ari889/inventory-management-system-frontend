"use server";
import { fetchData } from "@/lib/api";
import {
  PermissionItemSchemaType,
  PermissionSchemaType,
} from "@/schemas/permission.schema";

/**
 * Get Permission from server
 * @param param0
 * @returns Permission
 */
export const getPermissions = async ({
  page = 1,
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
    const data = await fetchData(
      `permissions?page=${page}&limit=${limit}&order=${order}&direction=${direction}`,
    );

    if (!data.success) throw new Error(data.message);

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
 * Permission
 * @param id
 * @returns Permission
 */
export const getPermissionById = async (id: number) => {
  try {
    const data = await fetchData(`permissions/${id}`);

    if (!data.success) throw new Error(data.message);

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
 * Delete Permission by id
 * @param id
 * @returns Permission
 */
export const deletePermissionById = async (id: number) => {
  try {
    const data = await fetchData(`permissions/${id}`, {
      method: "DELETE",
    });

    if (!data.success) throw new Error(data.message);

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
 * Create permissions
 * @param formData
 * @returns Permission
 */
export const createPermission = async (formData: PermissionSchemaType) => {
  try {
    const data = await fetchData(`permissions`, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!data.success) throw new Error(data.message);

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
 * Update Permission by id
 * @param id
 * @param formData
 * @returns Permission
 */
export const updatePermission = async (
  id: number,
  formData: PermissionItemSchemaType,
) => {
  try {
    const data = await fetchData(`permissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    });

    if (!data.success) throw new Error(data.message);

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
