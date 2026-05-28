"use server";

import { fetchData } from "@/lib/api";
import { revalidatePath } from "next/cache";

/**
 * Get sales from server
 * @param param0
 * @returns Sale
 */
export const getSales = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  search = "",
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search?: string;
}) => {
  try {
    let url = `sales?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (search) url += `&search=${search}`;
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
 * Create new sale
 * @param formData
 * @returns Sale
 */
export const createSale = async (body: FormData) => {
  try {
    const response = await fetchData("sales", {
      method: "POST",
      body,
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
 * Delete sale by id
 * @param id
 * @returns Sale
 */
export const deleteSaleById = async (id: number) => {
  try {
    const response = await fetchData(`sales/${id}`, {
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
 * Get sale by id
 * @param id
 * @returns Sale
 */
export const getSaleById = async (id: number) => {
  try {
    const response = await fetchData(`sales/${id}`);

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
 * Update Sale schema
 * @param id
 * @param data
 * @returns Sale
 */
export const updateSale = async (id: number, body: FormData) => {
  try {
    const response = await fetchData(`sales/${id}`, {
      method: "PATCH",
      body,
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
 * Bulk delete sales
 * @param ids
 * @returns Sales
 */
export const bulkDeleteSales = async (ids: number[]) => {
  try {
    const response = await fetchData(`sales/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidatePath("/admin/sales");
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
