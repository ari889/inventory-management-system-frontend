"use server";

import { fetchData } from "@/lib/api";

/**
 * Get products from server
 * @param param0
 * @returns Product
 */
export const getProducts = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  search = "",
  status = undefined,
  taxMethod = undefined,
  createdBy = undefined,
  brandId = undefined,
  categoryId = undefined,
  unitId = undefined,
  purchaseUnitId = undefined,
  saleUnitId = undefined,
  taxId = undefined,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search?: string;
  status?: boolean;
  taxMethod?: boolean;
  createdBy?: number;
  brandId?: number;
  categoryId?: number;
  unitId?: number;
  purchaseUnitId?: number;
  saleUnitId?: number;
  taxId?: number;
}) => {
  try {
    let url = `products?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (search) url += `&search=${search}`;
    if (status !== undefined) url += `&status=${status}`;
    if (taxMethod !== undefined) url += `&taxMethod=${taxMethod}`;
    if (createdBy) url += `&createdBy=${createdBy}`;
    if (brandId) url += `&brandId=${brandId}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (unitId) url += `&unitId=${unitId}`;
    if (purchaseUnitId) url += `&purchaseUnitId=${purchaseUnitId}`;
    if (saleUnitId) url += `&saleUnitId=${saleUnitId}`;
    if (taxId) url += `&taxId=${taxId}`;
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
 * Create new product
 * @param formData
 * @returns Product
 */
export const createProduct = async (body: FormData) => {
  try {
    const response = await fetchData("products", {
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
 * Delete product by id
 * @param id
 * @returns Product
 */
export const deleteProductById = async (id: number) => {
  try {
    const response = await fetchData(`products/${id}`, {
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
 * Get product by id
 * @param id
 * @returns Product
 */
export const getProductById = async (id: number) => {
  try {
    const response = await fetchData(`products/${id}`);

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
 * Update Product schema
 * @param id
 * @param data
 * @returns Product
 */
export const updateProduct = async (id: number, body: FormData) => {
  try {
    const response = await fetchData(`products/${id}`, {
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
 * Bulk delete products
 * @param ids
 * @returns Products
 */
export const bulkDeleteProducts = async (ids: number[]) => {
  try {
    const response = await fetchData(`products/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
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
