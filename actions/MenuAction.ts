"use server";

import { fetchData } from "@/lib/api";
import { CreateMenuSchemaType } from "@/schemas/create-menu.schema";
import { revalidatePath } from "next/cache";

/**
 * Get menu from server
 * @param param0
 * @returns Menu
 */
export const getMenus = async ({
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
    let url = `menus?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (search) url += `&search=${search}`;
    if (deletable !== null) url += `&deletable=${deletable}`;
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
 * Create new Menu
 * @param formData
 * @returns Menu
 */
export const createMenu = async (formData: CreateMenuSchemaType) => {
  try {
    const response = await fetchData("menus", {
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
 * Delete meny by id
 * @param id
 * @returns Menu
 */
export const deleteMenuById = async (id: number) => {
  try {
    const response = await fetchData(`menus/${id}`, {
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
 * Get menu by id
 * @param id
 * @returns Menu
 */
export const getMenuById = async (id: number) => {
  try {
    const response = await fetchData(`menus/${id}`);

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
 * Update menu schema
 * @param id
 * @param data
 * @returns Menu
 */
export const updateMenu = async (id: number, data: CreateMenuSchemaType) => {
  try {
    const response = await fetchData(`menus/${id}`, {
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
 * Bulk delete menus
 * @param ids
 * @returns Menus
 */
export const bulkDeleteMenu = async (ids: number[]) => {
  try {
    const response = await fetchData(`menus/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidatePath("/admin/menus");
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
