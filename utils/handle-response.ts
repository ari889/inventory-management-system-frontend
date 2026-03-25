import { redirect } from "next/navigation";

export const handleResponse = <T>(response: {
  success: boolean;
  status: number;
  message: string;
  data: T;
}) => {
  if (response?.status === 401) redirect("/admin/unauthorized");
  if (response?.status === 403) redirect("/admin/access-denied");
  if (!response?.success) throw new Error(response?.message);

  return response;
};
