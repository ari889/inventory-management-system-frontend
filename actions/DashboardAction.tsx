"use server";

import { fetchData } from "@/lib/api";

/**
 * Get dashboard data
 * @param query
 * @returns Dashboard data
 */
export const getDashboardData = async (range: string | undefined) => {
  try {
    let url = `dashboard`;
    if (range) url += `?range=${range}`;
    const response = await fetchData(url, {
      next: {
        revalidate: 3600 * 24,
      },
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
