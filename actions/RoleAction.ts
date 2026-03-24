"use server";

import { fetchData } from "@/lib/api";
import { CreateRoleSchemaType } from "@/schemas/role.schema";
import { revalidatePath } from "next/cache";

/**
 * Get role from server
 * @param param0
 * @returns Role
 */
export const getRoles = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  search = "",
  deletable = null,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search: string;
  deletable: boolean | null;
}) => {
  try {
    let url = `roles?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (search) url += `&search=${search}`;
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
 * Create new role
 * @param formData
 * @returns ROle
 */
export const createRole = async (formData: CreateRoleSchemaType) => {
  try {
    const data = await fetchData("roles", {
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
 * Delete role by id
 * @param id
 * @returns role
 */
export const deleteRoleById = async (id: number) => {
  try {
    const data = await fetchData(`roles/${id}`, {
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
 * Get role by id
 * @param id
 * @returns Role
 */
export const getRoleById = async (id: number) => {
  try {
    const data = await fetchData(`roles/${id}`);

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
 * Update role schema
 * @param id
 * @param data
 * @returns Role
 */
export const updateRole = async (id: number, data: CreateRoleSchemaType) => {
  try {
    const response = await fetchData(`roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.success) throw new Error(response.message);

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
 * Bulk delete roles
 * @param ids
 * @returns roles
 */
export const bulkDeleteRole = async (ids: number[]) => {
  try {
    const data = await fetchData(`roles/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });

    if (!data.success) throw new Error(data.message);
    revalidatePath("/admin/roles");
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
