"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { vehicleIncidentAPI } from "@/lib/api/endpoints/vehicle-incident";
import {
  CreateVehicleIncidentInput,
  UpdateVehicleIncidentInput,
} from "@/lib/schema/vehicle-incident";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface VehicleIncidentFormValues {
  vehicleId: string;
  customerId: string;
  rentalId: string;
  incidentDate: string;
  incidentType: string;
  description: string;
  penaltyFee: string;
  status: string;
}

interface VehicleIncidentFormProps {
  mode: "create" | "edit";
  incidentId?: number;
  initialValues?: Partial<VehicleIncidentFormValues>;
}

export function VehicleIncidentForm({
  mode,
  incidentId,
  initialValues,
}: VehicleIncidentFormProps) {
  const [formValues, setFormValues] = useState<VehicleIncidentFormValues>({
    vehicleId: initialValues?.vehicleId ?? "",
    customerId: initialValues?.customerId ?? "",
    rentalId: initialValues?.rentalId ?? "",
    incidentDate: initialValues?.incidentDate ?? "",
    incidentType: initialValues?.incidentType ?? "",
    description: initialValues?.description ?? "",
    penaltyFee: initialValues?.penaltyFee ?? "",
    status: initialValues?.status ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();
  const router = useRouter();

  const title = useMemo(
    () =>
      mode === "create" ? "Create Vehicle Incident" : "Update Vehicle Incident",
    [mode],
  );
  const backHref =
    mode === "create" ? "/vehicle-incident" : `/vehicle-incident/${incidentId}`;
  const submitLabel = mode === "create" ? "Create" : "Update";

  const onChange = (field: keyof VehicleIncidentFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = (): CreateVehicleIncidentInput => ({
    vehicleId: Number(formValues.vehicleId),
    customerId: formValues.customerId
      ? Number(formValues.customerId)
      : undefined,
    rentalId: formValues.rentalId ? Number(formValues.rentalId) : undefined,
    incidentDate: new Date(formValues.incidentDate),
    incidentType: formValues.incidentType,
    description: formValues.description,
    penaltyFee: Number(formValues.penaltyFee),
    status: formValues.status,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "create") {
      const payload = buildPayload();
      const res = await vehicleIncidentAPI.create(payload);
      if (res.success) {
        success("Vehicle incident created successfully");
        router.push("/vehicle-incident");
      } else {
        error(res.error?.message ?? "Failed to create vehicle incident");
      }
      setSubmitting(false);
      return;
    }

    if (incidentId === undefined) {
      error("Incident ID is required for update");
      setSubmitting(false);
      return;
    }

    const payload: UpdateVehicleIncidentInput = buildPayload();
    const res = await vehicleIncidentAPI.update(incidentId, payload);
    if (res.success) {
      success("Vehicle incident updated successfully");
      router.push(`/vehicle-incident/${incidentId}`);
    } else {
      error(res.error?.message ?? "Failed to update vehicle incident");
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="vehicleId">Vehicle ID</Label>
            <Input
              id="vehicleId"
              type="number"
              value={formValues.vehicleId}
              onChange={(e) => onChange("vehicleId", e.target.value)}
              placeholder="1"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="incidentDate">Incident Date</Label>
            <Input
              id="incidentDate"
              type="date"
              value={formValues.incidentDate}
              onChange={(e) => onChange("incidentDate", e.target.value)}
              placeholder="YYYY-MM-DD"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="customerId">Customer ID (Optional)</Label>
            <Input
              id="customerId"
              type="number"
              value={formValues.customerId}
              onChange={(e) => onChange("customerId", e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rentalId">Rental ID (Optional)</Label>
            <Input
              id="rentalId"
              type="number"
              value={formValues.rentalId}
              onChange={(e) => onChange("rentalId", e.target.value)}
              placeholder="1"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="incidentType">Incident Type</Label>
          <Input
            id="incidentType"
            value={formValues.incidentType}
            onChange={(e) => onChange("incidentType", e.target.value)}
            placeholder="Scratch"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formValues.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Describe the incident"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="penaltyFee">Penalty Fee</Label>
            <Input
              id="penaltyFee"
              type="number"
              value={formValues.penaltyFee}
              onChange={(e) => onChange("penaltyFee", e.target.value)}
              placeholder="500000"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={formValues.status}
              onChange={(e) => onChange("status", e.target.value)}
              placeholder="pending"
              required
            />
          </div>
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
