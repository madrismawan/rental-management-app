export interface VehicleIncident {
  id: number;
  vehicleId: number;
  vehicleName: string;
  customerId?: number;
  rentalId?: number;
  incidentDate: Date;
  incidentType: string;
  description: string;
  cost: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
