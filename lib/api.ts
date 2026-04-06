"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export const fetchData = async (url: string, options: RequestInit = {}) => {
  const session = await getServerSession(authOptions);

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {};

  if (!isFormData) {
    if (options.body && typeof options.body === "string") {
      headers["Content-Type"] = "application/json";
    }
    Object.assign(headers, options.headers);
  }

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
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

  return { ...data, status: response.status };
};
