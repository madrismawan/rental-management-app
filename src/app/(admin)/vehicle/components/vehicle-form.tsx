"use client";

import { SelectOptions } from "@/components/common/select-option";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AVAILABLE, RENT, UNAVAILABLE } from "@/constants/status";
import { useToast } from "@/hooks/use-toast";
import { vehicleAPI } from "@/lib/api/endpoints/vehicle";
import { CreateVehicleInput, UpdateVehicleInput } from "@/lib/schema/vehicle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface VehicleFormValues {
  plateNumber: string;
  color: string;
  brand: string;
  model: string;
  cc: string;
  year: string;
  mileage: string;
  dailyRate: string;
  status: string;
  notes: string;
}

interface VehicleFormProps {
  mode: "create" | "edit";
  vehicleId?: number;
  initialValues?: Partial<VehicleFormValues>;
}

export function VehicleForm({
  mode,
  vehicleId,
  initialValues,
}: VehicleFormProps) {
  const [formValues, setFormValues] = useState<VehicleFormValues>({
    plateNumber: initialValues?.plateNumber ?? "",
    color: initialValues?.color ?? "",
    brand: initialValues?.brand ?? "",
    model: initialValues?.model ?? "",
    cc: initialValues?.cc ?? "",
    year: initialValues?.year ?? "",
    mileage: initialValues?.mileage ?? "",
    dailyRate: initialValues?.dailyRate ?? "",
    status: initialValues?.status ?? "",
    notes: initialValues?.notes ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();
  const router = useRouter();

  const title = useMemo(
    () => (mode === "create" ? "Create Vehicle" : "Update Vehicle"),
    [mode],
  );
  const backHref = mode === "create" ? "/vehicle" : `/vehicle/${vehicleId}`;
  const submitLabel = mode === "create" ? "Create" : "Update";

  const onChange = (field: keyof VehicleFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = (): CreateVehicleInput => ({
    plateNumber: formValues.plateNumber,
    color: formValues.color,
    brand: formValues.brand,
    model: formValues.model,
    cc: Number(formValues.cc),
    year: Number(formValues.year),
    mileage: Number(formValues.mileage),
    dailyRate: Number(formValues.dailyRate),
    status: formValues.status,
    notes: formValues.notes,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "create") {
      const payload = buildPayload();
      const res = await vehicleAPI.create(payload);
      if (res.success) {
        success("Vehicle created successfully");
        router.push("/vehicle");
      } else {
        error(res.error?.message ?? "Failed to create vehicle");
      }
      setSubmitting(false);
      return;
    }

    if (vehicleId === undefined) {
      error("Vehicle ID is required for update");
      setSubmitting(false);
      return;
    }

    const payload: UpdateVehicleInput = buildPayload();
    const res = await vehicleAPI.update(vehicleId, payload);
    if (res.success) {
      success("Vehicle updated successfully");
      router.push(`/vehicle/${vehicleId}`);
    } else {
      error(res.error?.message ?? "Failed to update vehicle");
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
          <Label htmlFor="plateNumber">Plate Number</Label>
          <Input
            id="plateNumber"
            value={formValues.plateNumber}
            onChange={(e) => onChange("plateNumber", e.target.value)}
            placeholder="B 1234 XYZ"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formValues.brand}
              onChange={(e) => onChange("brand", e.target.value)}
              placeholder="Toyota"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formValues.model}
              onChange={(e) => onChange("model", e.target.value)}
              placeholder="Avanza"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              value={formValues.color}
              onChange={(e) => onChange("color", e.target.value)}
              placeholder="Black"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <SelectOptions
              options={[
                { label: "Available", value: AVAILABLE },
                { label: "Unavailable", value: UNAVAILABLE },
                { label: "Rent", value: RENT },
              ]}
              value={formValues.status}
              onChange={(value) => onChange("status", value as string)}
              placeholder="Select status"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              id="cc"
              type="number"
              value={formValues.cc}
              onChange={(e) => onChange("cc", e.target.value)}
              placeholder="1500"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={formValues.year}
              onChange={(e) => onChange("year", e.target.value)}
              placeholder="2023"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              type="number"
              value={formValues.mileage}
              onChange={(e) => onChange("mileage", e.target.value)}
              placeholder="12000"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dailyRate">Daily Rate</Label>
            <Input
              id="dailyRate"
              type="number"
              value={formValues.dailyRate}
              onChange={(e) => onChange("dailyRate", e.target.value)}
              placeholder="350000"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={formValues.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Vehicle notes"
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
