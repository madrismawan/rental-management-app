"use client";

import { DataTable } from "@/components/common/data-table";
import { vehicleAPI } from "@/lib/api/endpoints/vehicle";
import { Vehicle } from "@/lib/api/resource/vehicle";
import { useEffect, useState } from "react";
import { getVehicleColumns } from "./data/vehicle-columns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PaginationState } from "@tanstack/react-table";
import { normalizePaginationMeta, PaginationMeta } from "@/lib/api/pagination";
import { modalConfirmation } from "@/components/common/modal-confirmation";

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { success, error } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);

      const res = await vehicleAPI.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });

      if (res.success && res.data) {
        setVehicles(res.data);
      }

      const { totalPages } = normalizePaginationMeta(
        (res.meta as PaginationMeta) ?? {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          total: 0,
          totalPages: 1,
        },
      );

      setPageCount(totalPages);

      if (pagination.pageIndex > totalPages - 1) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: Math.max(totalPages - 1, 0),
        }));
      }

      setLoading(false);
    };

    fetchVehicles();
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleCancel = (vehicle: Vehicle) => {
    modalConfirmation({
      title: "Cancel Vehicle",
      description: `Cancel vehicle ${vehicle.plateNumber}? This action cannot be undone.`,
      onConfirm: async () => {
        setDeletingId(vehicle.id);
        const res = await vehicleAPI.remove(vehicle.id);

        if (res.success) {
          setVehicles((prev) => prev.filter((item) => item.id !== vehicle.id));
          success("Vehicle deleted successfully");
        } else {
          error(res.error?.message ?? "Failed to delete vehicle");
        }

        setDeletingId(null);
      },
    });
  };

  const columns = getVehicleColumns({ onCancel: handleCancel, deletingId });

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
        manualPagination
        pageCount={pageCount}
        paginationState={pagination}
        onPaginationChange={setPagination}
      />
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
    </section>
  );
}
