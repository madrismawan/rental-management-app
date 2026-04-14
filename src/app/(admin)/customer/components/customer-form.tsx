"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { customerAPI } from "@/lib/api/endpoints/customer";
import Image from "next/image";
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
  const [avatarPreview, setAvatarPreview] = useState(
    initialValues?.avatarUrl ?? "",
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
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

  const onAvatarChange = (file?: File) => {
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const buildFormData = () => {
    const data = new FormData();

    data.append("id", formValues.id);
    data.append("name", formValues.name);
    data.append("email", formValues.email);

    if (formValues.password) {
      data.append("password", formValues.password);
    }

    data.append("phone_number", formValues.phoneNumber);
    data.append("address", formValues.address);

    if (avatarFile) {
      data.append("avatar", avatarFile);
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);

    if (mode === "create") {
      const payload = buildFormData();
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

    const payload = buildFormData();
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
          <Label htmlFor="avatar">Avatar</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => onAvatarChange(e.target.files?.[0])}
            required={mode === "create" && !formValues.avatarUrl}
          />
          {avatarPreview && (
            <Image
              src={avatarPreview}
              alt="Avatar preview"
              unoptimized
              width={80}
              height={80}
              className="h-20 w-20 rounded-md object-cover border"
            />
          )}
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
