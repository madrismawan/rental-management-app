"use client";

import { Button } from "@/components/ui/button";
import { vehicleAPI } from "@/lib/api/endpoints/vehicle";
import { Vehicle } from "@/lib/api/resource/vehicle";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const formatDate = (value: Date | string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (Number.isNaN(id)) {
        setLoading(false);
        return;
      }

      const res = await vehicleAPI.getById(id);
      if (res.success && res.data) {
        setVehicle(res.data);
      }
      setLoading(false);
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground container">Loading...</p>
    );
  }

  if (!vehicle) {
    return (
      <p className="text-sm text-destructive container">Vehicle not found.</p>
    );
  }

  return (
    <section className="grid gap-4 container max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Vehicle Detail</p>
          <p className="text-muted-foreground text-sm">
            View vehicle information.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/vehicle">Back</Link>
          </Button>
          <Button asChild>
            <Link href={`/vehicle/${vehicle.id}/edit`}>Update</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border p-4 text-sm">
        <p>
          <span className="font-medium">ID:</span> {vehicle.id}
        </p>
        <p>
          <span className="font-medium">Plate Number:</span>{" "}
          {vehicle.plateNumber}
        </p>
        <p>
          <span className="font-medium">Brand:</span> {vehicle.brand}
        </p>
        <p>
          <span className="font-medium">Model:</span> {vehicle.model}
        </p>
        <p>
          <span className="font-medium">Color:</span> {vehicle.color}
        </p>
        <p>
          <span className="font-medium">CC:</span> {vehicle.cc}
        </p>
        <p>
          <span className="font-medium">Year:</span> {vehicle.year}
        </p>
        <p>
          <span className="font-medium">Mileage:</span> {vehicle.mileage}
        </p>
        <p>
          <span className="font-medium">Daily Rate:</span> {vehicle.dailyRate}
        </p>
        <p>
          <span className="font-medium">Status:</span> {vehicle.status}
        </p>
        <p>
          <span className="font-medium">Notes:</span> {vehicle.notes}
        </p>
        <p>
          <span className="font-medium">Created At:</span>{" "}
          {formatDate(vehicle.createdAt)}
        </p>
        <p>
          <span className="font-medium">Updated At:</span>{" "}
          {formatDate(vehicle.updatedAt)}
        </p>
      </div>
    </section>
  );
}
