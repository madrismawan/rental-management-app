export interface CustomerLog {
  id: number;
  customerId: number;
  customerName: string;
  reason: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
