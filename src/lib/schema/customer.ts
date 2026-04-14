import { z } from "zod";

export const createCustomerSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Customer email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  status: z.enum(["active", "inactive", "banned"]),
  phoneNumber: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(20, "Phone number must be at most 20 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  avatarUrl: z.string().url("Avatar URL must be a valid URL"),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
