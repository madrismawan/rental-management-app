"use client";

import { DataTable } from "@/components/common/data-table";
import { Modal } from "@/components/common/modal";
import { rentalAPI } from "@/lib/api/endpoints/rental";
import { Rental } from "@/lib/api/resource/rental";
import { useEffect, useState } from "react";
import { getRentalColumns } from "./data/rental-columns";
import {
  CompleteFormValues,
  CompleteRentalForm,
} from "./components/complete-rental-form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PaginationState } from "@tanstack/react-table";
import { normalizePaginationMeta, PaginationMeta } from "@/lib/api/pagination";
import { modalConfirmation } from "@/components/common/modal-confirmation";
import { useCallback } from "react";
import { CompleteRentalInput } from "@/lib/schema/rental";

export default function RentalPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [completeForm, setCompleteForm] = useState<CompleteFormValues>({
    returnDate: "",
    vehicleConditionEnd: "",
    mileageEnd: undefined,
    hasIncident: false,
    incidentType: "",
    penaltyFee: undefined,
    description: "",
  });
  const [pageCount, setPageCount] = useState(1);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { success, error } = useToast();
  const router = useRouter();

  const fetchRentals = useCallback(async () => {
    setLoading(true);

    const res = await rentalAPI.getAll({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    });

    if (res.success && res.data) {
      setRentals(res.data);
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
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    const runFetchRentals = async () => {
      await fetchRentals();
    };

    runFetchRentals();
  }, [fetchRentals]);

  const handleCancel = (rental: Rental) => {
    modalConfirmation({
      title: "Cancel Rental",
      description: `Cancel rental #${rental.id}? This action cannot be undone.`,
      onConfirm: async () => {
        const res = await rentalAPI.cancel(rental.id);

        if (res.success) {
          await fetchRentals();
          success("Rental cancelled successfully");
        } else {
          error(res.error?.message ?? "Failed to cancel rental");
        }
      },
    });
  };

  const handleApprove = async (rental: Rental) => {
    const res = await rentalAPI.approve(rental.id);

    if (res.success) {
      await fetchRentals();
      success("Rental approved successfully");
    } else {
      error(res.error?.message ?? "Failed to approve rental");
    }
  };

  const handleOpenCompleteModal = (rental: Rental) => {
    setSelectedRental(rental);
    setCompleteForm({
      returnDate: new Date().toISOString().split("T")[0],
      vehicleConditionEnd: rental.vehicleConditionEnd ?? "",
      mileageEnd: rental.mileageEnd,
      hasIncident: false,
      incidentType: "",
      penaltyFee: undefined,
      description: "",
    });
    setIsCompleteModalOpen(true);
  };

  const handleCompleteSubmit = async (values: CompleteFormValues) => {
    if (!selectedRental) return;
    if (!values.returnDate) {
      error("Return date is required");
      return;
    }
    if (values.hasIncident) {
      if (!values.incidentType || !values.description) {
        error("Incident type and description are required");
        return;
      }
      if (!values.penaltyFee) {
        error("Penalty cost is required when incident exists");
        return;
      }
    }
    setCompletingId(selectedRental.id);

    const penaltyFee = values.hasIncident ? Number(values.penaltyFee) : 0;

    const completePayload: CompleteRentalInput = {
      returnDate: new Date(values.returnDate),
      penaltyFee,
      vehicleConditionEnd: values.vehicleConditionEnd || undefined,
      mileageEnd: values.mileageEnd,
      description: values.description || undefined,
      incidentType: values.incidentType || undefined,
    };

    const completeRes = await rentalAPI.complete(
      selectedRental.id,
      completePayload,
    );

    if (!completeRes.success) {
      error(completeRes.error?.message ?? "Failed to complete rental");
      setCompletingId(null);
      return;
    }
    await fetchRentals();
    setIsCompleteModalOpen(false);
    setSelectedRental(null);
    setCompletingId(null);
    success("Rental completed successfully");
  };

  const columns = getRentalColumns({
    onApprove: handleApprove,
    onCancel: handleCancel,
    onComplete: handleOpenCompleteModal,
  });

  return (
    <section className="grid gap-4 container">
      <div>
        <p className="font-bold">Rental</p>
        <p>View rental records and open detail pages.</p>
      </div>
      <DataTable
        columns={columns}
        data={rentals}
        filterSearchKey={["id", "customerId", "vehicleId", "status"]}
        onCreateRow={() => router.push("/rental/create")}
        manualPagination
        pageCount={pageCount}
        paginationState={pagination}
        onPaginationChange={setPagination}
      />
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

      <Modal
        title="Complete Rental"
        description="Fill return data and optional incident details"
        open={isCompleteModalOpen}
        onOpenChange={setIsCompleteModalOpen}
        size="lg"
      >
        <CompleteRentalForm
          initialValues={completeForm}
          submitting={
            selectedRental ? completingId === selectedRental.id : false
          }
          onClose={() => setIsCompleteModalOpen(false)}
          onSubmit={handleCompleteSubmit}
        />
      </Modal>
    </section>
  );
}
