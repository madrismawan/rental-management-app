export interface Rental {
  id: number;
  customerId: number;
  vehicleId: number;
  startDate: Date;
  endDate: Date;
  totalDay: number;
  returnDate?: Date;
  price: number;
  penaltyFee: number;
  subtotal: number;
  notes: string;
  status: string;
  vehicleConditionStart: string;
  vehicleConditionEnd: string;
  mileageStart: number;
  mileageUsed: number;
  mileageEnd: number;
  createdAt: Date;
  updatedAt: Date;
}
