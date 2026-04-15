import {
  CompleteRentalInput,
  CreateRentalInput,
  UpdateRentalInput,
} from "@/lib/schema/rental";
import { apiClient } from "../client";
import { Rental } from "../resource/rental";

type RentalQuery = {
  page?: number;
  limit?: number;
};

type RentalOptionQuery = {
  status?: string;
};

const toQueryString = (query?: RentalQuery) => {
  if (!query) return "";

  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
};

const toOptionQueryString = (query?: RentalOptionQuery) => {
  if (!query) return "";

  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
};

export const rentalAPI = {
  getAll: async (query?: RentalQuery) => {
    return await apiClient.get<Rental[]>(`/rentals${toQueryString(query)}`);
  },

  getById: async (id: number) => {
    return await apiClient.get<Rental>(`/rentals/${id}`);
  },

  create: async (input: CreateRentalInput) => {
    return await apiClient.post<Rental>("/rentals", input);
  },

  update: async (id: number, input: UpdateRentalInput) => {
    return await apiClient.put<Rental>(`/rentals/${id}`, input);
  },

  remove: async (id: number) => {
    return await apiClient.delete<{ success: boolean }>(`/rentals/${id}`);
  },

  options: async (query?: RentalOptionQuery) => {
    return await apiClient.get<
      {
        id: number;
        name: string;
      }[]
    >(`/rentals/options${toOptionQueryString(query)}`);
  },

  cancel: async (id: number) => {
    return await apiClient.patch<{ success: boolean }>(`/rentals/${id}/cancel`);
  },

  approve: async (id: number) => {
    return await apiClient.patch<{ success: boolean }>(`/rentals/${id}/active`);
  },

  complete: async (id: number, input: CompleteRentalInput) => {
    return await apiClient.patch<{ success: boolean }>(
      `/rentals/${id}/complete`,
      input,
    );
  },
};
