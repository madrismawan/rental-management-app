"use client";

import { Button } from "@/components/ui/button";
import { customerAPI } from "@/lib/api/endpoints/customer";
import { Customer } from "@/lib/api/resource/customer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

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

      <div className="grid gap-3 rounded-lg border p-4 text-sm">
        <p>
          <span className="font-medium">ID:</span> {customer.id}
        </p>
        <p>
          <span className="font-medium">User ID:</span> {customer.userId}
        </p>
        <p>
          <span className="font-medium">Phone Number:</span>{" "}
          {customer.phoneNumber}
        </p>
        <p>
          <span className="font-medium">Address:</span> {customer.address}
        </p>
        <p>
          <span className="font-medium">Avatar:</span>{" "}
          <a
            href={customer.avatarUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            {customer.avatarUrl}
          </a>
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
    </section>
  );
}
