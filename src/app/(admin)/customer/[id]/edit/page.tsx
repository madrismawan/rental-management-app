"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { customerAPI } from "@/lib/api/endpoints/customer";
import { Customer } from "@/lib/api/resource/customer";
import { CustomerForm } from "@/app/(admin)/customer/components/customer-form";

export default function CustomerEditPage() {
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
    <CustomerForm
      mode="edit"
      customerId={customer.id}
      initialValues={{
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        status: customer.status,
        avatarUrl: customer.avatarUrl,
      }}
    />
  );
}
