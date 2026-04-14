"use client";

import { DataTable } from "@/components/common/data-table";
import { vehicleIncidentAPI } from "@/lib/api/endpoints/vehicle-incident";
import { VehicleIncident } from "@/lib/api/resource/vehicle-incident";
import { useEffect, useState } from "react";
import { getVehicleIncidentColumns } from "./data/vehicle-incident-columns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PaginationState } from "@tanstack/react-table";
import { normalizePaginationMeta, PaginationMeta } from "@/lib/api/pagination";

export default function VehicleIncidentPage() {
  const [incidents, setIncidents] = useState<VehicleIncident[]>([]);
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
    const fetchIncidents = async () => {
      setLoading(true);

      const res = await vehicleIncidentAPI.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });

      if (res.success && res.data) {
        setIncidents(res.data);
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

    fetchIncidents();
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleDelete = async (incident: VehicleIncident) => {
    const confirmed = window.confirm(
      `Delete incident #${incident.id} for vehicle ${incident.vehicleId}?`,
    );
    if (!confirmed) return;

    setDeletingId(incident.id);
    const res = await vehicleIncidentAPI.remove(incident.id);

    if (res.success) {
      setIncidents((prev) => prev.filter((item) => item.id !== incident.id));
      success("Vehicle incident deleted successfully");
    } else {
      error(res.error?.message ?? "Failed to delete vehicle incident");
    }

    setDeletingId(null);
  };

  const columns = getVehicleIncidentColumns({
    onDelete: handleDelete,
    deletingId,
  });

  return (
    <section className="grid gap-4 container">
      <div>
        <p className="font-bold">Vehicle Incident</p>
        <p>Manage vehicle incident records and penalties.</p>
      </div>
      <DataTable
        columns={columns}
        data={incidents}
        filterSearchKey={["id", "vehicleId", "incidentType", "status"]}
        onCreateRow={() => router.push("/vehicle-incident/create")}
        manualPagination
        pageCount={pageCount}
        paginationState={pagination}
        onPaginationChange={setPagination}
      />
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
    </section>
  );
}
