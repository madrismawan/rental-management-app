import { z } from "zod";

export const rentalSchema = z.object({
  id: z.number().int().positive("Rental ID must be a positive number"),
  customerId: z.number().int().positive("Customer ID is required"),
  vehicleId: z.number().int().positive("Vehicle ID is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  totalDay: z.number().int().positive("Total day must be a positive number"),
  returnDate: z.coerce.date().optional(),
  price: z.number().nonnegative("Price cannot be negative"),
  penaltyFee: z.number().nonnegative("Penalty fee cannot be negative"),
  subtotal: z.number().nonnegative("Subtotal cannot be negative"),
  notes: z.string(),
  status: z.string().min(1, "Status is required"),
  vehicleConditionStart: z
    .string()
    .min(1, "Vehicle condition at start is required"),
  vehicleConditionEnd: z
    .string()
    .min(1, "Vehicle condition at end is required"),
  mileageStart: z.number().nonnegative("Mileage start cannot be negative"),
  mileageUsed: z.number().nonnegative("Mileage used cannot be negative"),
  mileageEnd: z.number().nonnegative("Mileage end cannot be negative"),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createRentalSchema = rentalSchema.pick({
  customerId: true,
  vehicleId: true,
  startDate: true,
  endDate: true,
  totalDay: true,
  returnDate: true,
  price: true,
  penaltyFee: true,
  subtotal: true,
  notes: true,
  status: true,
  vehicleConditionStart: true,
  vehicleConditionEnd: true,
  mileageStart: true,
  mileageUsed: true,
  mileageEnd: true,
});

export const updateRentalSchema = createRentalSchema.partial();

export type Rental = z.infer<typeof rentalSchema>;
export type CreateRentalInput = z.infer<typeof createRentalSchema>;
export type UpdateRentalInput = z.infer<typeof updateRentalSchema>;
