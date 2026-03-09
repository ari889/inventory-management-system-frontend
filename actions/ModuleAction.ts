"use server";
import { fetchData } from "@/lib/api";

export const getModules = async () => {
  try {
    const data = await fetchData("modules/role", {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!data.success) throw new Error(data.message);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
