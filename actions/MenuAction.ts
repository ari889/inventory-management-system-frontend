"use server";

import { fetchData } from "@/lib/api";

export const getMenus = async ({
  page = 1,
  limit = 10,
  order = "id",
  direction = "desc",
  search = "",
}: {
  page: number;
  limit: number;
  order: string;
  direction: "asc" | "desc";
  search: string;
}) => {
  console.log({ order, direction });
  try {
    const data = await fetchData(
      `menus?page=${page}&limit=${limit}&order=${order}&direction=${direction}&search=${search}`,
    );

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
