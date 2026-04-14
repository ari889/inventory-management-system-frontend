"use server";

import { fetchData } from "@/lib/api";
import { HRMSettingSchemaType } from "@/schemas/hrm-setting.schema";

/**
 * Get hrm setting by id
 * @param id
 * @returns HRMSetting
 */
export const getHrmSetting = async () => {
  try {
    const response = await fetchData(`hrm-settings`);

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
 * Create or update hrm setting
 * @param AccountSchemaType
 * @returns Account
 */
export const createOrUpdateHrmSetting = async (body: HRMSettingSchemaType) => {
  try {
    const response = await fetchData("hrm-settings", {
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
