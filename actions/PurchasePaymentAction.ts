"use server";

import { fetchData } from "@/lib/api";
import { PurchasePaymentSchemaType } from "@/schemas/purchase-payment.schema";

/**
 * Create new purchase payment
 * @param PurchasePaymentSchemaType
 * @returns PurchasePayment
 */
export const createPurchasePayment = async (
  body: PurchasePaymentSchemaType,
) => {
  try {
    const response = await fetchData("purchase-payments", {
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
 * Delete purchase payment by id
 * @param id
 * @returns PurchasePayment
 */
export const deletePurchasePaymentById = async (id: number) => {
  try {
    const response = await fetchData(`purchase-payments/${id}`, {
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
 * Get purchase Payment by id
 * @param id
 * @returns PurchasePayment
 */
export const getPurchasePaymentById = async (id: number) => {
  try {
    const response = await fetchData(`purchase-payments/${id}`);

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
