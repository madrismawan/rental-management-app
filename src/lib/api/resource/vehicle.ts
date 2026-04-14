export interface Vehicle {
  id: number;
  plateNumber: string;
  color: string;
  brand: string;
  model: string;
  cc: number;
  year: number;
  mileage: number;
  dailyRate: number;
  condition: string;
  status: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
