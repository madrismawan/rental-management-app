"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { customerAPI } from "@/lib/api/endpoints/customer";
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/lib/schema/customer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface CustomerFormValues {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
}

interface CustomerFormProps {
  mode: "create" | "edit";
  customerId?: string;
  initialValues?: Partial<CustomerFormValues>;
}

export function CustomerForm({
  mode,
  customerId,
  initialValues,
}: CustomerFormProps) {
  const [formValues, setFormValues] = useState<CustomerFormValues>({
    id: initialValues?.id ?? "",
    name: initialValues?.name ?? "",
    email: initialValues?.email ?? "",
    password: initialValues?.password ?? "",
    phoneNumber: initialValues?.phoneNumber ?? "",
    address: initialValues?.address ?? "",
    avatarUrl: initialValues?.avatarUrl ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();
  const router = useRouter();

  const title = useMemo(
    () => (mode === "create" ? "Create Customer" : "Update Customer"),
    [mode],
  );
  const backHref = mode === "create" ? "/customer" : `/customer/${customerId}`;

  const submitLabel = mode === "create" ? "Create" : "Update";

  const onChange = (field: keyof CustomerFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);

    if (mode === "create") {
      const payload: CreateCustomerInput = {
        id: formValues.id,
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        phoneNumber: formValues.phoneNumber,
        address: formValues.address,
        avatarUrl: formValues.avatarUrl,
      };

      const res = await customerAPI.create(payload);
      if (res.success) {
        success("Customer created successfully");
        router.push("/customer");
      } else {
        error(res.error?.message ?? "Failed to create customer");
      }
      setSubmitting(false);
      return;
    }

    if (!customerId) {
      error("Customer ID is required for update");
      setSubmitting(false);
      return;
    }

    const payload: UpdateCustomerInput = {
      id: formValues.id,
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      phoneNumber: formValues.phoneNumber,
      address: formValues.address,
      avatarUrl: formValues.avatarUrl,
    };

    const res = await customerAPI.update(customerId, payload);
    if (res.success) {
      success("Customer updated successfully");
      router.push(`/customer/${customerId}`);
    } else {
      error(res.error?.message ?? "Failed to update customer");
    }

    setSubmitting(false);
  };

  return (
    <section className="grid gap-4 container w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-muted-foreground text-sm">
            Fill the form below and submit your changes.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={backHref}>Back</Link>
        </Button>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formValues.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formValues.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="customer@email.com"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formValues.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="Enter password"
            required={mode === "create"}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={formValues.phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formValues.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Enter address"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input
            id="avatarUrl"
            type="url"
            value={formValues.avatarUrl}
            onChange={(e) => onChange("avatarUrl", e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : submitLabel}
          </Button>
          <Button variant="outline" asChild>
            <Link href={backHref}>Cancel</Link>
          </Button>
        </div>
      </form>
    </section>
  );
}
