import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../../schema/customer";
import { apiClient } from "../client";
import { Customer } from "../resource/customer";

export const customerAPI = {
  getAll: async () => {
    return await apiClient.get<Customer[]>(`/customers`);
  },

  getById: async (id: string) => {
    return await apiClient.get<Customer>(`/customers/${id}`);
  },

  create: async (input: CreateCustomerInput) => {
    return await apiClient.post<Customer>("/customers", input);
  },

  update: async (id: string, input: UpdateCustomerInput) => {
    return await apiClient.put<Customer>(`/customers/${id}`, input);
  },

  remove: async (id: string) => {
    return await apiClient.delete<{ success: boolean }>(`/customers/${id}`);
  },
};
