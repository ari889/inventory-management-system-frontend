"use server";
import { fetchData } from "@/lib/api";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Update settings with the provided FormData body. This function is designed to handle file uploads (like logo and favicon) without converting them to JSON, ensuring that the files are sent correctly to the server.
 * @param body
 * @returns Setting
 */
export const updateSettings = async (body: FormData) => {
  try {
    const response = await fetchData("settings", {
      method: "POST",
      body,
    });

    if (!response?.success && !response?.errors) {
      const error = new Error(response.message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    revalidatePath("/admin/settings");
    revalidateTag("settings", "max");
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
 * Fetch the current settings from the server. This function retrieves the settings data, which may include file URLs for the logo and favicon, without needing to handle file uploads.
 * @returns Setting
 */
export const getSettings = async () => {
  try {
    const response = await fetchData("settings", {
      next: { revalidate: 3600, tags: ["settings"] },
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
