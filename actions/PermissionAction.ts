"use server";
import { fetchData } from "@/lib/api";
import {
  PermissionItemSchemaType,
  PermissionSchemaType,
} from "@/schemas/permission.schema";
import { revalidatePath } from "next/cache";

/**
 * Get Permission from server
 * @param param0
 * @returns Permission
 */
export const getPermissions = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  name = "",
  slug = "",
  deletable = null,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  name: string;
  slug: string;
  deletable: boolean | null;
}) => {
  try {
    let url = `permissions?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;

    if (name) url += `&name=${name}`;

    if (slug) url += `&slug=${slug}`;

    if (deletable !== null) url += `&deletable=${deletable}`;
    const data = await fetchData(url);

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

/**
 * Permission
 * @param ids
 * @returns Permissions
 */
export const bulkDeletePermission = async (ids: number[]) => {
  try {
    const data = await fetchData(`permissions/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });

    if (!data.success) throw new Error(data.message);
    revalidatePath("/admin/permission");
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
