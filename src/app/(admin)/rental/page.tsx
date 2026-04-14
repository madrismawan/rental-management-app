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

export default function RentalPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
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
    const fetchRentals = async () => {
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
    };

    fetchRentals();
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleDelete = async (rental: Rental) => {
    const confirmed = window.confirm(`Delete rental #${rental.id}?`);
    if (!confirmed) return;

    setDeletingId(rental.id);
    const res = await rentalAPI.remove(rental.id);

    if (res.success) {
      setRentals((prev) => prev.filter((item) => item.id !== rental.id));
      success("Rental deleted successfully");
    } else {
      error(res.error?.message ?? "Failed to delete rental");
    }

    setDeletingId(null);
  };

  const columns = getRentalColumns({ onDelete: handleDelete, deletingId });

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
