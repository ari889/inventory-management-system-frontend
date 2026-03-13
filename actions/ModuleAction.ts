"use server";
import { fetchData } from "@/lib/api";
import { CreateModuleSchemaType } from "@/schemas/module.schema";
import { revalidatePath } from "next/cache";

/**
 * Get current logged in user modules
 * @returns Module
 */
export const getModules = async () => {
  try {
    const data = await fetchData("modules/role", {
      cache: "force-cache",
      next: { revalidate: 3600 },
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

/**
 * Get Module by menu id
 * @param menuId
 * @returns Module
 */
export const getModuleByMenuId = async (menuId: number) => {
  try {
    const data = await fetchData(`modules/menu/${menuId}`);

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

/**
 * Create module by post
 * @param module
 * @returns Module
 */
export const createModule = async (
  module: CreateModuleSchemaType,
  menuId: number,
) => {
  try {
    const data = await fetchData(`modules/${menuId}`, {
      method: "POST",
      body: JSON.stringify(module),
    });

    if (!data.success) throw new Error(data.message);
    revalidatePath(`/admin/menu/${menuId}`);
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
 * Delete module by id
 * @param id
 * @param menuId
 * @returns Module
 */
export const deleteModule = async (id: number, menuId: number) => {
  try {
    const data = await fetchData(`modules/${id}`, {
      method: "DELETE",
    });

    if (!data.success) throw new Error(data.message);
    revalidatePath(`/admin/menu/${menuId}`);
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
 * Get module by id
 * @param id
 * @returns Module
 */
export const getModule = async (id: number) => {
  try {
    const data = await fetchData(`modules/${id}`);

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

/**
 * Update module by id
 * @param id
 * @param formData
 * @returns Module
 */
export const updateModule = async (
  id: number,
  menuId: number,
  formData: CreateModuleSchemaType,
) => {
  try {
    const data = await fetchData(`modules/${id}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    });

    if (!data.success) throw new Error(data.message);
    revalidatePath(`/admin/menu/${menuId}`);
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
