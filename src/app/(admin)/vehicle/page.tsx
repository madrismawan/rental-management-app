"use client";

import { DataTable } from "@/components/common/data-table";
import { vehicleAPI } from "@/lib/api/endpoints/vehicle";
import { Vehicle } from "@/lib/api/resource/vehicle";
import { useEffect, useState } from "react";
import { getVehicleColumns } from "./data/vehicle-columns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { success, error } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await vehicleAPI.getAll();
      if (res.success && res.data) {
        setVehicles(res.data);
      }
      setLoading(false);
    };

    fetchVehicles();
  }, []);

  const handleDelete = async (vehicle: Vehicle) => {
    const confirmed = window.confirm(`Delete vehicle ${vehicle.plateNumber}?`);
    if (!confirmed) return;

    setDeletingId(vehicle.id);
    const res = await vehicleAPI.remove(vehicle.id);

    if (res.success) {
      setVehicles((prev) => prev.filter((item) => item.id !== vehicle.id));
      success("Vehicle deleted successfully");
    } else {
      error(res.error?.message ?? "Failed to delete vehicle");
    }

    setDeletingId(null);
  };

  const columns = getVehicleColumns({ onDelete: handleDelete, deletingId });

  return (
    <section className="grid gap-4 container">
      <div>
        <p className="font-bold">Vehicle</p>
        <p>Manage vehicle data and status.</p>
      </div>
      <DataTable
        columns={columns}
        data={vehicles}
        filterSearchKey={["plateNumber", "brand", "model", "status"]}
        onCreateRow={() => router.push("/vehicle/create")}
      />
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
    </section>
  );
}
