"use server";

import { fetchData } from "@/lib/api";
import { ExpenseSchemaType } from "@/schemas/expense.schema";

/**
 * Get expense from server
 * @param param0
 * @returns Expense[]
 */
export const getExpense = async ({
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
    const url = `expenses?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
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
 * Create new expense
 * @param ExpenseSchemaType
 * @returns Expense
 */
export const createExpense = async (body: ExpenseSchemaType) => {
  try {
    const response = await fetchData("expenses", {
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
 * Delete expense by id
 * @param id
 * @returns Expense
 */
export const deleteExpenseById = async (id: number) => {
  try {
    const response = await fetchData(`expenses/${id}`, {
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
 * Get expense by id
 * @param id
 * @returns Expense
 */
export const getExpenseById = async (id: number) => {
  try {
    const response = await fetchData(`expenses/${id}`);

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
 * Update expense
 * @param id
 * @param data
 * @returns Expense
 */
export const updateExpense = async (id: number, body: ExpenseSchemaType) => {
  try {
    const response = await fetchData(`expenses/${id}`, {
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
 * Bulk delete expense
 * @param ids
 * @returns { success: boolean, data: {count: 4}, message: string }
 */
export const bulkDeleteExpense = async (ids: number[]) => {
  try {
    const response = await fetchData(`expenses/bulk`, {
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
