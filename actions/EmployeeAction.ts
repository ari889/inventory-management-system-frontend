"use server";

import { fetchData } from "@/lib/api";

/**
 * Get employee from server
 * @param param0
 * @returns Employee
 */
export const getEmployees = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  search = "",
  status = undefined,
  createdBy = undefined,
  departmentId = undefined,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search?: string;
  status?: boolean;
  createdBy?: number;
  departmentId?: number;
}) => {
  try {
    let url = `employees?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (search) url += `&search=${search}`;
    if (status !== undefined) url += `&status=${status}`;
    if (createdBy !== undefined) url += `&createdBy=${createdBy}`;
    if (departmentId !== undefined) url += `&departmentId=${departmentId}`;
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
 * Create new employee
 * @param formData
 * @returns Employee
 */
export const createEmployee = async (body: FormData) => {
  try {
    const response = await fetchData("employees", {
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
 * Delete employee by id
 * @param id
 * @returns Employee
 */
export const deleteEymployeeById = async (id: number) => {
  try {
    const response = await fetchData(`employees/${id}`, {
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
 * Get employee by id
 * @param id
 * @returns Employee
 */
export const getEmployeeById = async (id: number) => {
  try {
    const response = await fetchData(`employees/${id}`);

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
 * Update employee schema
 * @param id
 * @param data
 * @returns Employee
 */
export const updateEmployee = async (id: number, body: FormData) => {
  try {
    const response = await fetchData(`employees/${id}`, {
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
 * Bulk delete employees
 * @param ids
 * @returns Employee
 */
export const bulkDeleteEmployees = async (ids: number[]) => {
  try {
    const response = await fetchData(`employees/bulk`, {
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
