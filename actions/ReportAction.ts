"use server";

import { fetchData } from "@/lib/api";

/**
 * Get summary report
 * @param param0
 * @returns Account[]
 */
export const getSummaryReport = async (
  from: Date | undefined,
  to: Date | undefined,
) => {
  try {
    let url = `reports/summary-report`;
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

/**
 * Daily sales report action
 * @param warehouseId
 * @param from
 * @param to
 * @returns any
 */
export const getDailySale = async (
  warehouseId: number | null,
  from: Date | undefined,
  to: Date | undefined,
) => {
  try {
    let url = `reports/daily-sale-report`;
    if (warehouseId) url += `?warehouseId=${warehouseId}`;
    if (from) url += `${warehouseId ? "&" : "?"}from=${from}`;
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

/**
 * Get monthly sales report
 * @param warehouseId
 * @param year
 * @returns
 */
export const getMonthlySale = async (
  warehouseId: number | null,
  year: number,
) => {
  try {
    let url = `reports/monthly-sale-report`;
    if (warehouseId) url += `?warehouseId=${warehouseId}`;
    if (year) url += `${warehouseId ? "&" : "?"}year=${year}`;
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
 * Daily purchase report action
 * @param warehouseId
 * @param from
 * @param to
 * @returns any
 */
export const getDailyPurchase = async (
  warehouseId: number | null,
  from: Date | undefined,
  to: Date | undefined,
) => {
  try {
    let url = `reports/daily-purchase-report`;
    if (warehouseId) url += `?warehouseId=${warehouseId}`;
    if (from) url += `${warehouseId ? "&" : "?"}from=${from}`;
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

/**
 * Get monthly purchase report
 * @param warehouseId
 * @param year
 * @returns
 */
export const getMonthlyPurchase = async (
  warehouseId: number | null,
  year: number,
) => {
  try {
    let url = `reports/monthly-purchase-report`;
    if (warehouseId) url += `?warehouseId=${warehouseId}`;
    if (year) url += `${warehouseId ? "&" : "?"}year=${year}`;
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
