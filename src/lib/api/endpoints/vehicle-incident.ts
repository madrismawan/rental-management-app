import {
  CreateVehicleIncidentInput,
  UpdateVehicleIncidentInput,
} from "@/lib/schema/vehicle-incident";
import { apiClient } from "../client";
import { VehicleIncident } from "../resource/vehicle-incident";

export const vehicleIncidentAPI = {
  getAll: async () => {
    return await apiClient.get<VehicleIncident[]>("/vehicle-incidents");
  },

  getById: async (id: number) => {
    return await apiClient.get<VehicleIncident>(`/vehicle-incidents/${id}`);
  },

  create: async (input: CreateVehicleIncidentInput) => {
    return await apiClient.post<VehicleIncident>("/vehicle-incidents", input);
  },

  update: async (id: number, input: UpdateVehicleIncidentInput) => {
    return await apiClient.put<VehicleIncident>(
      `/vehicle-incidents/${id}`,
      input,
    );
  },

  remove: async (id: number) => {
    return await apiClient.delete<{ success: boolean }>(
      `/vehicle-incidents/${id}`,
    );
  },
};
