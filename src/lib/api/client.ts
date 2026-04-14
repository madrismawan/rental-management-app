import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { getSession } from "next-auth/react";
import config from "@/lib/config";
import { ApiResponse } from "./types";

export class ApiClient {
  constructor(private baseURL: string) {}

  private isFormDataBody(body: unknown): body is FormData {
    return typeof FormData !== "undefined" && body instanceof FormData;
  }

  private async safeJsonParse(res: Response) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  private async getAuthToken(): Promise<string> {
    try {
      const session = await getSession();
      return (
        (session as unknown as { accessToken?: string })?.accessToken ?? ""
      );
    } catch {
      return "";
    }
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = this.isFormDataBody(options.body);

    const config: RequestInit = {
      method: options.method || "GET",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      body: options.body,
      cache: "no-store",
    };

    try {
      const res = await fetch(url, config);
      const json = await this.safeJsonParse(res);

      if (!json) {
        return camelcaseKeys(
          {
            success: false,
            message: "Invalid response format",
            error: {
              code: "INVALID_JSON",
              message: "Server did not return valid JSON",
            },
          },
          { deep: true },
        );
      }

      if (!res.ok || json.success === false) {
        return camelcaseKeys(
          {
            ...json,
            success: false,
            error: json.error || {
              code: "HTTP_ERROR",
              message: json.message || "Request failed",
            },
          },
          { deep: true },
        );
      }

      return camelcaseKeys(
        {
          success: true,
          data: json.data,
          message: json.message,
          meta: json.meta,
        },
        { deep: true },
      );
    } catch {
      return camelcaseKeys(
        {
          success: false,
          message: "Network error",
          error: {
            code: "NETWORK_ERROR",
            message: "Failed to connect to server",
          },
          meta: { timestamp: new Date().toISOString() },
        },
        { deep: true },
      );
    }
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    const isFormData = this.isFormDataBody(data);

    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data
        ? isFormData
          ? data
          : JSON.stringify(snakecaseKeys(data, { deep: true }))
        : undefined,
    });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    const isFormData = this.isFormDataBody(data);

    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data
        ? isFormData
          ? data
          : JSON.stringify(snakecaseKeys(data, { deep: true }))
        : undefined,
    });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    const isFormData = this.isFormDataBody(data);

    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data
        ? isFormData
          ? data
          : JSON.stringify(snakecaseKeys(data, { deep: true }))
        : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(config.baseURL);
