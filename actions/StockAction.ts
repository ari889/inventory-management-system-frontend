"use server";

import { fetchData } from "@/lib/api";

/**
 * Get product stock from server
 * @param param0
 * @returns Product
 */
export const getStock = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  name = "",
  warehouseId = undefined,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  name?: string;
  warehouseId?: number;
}) => {
  try {
    let url = `stock?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (name) url += `&name=${name}`;
    if (warehouseId) url += `&warehouseId=${warehouseId}`;
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
