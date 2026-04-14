import { z } from "zod";

export const vehicleSchema = z.object({
  id: z.number().int().positive("Vehicle ID must be a positive number"),
  plateNumber: z.string().min(1, "Plate number is required"),
  color: z.string().min(1, "Color is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  cc: z.number().int().positive("CC must be a positive number"),
  year: z.number().int().min(1900, "Year must be valid"),
  mileage: z.number().nonnegative("Mileage cannot be negative"),
  dailyRate: z.number().nonnegative("Daily rate cannot be negative"),
  condition: z.string().min(1, "Condition is required"),
  status: z.string().min(1, "Status is required"),
  notes: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createVehicleSchema = vehicleSchema.pick({
  plateNumber: true,
  color: true,
  brand: true,
  model: true,
  cc: true,
  year: true,
  mileage: true,
  dailyRate: true,
  condition: true,
  status: true,
  notes: true,
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type Vehicle = z.infer<typeof vehicleSchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
