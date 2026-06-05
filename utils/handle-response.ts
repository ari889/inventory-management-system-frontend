export const handleResponse = <T>(response: {
  success: boolean;
  status: number;
  message: string;
  data: T;
}) => {
  if (!response?.success) throw new Error(response?.message);
  return response;
};
