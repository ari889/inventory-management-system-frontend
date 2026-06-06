"use server";

import { fetchData } from "@/lib/api";
import { ExpenseCategorySchemaType } from "@/schemas/expense-category.schema";

/**
 * Get expense categories from server
 * @param param0
 * @returns ExpenseCategory[]
 */
export const getExpenseCategories = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  search = "",
  status = undefined,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search?: string;
  status?: boolean;
}) => {
  try {
    let url = `expense-categories?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (search) url += `&search=${search}`;
    if (status !== undefined) url += `&status=${status}`;
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
 * Create new expense categories
 * @param ExpenseCategorySchemaType
 * @returns ExpenseCategory
 */
export const createExpenseCategory = async (
  body: ExpenseCategorySchemaType,
) => {
  try {
    const response = await fetchData("expense-categories", {
      method: "POST",
      body: JSON.stringify(body),
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
 * Delete expense category by id
 * @param id
 * @returns ExpenseCategory
 */
export const deleteExpenseCategoryById = async (id: number) => {
  try {
    const response = await fetchData(`expense-categories/${id}`, {
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
 * Get expense category by id
 * @param id
 * @returns ExpenseCategory
 */
export const getExpenseCategoryById = async (id: number) => {
  try {
    const response = await fetchData(`expense-categories/${id}`);

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
 * Update expense category
 * @param id
 * @param data
 * @returns ExpenseCategory
 */
export const updateExpenseCategory = async (
  id: number,
  body: ExpenseCategorySchemaType,
) => {
  try {
    const response = await fetchData(`expense-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
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
 * Bulk delete expense categories
 * @param ids
 * @returns { success: boolean, data: {count: 4}, message: string }
 */
export const bulkDeleteExpenseCategories = async (ids: number[]) => {
  try {
    const response = await fetchData(`expense-categories/bulk`, {
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
