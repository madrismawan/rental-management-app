"use client";

import { DataTable } from "@/components/common/data-table";
import { rentalAPI } from "@/lib/api/endpoints/rental";
import { Rental } from "@/lib/api/resource/rental";
import { useEffect, useState } from "react";
import { getRentalColumns } from "./data/rental-columns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PaginationState } from "@tanstack/react-table";
import { normalizePaginationMeta, PaginationMeta } from "@/lib/api/pagination";
import { modalConfirmation } from "@/components/common/modal-confirmation";
import { useCallback } from "react";

export default function RentalPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
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
        setCancelingId(rental.id);
        const res = await rentalAPI.cancel(rental.id);

        if (res.success) {
          await fetchRentals();
          success("Rental cancelled successfully");
        } else {
          error(res.error?.message ?? "Failed to cancel rental");
        }

        setCancelingId(null);
      },
    });
  };

  const columns = getRentalColumns({ onCancel: handleCancel, cancelingId });

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
    </section>
  );
}
