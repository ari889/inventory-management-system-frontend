"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export const fetchData = async (url: string, options: RequestInit = {}) => {
  const session = await getServerSession(authOptions);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (session?.accessToken && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  let body: string | undefined = undefined;
  if (options.body) {
    if (typeof options.body === "string") {
      body = options.body;
    } else {
      body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(`${process.env.API_URL}/api/admin/v1/${url}`, {
    ...options,
    headers,
    body,
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text, success: response.ok };
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || response.statusText);
  }

  return data;
};
