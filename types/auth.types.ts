export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface MyJWT {
  [key: string]: unknown;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}
