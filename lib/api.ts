"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

/**
 * Fetch data from API with authentication
 * @param url
 * @param options
 * @returns Promise<any>
 */
export const fetchData = async (url: string, options: RequestInit = {}) => {
  const session = await getServerSession(authOptions);

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (session?.accessToken && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${session?.accessToken}`;
  }

  const response = await fetch(`${process.env.API_URL}/api/admin/v1/${url}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text, success: response.ok };
  }

  return { ...data, status: response?.status };
};
