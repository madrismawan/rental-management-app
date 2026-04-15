import { apiClient } from "../client";
import { CustomerLog } from "../resource/customer-log";

type CustomerLogQuery = {
  customerId?: number | string;
};

export interface CreateCustomerLogInput {
  customerId: number | string;
  reason: string;
  status: string;
}

const toQueryString = (query?: CustomerLogQuery) => {
  if (!query) return "";

  const params = new URLSearchParams();
  if (query.customerId !== undefined) {
    params.set("customer_id", String(query.customerId));
  }

  const parsed = params.toString();
  return parsed ? `?${parsed}` : "";
};

export const customerLogAPI = {
  getAll: async (query?: CustomerLogQuery) => {
    return await apiClient.get<CustomerLog[]>(
      `/customer-logs${toQueryString(query)}`,
    );
  },

  create: async (input: CreateCustomerLogInput) => {
    return await apiClient.post<CustomerLog>("/customer-logs", input);
  },
};
