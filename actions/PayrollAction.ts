"use server";

import { fetchData } from "@/lib/api";
import { PayrollSchemaType } from "@/schemas/payroll.schema";

/**
 * Get payroll from server
 * @param param0
 * @returns Payroll
 */
export const getPayrolls = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  employeeId = undefined,
  accountId = undefined,
  paymentMethods = undefined,
  createdBy = undefined,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  employeeId?: number;
  accountId?: number;
  paymentMethods?: "CASH" | "CHEQUE" | "BANK";
  createdBy?: number;
}) => {
  try {
    let url = `payrolls?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (employeeId !== undefined) url += `&employeeId=${employeeId}`;
    if (accountId !== undefined) url += `&accountId=${accountId}`;
    if (paymentMethods !== undefined)
      url += `&paymentMethods=${paymentMethods}`;
    if (createdBy !== undefined) url += `&createdBy=${createdBy}`;
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
 * Create new payroll
 * @param formData
 * @returns Payroll
 */
export const createPayroll = async (body: PayrollSchemaType) => {
  try {
    const response = await fetchData("payrolls", {
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
 * Delete payroll by id
 * @param id
 * @returns Payroll
 */
export const deletePayrollById = async (id: number) => {
  try {
    const response = await fetchData(`payrolls/${id}`, {
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
 * Get payroll by id
 * @param id
 * @returns Payroll
 */
export const getPayrollById = async (id: number) => {
  try {
    const response = await fetchData(`payrolls/${id}`);

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
 * Update payroll schema
 * @param id
 * @param data
 * @returns Payroll
 */
export const updatePayroll = async (id: number, body: PayrollSchemaType) => {
  try {
    const response = await fetchData(`payrolls/${id}`, {
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
 * Bulk delete payrolls
 * @param ids
 * @returns Payroll
 */
export const bulkDeletePayrolls = async (ids: number[]) => {
  try {
    const response = await fetchData(`payrolls/bulk`, {
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
