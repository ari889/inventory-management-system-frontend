"use server";
import { fetchData } from "@/lib/api";
import {
  PermissionItemSchemaType,
  PermissionSchemaType,
} from "@/schemas/permission.schema";
import { revalidatePath, revalidateTag } from "next/cache";

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
  search = "",
  moduleId = undefined,
  deletable = undefined,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search?: string;
  moduleId?: number;
  deletable?: boolean;
}) => {
  try {
    let url = `permissions?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;

    if (search) url += `&search=${search}`;
    if (moduleId) url += `&moduleId=${moduleId}`;
    if (deletable !== undefined) url += `&deletable=${deletable}`;
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
 * Find permission by id
 * @param id
 * @returns Permission
 */
export const getPermissionById = async (id: number) => {
  try {
    const response = await fetchData(`permissions/${id}`);

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
 * Delete Permission by id
 * @param id
 * @returns Permission
 */
export const deletePermissionById = async (id: number) => {
  try {
    const response = await fetchData(`permissions/${id}`, {
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
 * Create permissions
 * @param formData
 * @returns Permission
 */
export const createPermission = async (formData: PermissionSchemaType) => {
  try {
    const response = await fetchData(`permissions`, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidatePath("/admin/permissions");
    revalidateTag("modules", "max");
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
    const response = await fetchData(`permissions/${id}`, {
      method: "PATCH",
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
 * Bulk delete permissions
 * @param ids
 * @returns Permissions
 */
export const bulkDeletePermission = async (ids: number[]) => {
  try {
    const response = await fetchData(`permissions/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidatePath("/admin/permission");
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
 * check Permission by slug
 * @param slug
 * @returns Boolean
 */
export const checkPermission = async (slug: string) => {
  try {
    const response = await fetchData(`permissions/check-slug/${slug}`);

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
