"use client";

import { DataTable } from "@/components/common/data-table";
import { customerAPI } from "@/lib/api/endpoints/customer";
import { Customer } from "@/lib/api/resource/customer";
import { useEffect, useState } from "react";
import { getCustomerColumns } from "./data/customer-columns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { success, error } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await customerAPI.getAll();
      if (res.success && res.data) {
        setCustomers(res.data);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, []);

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
      />
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
    </section>
  );
}
