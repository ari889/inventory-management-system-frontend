"use server";

import { fetchData } from "@/lib/api";
import { CreateMenuSchemaType } from "@/schemas/create-menu.schema";

/**
 * Get menu from server
 * @param param0
 * @returns Menu
 */
export const getMenus = async ({
  page = 1,
  limit = 10,
  order = "id",
  direction = "desc",
  search = "",
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search: string;
}) => {
  try {
    const data = await fetchData(
      `menus?page=${page}&limit=${limit}&order=${order}&direction=${direction}&search=${search}`,
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
 * Create new Menu
 * @param formData
 * @returns Menu
 */
export const createMenu = async (formData: CreateMenuSchemaType) => {
  try {
    const data = await fetchData("menus", {
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
 * Delete meny by id
 * @param id
 * @returns Menu
 */
export const deleteMenuById = async (id: number) => {
  try {
    const data = await fetchData(`menus/${id}`, {
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
 * Get menu by id
 * @param id
 * @returns Menu
 */
export const getMenuById = async (id: number) => {
  try {
    const data = await fetchData(`menus/${id}`);

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
