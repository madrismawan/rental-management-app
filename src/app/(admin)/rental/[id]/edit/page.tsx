"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { rentalAPI } from "@/lib/api/endpoints/rental";
import { Rental } from "@/lib/api/resource/rental";
import { RentalForm } from "../../../rental/components/rental-form";

const toDateInput = (value: Date | string | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export default function RentalEditPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRental = async () => {
      if (Number.isNaN(id)) {
        setLoading(false);
        return;
      }

      const res = await rentalAPI.getById(id);
      if (res.success && res.data) {
        setRental(res.data);
      }
      setLoading(false);
    };

    fetchRental();
  }, [id]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground container">Loading...</p>
    );
  }

  if (!rental) {
    return (
      <p className="text-sm text-destructive container">Rental not found.</p>
    );
  }

  return (
    <RentalForm
      mode="edit"
      rentalId={rental.id}
      initialValues={{
        customerId: String(rental.customerId),
        vehicleId: String(rental.vehicleId),
        startDate: toDateInput(rental.startDate),
        endDate: toDateInput(rental.endDate),
        returnDate: toDateInput(rental.returnDate),
        totalDay: String(rental.totalDay),
        price: String(rental.price),
        penaltyFee: String(rental.penaltyFee),
        subtotal: String(rental.subtotal),
        notes: rental.notes,
        status: rental.status,
        vehicleConditionStart: rental.vehicleConditionStart,
        vehicleConditionEnd: rental.vehicleConditionEnd,
        mileageStart: String(rental.mileageStart),
        mileageUsed: String(rental.mileageUsed),
        mileageEnd: String(rental.mileageEnd),
      }}
    />
  );
}
