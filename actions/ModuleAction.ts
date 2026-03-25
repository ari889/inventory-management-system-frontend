"use server";
import { Module } from "@/@types/module.types";
import { fetchData } from "@/lib/api";
import { CreateModuleSchemaType } from "@/schemas/module.schema";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Get current logged in user modules
 * @returns Module
 */
export const getModules = async () => {
  try {
    const response = await fetchData("modules/role", {
      next: { revalidate: 3600, tags: ["modules"] },
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
 * Get Modules with permissions
 * @returns Module[]
 */
export const getModulesWithPermission = async () => {
  try {
    const response = await fetchData("modules/permissions");

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
 * Get Module by menu id
 * @param menuId
 * @returns Module
 */
export const getModuleByMenuId = async (menuId: number) => {
  try {
    const response = await fetchData(`modules/menu/${menuId}`);

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
 * Create module by post
 * @param module
 * @returns Module
 */
export const createModule = async (
  module: CreateModuleSchemaType,
  menuId: number,
) => {
  try {
    const response = await fetchData(`modules/${menuId}`, {
      method: "POST",
      body: JSON.stringify(module),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidateTag("modules", "max");
    revalidatePath(`/admin/menus/${menuId}`);
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
 * Delete module by id
 * @param id
 * @param menuId
 * @returns Module
 */
export const deleteModule = async (menuId: number, id: number) => {
  try {
    const response = await fetchData(`modules/${id}`, {
      method: "DELETE",
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidateTag("modules", "max");
    revalidatePath(`/admin/menus/${menuId}`);
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
 * Get module by id
 * @param id
 * @returns Module
 */
export const getModule = async (id: number) => {
  try {
    const response = await fetchData(`modules/${id}`);

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
    const response = await fetchData(`modules/${id}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidateTag("modules", "max");
    revalidatePath(`/admin/menus/${menuId}`);
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
 *
 * @param menuId
 * @param formData
 * @returns Module
 */
export const updateModuleRecorder = async (
  menuId: number,
  formData: Module[],
) => {
  try {
    const response = await fetchData(`modules/recorder`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidateTag("modules", "max");
    revalidatePath(`/admin/menus/${menuId}`);
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
