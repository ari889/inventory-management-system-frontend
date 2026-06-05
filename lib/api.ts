"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

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

  // Handle auth errors at the source — before returning to the caller
  if (response.status === 401) redirect("/admin/unauthorized");
  if (response.status === 403) redirect("/admin/access-denied");

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text, success: response.ok };
  }

  return { ...data, status: response.status };
};
