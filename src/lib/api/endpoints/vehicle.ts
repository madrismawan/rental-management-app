import { CreateVehicleInput, UpdateVehicleInput } from "@/lib/schema/vehicle";
import { apiClient } from "../client";
import { Vehicle } from "../resource/vehicle";

export const vehicleAPI = {
  getAll: async () => {
    return await apiClient.get<Vehicle[]>(`/vehicles`);
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
