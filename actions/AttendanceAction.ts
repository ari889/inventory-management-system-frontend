"use server";
import { AttendanceSchemaType } from "./../schemas/attendance.schema";
import { fetchData } from "@/lib/api";

/**
 * Get Attendance from server
 * @param param0
 * @returns Attendance[]
 */
export const getAttendances = async ({
  page = 0,
  limit = 10,
  order = "id",
  direction = "desc",
  employeeId = undefined,
  createdBy = undefined,
  status = undefined,
  date = undefined,
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  employeeId?: number;
  createdBy?: number;
  status?: boolean;
  date?: string;
}) => {
  try {
    let url = `attendances?page=${page}&limit=${limit}&order=${order}&direction=${direction}`;
    if (employeeId !== undefined) url += `&employeeId=${employeeId}`;
    if (createdBy !== undefined) url += `&createdBy=${createdBy}`;
    if (status !== undefined) url += `&status=${status}`;
    if (date !== undefined) url += `&date=${date}`;

    console.log(url);

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
 * Create new attendance
 * @param AttendanceSchemaType
 * @returns Attendance
 */
export const createAttendance = async (body: AttendanceSchemaType) => {
  try {
    const response = await fetchData("attendances", {
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
 * Delete attendance by id
 * @param id
 * @returns Attendance
 */
export const deleteAttendanceById = async (id: number) => {
  try {
    const response = await fetchData(`attendances/${id}`, {
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
 * Get attendance by id
 * @param id
 * @returns Attendance
 */
export const getAttendanceById = async (id: number) => {
  try {
    const response = await fetchData(`attendances/${id}`);

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
 * Update attendance
 * @param id
 * @param data
 * @returns Attendance
 */
export const updateAttendance = async (
  id: number,
  body: AttendanceSchemaType,
) => {
  try {
    const response = await fetchData(`attendances/${id}`, {
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
 * Bulk delete attendances
 * @param ids
 * @returns { success: boolean, data: {count: 4}, message: string }
 */
export const bulkDeleteAttendances = async (ids: number[]) => {
  try {
    const response = await fetchData(`attendances/bulk`, {
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
