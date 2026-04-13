import { LoginInput } from "@/lib/schema/auth";
import { apiClient } from "../client";
import { LoginResponse } from "../resource/auth";
import { signOut } from "@/lib/auth";

export const authAPI = {
  login: async (input: LoginInput) => {
    return await apiClient.post<LoginResponse>("/auth/login", input);
  },
  logout: async (): Promise<{ success: boolean }> => {
    await signOut({ redirect: true, callbackUrl: "/login" });
    return apiClient.post<{ success: boolean }>("/auth/logout");
  },
};
