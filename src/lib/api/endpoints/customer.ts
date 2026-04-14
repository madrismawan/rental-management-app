import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../../schema/customer";
import { apiClient } from "../client";
import { Customer } from "../resource/customer";

type CustomerQuery = {
  page?: number;
  limit?: number;
};

const toQueryString = (query?: CustomerQuery) => {
  if (!query) return "";

  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
};

export const customerAPI = {
  getAll: async (query?: CustomerQuery) => {
    return await apiClient.get<Customer[]>(`/customers${toQueryString(query)}`);
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
