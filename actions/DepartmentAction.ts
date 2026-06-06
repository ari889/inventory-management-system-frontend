"use server";

import { fetchData } from "@/lib/api";
import { DepartmentSchemaType } from "@/schemas/department.schema";

/**
 * Get department from server
 * @param param0
 * @returns Department[]
 */
export const getDepartments = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  search = "",
  status = undefined,
  createdBy = undefined,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search?: string;
  status?: boolean;
  createdBy?: number;
}) => {
  try {
    let url = `departments?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (search) url += `&search=${search}`;
    if (status !== undefined) url += `&status=${status}`;
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
 * Create new department
 * @param DepartmentSchemaType
 * @returns Department
 */
export const createDepartment = async (body: DepartmentSchemaType) => {
  try {
    const response = await fetchData("departments", {
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
 * Delete department by id
 * @param id
 * @returns Department
 */
export const deleteDepartmentById = async (id: number) => {
  try {
    const response = await fetchData(`departments/${id}`, {
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
 * Get department by id
 * @param id
 * @returns Department
 */
export const getDepartmentById = async (id: number) => {
  try {
    const response = await fetchData(`departments/${id}`);

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
 * Update deparrtment
 * @param id
 * @param data
 * @returns Department
 */
export const updateDepartment = async (
  id: number,
  body: DepartmentSchemaType,
) => {
  try {
    const response = await fetchData(`departments/${id}`, {
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
 * Bulk delete departments
 * @param ids
 * @returns { success: boolean, data: {count: 4}, message: string }
 */
export const bulkDeleteDepartments = async (ids: number[]) => {
  try {
    const response = await fetchData(`departments/bulk`, {
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
