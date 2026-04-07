"use server";

import { fetchData } from "@/lib/api";
import { CustomerGroupSchemaType } from "@/schemas/customer-group.schema";
import { revalidatePath } from "next/cache";

/**
 * Get customer groups from server
 * @param param0
 * @returns CustomerGroup
 */
export const getCustomerGroups = async ({
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
    const url = `customer-groups?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
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
 * Create new Customer Groups
 * @param formData
 * @returns CustomerGroup
 */
export const createCustomerGroup = async (
  formData: CustomerGroupSchemaType,
) => {
  try {
    const response = await fetchData("customer-groups", {
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
 * Delete customer group by id
 * @param id
 * @returns CustomerGroup
 */
export const deleteCustomerGroupById = async (id: number) => {
  try {
    const response = await fetchData(`customer-groups/${id}`, {
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
 * Get customer group by id
 * @param id
 * @returns CustomerGroup
 */
export const getCustomerGroupById = async (id: number) => {
  try {
    const response = await fetchData(`customer-groups/${id}`);

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
 * Update Customer Group schema
 * @param id
 * @param data
 * @returns CustomerGroup
 */
export const updateCustomerGroup = async (
  id: number,
  data: CustomerGroupSchemaType,
) => {
  try {
    const response = await fetchData(`customer-groups/${id}`, {
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
 * Bulk delete customer groups
 * @param ids
 * @returns CustomerGroups
 */
export const bulkDeleteCustomerGroups = async (ids: number[]) => {
  try {
    const response = await fetchData(`customer-groups/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidatePath("/admin/customer-groups");
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
