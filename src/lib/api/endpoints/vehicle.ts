import { CreateVehicleInput, UpdateVehicleInput } from "@/lib/schema/vehicle";
import { apiClient } from "../client";
import { Vehicle } from "../resource/vehicle";

type VehicleQuery = {
  page?: number;
  limit?: number;
};

const toQueryString = (query?: VehicleQuery) => {
  if (!query) return "";

  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
};

export const vehicleAPI = {
  getAll: async (query?: VehicleQuery) => {
    return await apiClient.get<Vehicle[]>(`/vehicles${toQueryString(query)}`);
  },

  getById: async (id: number) => {
    return await apiClient.get<Vehicle>(`/vehicles/${id}`);
  },

  create: async (input: CreateVehicleInput) => {
    return await apiClient.post<Vehicle>("/vehicles", input);
  },

  update: async (id: number, input: UpdateVehicleInput) => {
    return await apiClient.put<Vehicle>(`/vehicles/${id}`, input);
  },

  remove: async (id: number) => {
    return await apiClient.delete<{ success: boolean }>(`/vehicles/${id}`);
  },
};
