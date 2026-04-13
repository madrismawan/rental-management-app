"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { vehicleAPI } from "@/lib/api/endpoints/vehicle";
import { Vehicle } from "@/lib/api/resource/vehicle";
import { VehicleForm } from "../../../vehicle/components/vehicle-form";

export default function VehicleEditPage() {
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
    <VehicleForm
      mode="edit"
      vehicleId={vehicle.id}
      initialValues={{
        plateNumber: vehicle.plateNumber,
        color: vehicle.color,
        brand: vehicle.brand,
        model: vehicle.model,
        cc: String(vehicle.cc),
        year: String(vehicle.year),
        mileage: String(vehicle.mileage),
        dailyRate: String(vehicle.dailyRate),
        status: vehicle.status,
        notes: vehicle.notes,
      }}
    />
  );
}
