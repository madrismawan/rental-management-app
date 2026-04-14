import {
  CreateVehicleIncidentInput,
  UpdateVehicleIncidentInput,
} from "@/lib/schema/vehicle-incident";
import { apiClient } from "../client";
import { VehicleIncident } from "../resource/vehicle-incident";

type VehicleIncidentQuery = {
  page?: number;
  limit?: number;
};

const toQueryString = (query?: VehicleIncidentQuery) => {
  if (!query) return "";

  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
};

export const vehicleIncidentAPI = {
  getAll: async (query?: VehicleIncidentQuery) => {
    return await apiClient.get<VehicleIncident[]>(
      `/vehicle-incidents${toQueryString(query)}`,
    );
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
