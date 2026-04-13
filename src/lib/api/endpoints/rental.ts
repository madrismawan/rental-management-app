import { CreateRentalInput, UpdateRentalInput } from "@/lib/schema/rental";
import { apiClient } from "../client";
import { Rental } from "../resource/rental";

export const rentalAPI = {
  getAll: async () => {
    return await apiClient.get<Rental[]>(`/rentals`);
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
};
