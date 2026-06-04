"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

/**
 * Fetch data from the API with authentication. This function automatically includes the access token from the user's session in the Authorization header and handles both JSON and non-JSON responses gracefully. It returns a consistent response structure containing the response data, success status, and HTTP status code, along with error handling to manage failures effectively.
 * @param url
 * @param options
 * @returns an object containing the response data, success status, and HTTP status code. The function handles both JSON and non-JSON responses, and it includes error handling to return a consistent response structure in case of failures.
 * @description This function is a utility for making authenticated API requests to the backend. It automatically includes the access token from the user's session in the Authorization header and handles both JSON and non-JSON responses gracefully.
 */
export const fetchData = async (url: string, options: RequestInit = {}) => {
  const session = await getServerSession(authOptions);

  const isFormData = options.body instanceof FormData;
  const incomingHeaders = (options.headers as Record<string, string>) ?? {};

  const headers: Record<string, string> = { ...incomingHeaders };

  if (!isFormData && options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  if (!headers["Authorization"] && session?.accessToken) {
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
