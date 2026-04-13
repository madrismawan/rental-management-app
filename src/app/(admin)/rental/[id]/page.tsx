"use client";

import { Button } from "@/components/ui/button";
import { rentalAPI } from "@/lib/api/endpoints/rental";
import { Rental } from "@/lib/api/resource/rental";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const formatDate = (value: Date | string | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export default function RentalDetailPage() {
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
    <section className="grid gap-4 container max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Rental Detail</p>
          <p className="text-muted-foreground text-sm">
            View rental information.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/rental">Back</Link>
          </Button>
          <Button asChild>
            <Link href={`/rental/${rental.id}/edit`}>Update</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border p-4 text-sm">
        <p>
          <span className="font-medium">ID:</span> {rental.id}
        </p>
        <p>
          <span className="font-medium">Customer ID:</span> {rental.customerId}
        </p>
        <p>
          <span className="font-medium">Vehicle ID:</span> {rental.vehicleId}
        </p>
        <p>
          <span className="font-medium">Start Date:</span>{" "}
          {formatDate(rental.startDate)}
        </p>
        <p>
          <span className="font-medium">End Date:</span>{" "}
          {formatDate(rental.endDate)}
        </p>
        <p>
          <span className="font-medium">Return Date:</span>{" "}
          {formatDate(rental.returnDate)}
        </p>
        <p>
          <span className="font-medium">Total Day:</span> {rental.totalDay}
        </p>
        <p>
          <span className="font-medium">Price:</span> {rental.price}
        </p>
        <p>
          <span className="font-medium">Penalty Fee:</span> {rental.penaltyFee}
        </p>
        <p>
          <span className="font-medium">Subtotal:</span> {rental.subtotal}
        </p>
        <p>
          <span className="font-medium">Status:</span> {rental.status}
        </p>
        <p>
          <span className="font-medium">Vehicle Condition Start:</span>{" "}
          {rental.vehicleConditionStart}
        </p>
        <p>
          <span className="font-medium">Vehicle Condition End:</span>{" "}
          {rental.vehicleConditionEnd}
        </p>
        <p>
          <span className="font-medium">Mileage Start:</span>{" "}
          {rental.mileageStart}
        </p>
        <p>
          <span className="font-medium">Mileage Used:</span>{" "}
          {rental.mileageUsed}
        </p>
        <p>
          <span className="font-medium">Mileage End:</span> {rental.mileageEnd}
        </p>
        <p>
          <span className="font-medium">Notes:</span> {rental.notes}
        </p>
        <p>
          <span className="font-medium">Created At:</span>{" "}
          {formatDate(rental.createdAt)}
        </p>
        <p>
          <span className="font-medium">Updated At:</span>{" "}
          {formatDate(rental.updatedAt)}
        </p>
      </div>
    </section>
  );
}
