import { z } from "zod";

export const customerSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
  userId: z.string().min(1, "User ID is required"),
  phoneNumber: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(20, "Phone number must be at most 20 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  avatarUrl: z.string().url("Avatar URL must be a valid URL"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createCustomerSchema = customerSchema.pick({
  userId: true,
  phoneNumber: true,
  address: true,
  avatarUrl: true,
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type Customer = z.infer<typeof customerSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
