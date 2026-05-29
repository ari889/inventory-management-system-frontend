"use server";

import { fetchData } from "@/lib/api";

/**
 * Get accounts from server
 * @param param0
 * @returns Account[]
 */
export const getBalanceSheet = async (
  from: Date | undefined,
  to: Date | undefined,
) => {
  try {
    let url = `balance-sheets`;
    if (from) url += `?from=${from}`;
    if (to) url += `&to=${to}`;
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
