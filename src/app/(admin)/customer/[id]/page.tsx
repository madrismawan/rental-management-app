"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { customerAPI } from "@/lib/api/endpoints/customer";
import { customerLogAPI } from "@/lib/api/endpoints/customer-log";
import { Customer } from "@/lib/api/resource/customer";
import { CustomerLog } from "@/lib/api/resource/customer-log";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/date";
import { customerLogColumns } from "../data/customer-log-column";

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerLogs, setCustomerLogs] = useState<CustomerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await customerAPI.getById(id);
      if (res.success && res.data) {
        setCustomer(res.data);
      }
      setLoading(false);
    };

    fetchCustomer();
  }, [id]);

  useEffect(() => {
    const fetchCustomerLogs = async () => {
      setLogLoading(true);
      const res = await customerLogAPI.getAll({ customerId: id });
      if (res.success && res.data) {
        setCustomerLogs(res.data);
      } else {
        setCustomerLogs([]);
      }
      setLogLoading(false);
    };

    fetchCustomerLogs();
  }, [id]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground container">Loading...</p>
    );
  }

  if (!customer) {
    return (
      <p className="text-sm text-destructive container">Customer not found.</p>
    );
  }

  return (
    <section className="grid gap-4 container w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Customer Detail</p>
          <p className="text-muted-foreground text-sm">
            View customer information.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/customer">Back</Link>
          </Button>
          <Button asChild>
            <Link href={`/customer/${customer.id}/edit`}>Update</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-lg border p-4 text-sm">
        <div className="grid gap-3">
          <p>
            <span className="font-medium">ID:</span> {customer.id}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {customer.userId}
          </p>
          <p>
            <span className="font-medium">Name:</span> {customer.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {customer.email}
          </p>
          <p>
            <span className="font-medium">Phone Number:</span>{" "}
            {customer.phoneNumber}
          </p>
          <p>
            <span className="font-medium">Address:</span> {customer.address}
          </p>
          <p>
            <span className="font-medium">Created At:</span>{" "}
            {formatDate(customer.createdAt)}
          </p>
          <p>
            <span className="font-medium">Updated At:</span>{" "}
            {formatDate(customer.updatedAt)}
          </p>
        </div>
        <div>
          <p>
            <span className="font-medium">Avatar:</span>{" "}
            {customer.avatarUrl ? (
              <Image
                src={customer.avatarUrl}
                alt={customer.name}
                unoptimized
                width={50}
                height={50}
                className="h-52 w-auto rounded-md object-cover border"
              />
            ) : (
              <span className="text-muted-foreground text-xs">No image</span>
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border p-4">
        <div>
          <p className="font-semibold">Customer Log</p>
          <p className="text-sm text-muted-foreground">
            List of customer log entries for this customer.
          </p>
        </div>

        <DataTable
          columns={customerLogColumns}
          data={customerLogs}
          filterSearchKey={["id", "status", "reason"]}
        />

        {logLoading && (
          <p className="text-sm text-muted-foreground">
            Loading customer logs...
          </p>
        )}
      </div>
    </section>
  );
}
