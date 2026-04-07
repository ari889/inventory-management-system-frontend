"use server";

import { fetchData } from "@/lib/api";
import { WarehouseSchemaType } from "@/schemas/warehouse.schema";
import { revalidatePath } from "next/cache";

/**
 * Get menu from server
 * @param param0
 * @returns Menu
 */
export const getWarehouses = async ({
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
    const url = `warehouses?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
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
 * Create new warehouse
 * @param formData
 * @returns Warehouse
 */
export const createWarehouse = async (formData: WarehouseSchemaType) => {
  try {
    const response = await fetchData("warehouses", {
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
 * Delete warehouse by id
 * @param id
 * @returns Warehouse
 */
export const deleteWarehouseById = async (id: number) => {
  try {
    const response = await fetchData(`warehouses/${id}`, {
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
 * Get warehouse by id
 * @param id
 * @returns Warehouse
 */
export const getWarehouseById = async (id: number) => {
  try {
    const response = await fetchData(`warehouses/${id}`);

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
 * Update warehouse schema
 * @param id
 * @param data
 * @returns Warehouse
 */
export const updateWarehouse = async (
  id: number,
  data: WarehouseSchemaType,
) => {
  try {
    const response = await fetchData(`warehouses/${id}`, {
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
 * Bulk delete warehouses
 * @param ids
 * @returns Warehouses
 */
export const bulkDeleteWarehouses = async (ids: number[]) => {
  try {
    const response = await fetchData(`warehouses/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidatePath("/admin/warehouses");
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
