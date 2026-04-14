"use client";

import { DataTable } from "@/components/common/data-table";
import { customerAPI } from "@/lib/api/endpoints/customer";
import { Customer } from "@/lib/api/resource/customer";
import { useEffect, useState } from "react";
import { getCustomerColumns } from "./data/customer-columns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PaginationState } from "@tanstack/react-table";
import { normalizePaginationMeta, PaginationMeta } from "@/lib/api/pagination";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { success, error } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);

      const res = await customerAPI.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });

      if (res.success && res.data) {
        setCustomers(res.data);
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

    fetchCustomers();
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleDelete = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Delete customer with phone ${customer.phoneNumber}?`,
    );

    if (!confirmed) return;

    setDeletingId(customer.id);
    const res = await customerAPI.remove(customer.id);

    if (res.success) {
      setCustomers((prev) => prev.filter((item) => item.id !== customer.id));
      success("Customer deleted successfully");
    } else {
      error(res.error?.message ?? "Failed to delete customer");
    }

    setDeletingId(null);
  };

  const columns = getCustomerColumns({
    onDelete: handleDelete,
    deletingId,
  });

  return (
    <section className="grid gap-4 container">
      <div>
        <p className="font-bold">Customer</p>
        <p>Manage your customer information and roles</p>
      </div>
      <DataTable
        columns={columns}
        data={customers}
        filterSearchKey={["id", "phoneNumber", "address"]}
        onCreateRow={() => router.push("/customer/create")}
        manualPagination
        pageCount={pageCount}
        paginationState={pagination}
        onPaginationChange={setPagination}
      />
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
    </section>
  );
}
