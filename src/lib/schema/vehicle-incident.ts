import { z } from "zod";

export const vehicleIncidentSchema = z.object({
  id: z
    .number()
    .int()
    .positive("Vehicle incident ID must be a positive number"),
  vehicleId: z.number().int().positive("Vehicle ID is required"),
  customerId: z.number().int().positive().optional(),
  rentalId: z.number().int().positive().optional(),
  incidentDate: z.coerce.date(),
  incidentType: z.string().min(1, "Incident type is required"),
  description: z.string().min(1, "Description is required"),
  penaltyFee: z.number().nonnegative("Penalty fee cannot be negative"),
  status: z.string().min(1, "Status is required"),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createVehicleIncidentSchema = vehicleIncidentSchema.pick({
  vehicleId: true,
  customerId: true,
  rentalId: true,
  incidentDate: true,
  incidentType: true,
  description: true,
  penaltyFee: true,
  status: true,
});

export const updateVehicleIncidentSchema =
  createVehicleIncidentSchema.partial();

export type VehicleIncident = z.infer<typeof vehicleIncidentSchema>;
export type CreateVehicleIncidentInput = z.infer<
  typeof createVehicleIncidentSchema
>;
export type UpdateVehicleIncidentInput = z.infer<
  typeof updateVehicleIncidentSchema
>;
