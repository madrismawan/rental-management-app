export interface VehicleIncident {
  id: number;
  vehicleId: number;
  customerId?: number;
  rentalId?: number;
  incidentDate: Date;
  incidentType: string;
  description: string;
  penaltyFee: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
