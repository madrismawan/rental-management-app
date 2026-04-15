"use client";

import { DataTable } from "@/components/common/data-table";
import { BanendCustomerModal } from "@/components/common/banend-customer-modal";
import { customerLogAPI } from "@/lib/api/endpoints/customer-log";
import { vehicleIncidentAPI } from "@/lib/api/endpoints/vehicle-incident";
import { VehicleIncident } from "@/lib/api/resource/vehicle-incident";
import { useEffect, useState } from "react";
import { getVehicleIncidentColumns } from "./data/vehicle-incident-columns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PaginationState } from "@tanstack/react-table";
import { normalizePaginationMeta, PaginationMeta } from "@/lib/api/pagination";
import { modalConfirmation } from "@/components/common/modal-confirmation";

export default function VehicleIncidentPage() {
  const [incidents, setIncidents] = useState<VehicleIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBanendModalOpen, setIsBanendModalOpen] = useState(false);
  const [selectedBanendIncident, setSelectedBanendIncident] =
    useState<VehicleIncident | null>(null);
  const [submittingBanend, setSubmittingBanend] = useState(false);
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

  const handleDelete = (incident: VehicleIncident) => {
    modalConfirmation({
      title: "Delete Vehicle Incident",
      description: `Delete incident #${incident.id} for vehicle ${incident.vehicleId}? This action cannot be undone.`,
      onConfirm: async () => {
        const res = await vehicleIncidentAPI.remove(incident.id);

        if (res.success) {
          setIncidents((prev) =>
            prev.filter((item) => item.id !== incident.id),
          );
          success("Vehicle incident deleted successfully");
        } else {
          error(res.error?.message ?? "Failed to delete vehicle incident");
        }
      },
    });
  };

  const handleProgress = async (incident: VehicleIncident) => {
    const res = await vehicleIncidentAPI.progress(incident.id);

    if (res.success) {
      setIncidents((prev) =>
        prev.map((item) =>
          item.id === incident.id
            ? {
                ...item,
                status: res.data?.status ?? "in_progress",
              }
            : item,
        ),
      );
      success("Vehicle incident moved to in progress");
    } else {
      error(res.error?.message ?? "Failed to progress vehicle incident");
    }
  };

  const handleResolve = async (incident: VehicleIncident) => {
    const res = await vehicleIncidentAPI.resolved(incident.id);

    if (res.success) {
      setIncidents((prev) =>
        prev.map((item) =>
          item.id === incident.id
            ? {
                ...item,
                status: res.data?.status ?? "resolved",
              }
            : item,
        ),
      );
      success("Vehicle incident resolved successfully");
    } else {
      error(res.error?.message ?? "Failed to resolve vehicle incident");
    }
  };

  const handleClose = async (incident: VehicleIncident) => {
    const res = await vehicleIncidentAPI.closed(incident.id);

    if (res.success) {
      setIncidents((prev) =>
        prev.map((item) =>
          item.id === incident.id
            ? {
                ...item,
                status: res.data?.status ?? "closed",
              }
            : item,
        ),
      );
      success("Vehicle incident closed successfully");
    } else {
      error(res.error?.message ?? "Failed to close vehicle incident");
    }
  };

  const handleOpenBanendModal = (incident: VehicleIncident) => {
    if (!incident.customerId) {
      error("Customer ID is required to create banend log");
      return;
    }

    setSelectedBanendIncident(incident);
    setIsBanendModalOpen(true);
  };

  const handleSubmitBanend = async (reason: string) => {
    if (!selectedBanendIncident?.customerId) {
      error("Customer ID is required to create banend log");
      return;
    }

    setSubmittingBanend(true);
    const res = await customerLogAPI.create({
      customerId: selectedBanendIncident.customerId,
      reason,
      status: "banend",
    });

    if (res.success) {
      success("Banend log created successfully");
      setIsBanendModalOpen(false);
      setSelectedBanendIncident(null);
    } else {
      error(res.error?.message ?? "Failed to create banend log");
    }

    setSubmittingBanend(false);
  };

  const columns = getVehicleIncidentColumns({
    onDelete: handleDelete,
    onProgress: handleProgress,
    onResolve: handleResolve,
    onClose: handleClose,
    onBanend: handleOpenBanendModal,
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

      <BanendCustomerModal
        open={isBanendModalOpen}
        onOpenChange={(open) => {
          setIsBanendModalOpen(open);
          if (!open) {
            setSelectedBanendIncident(null);
          }
        }}
        onSubmit={handleSubmitBanend}
        submitting={submittingBanend}
      />
    </section>
  );
}
