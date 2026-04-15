"use client";

import { SelectOptions } from "@/components/common/select-option";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { customerAPI } from "@/lib/api/endpoints/customer";
import { rentalAPI } from "@/lib/api/endpoints/rental";
import { vehicleAPI } from "@/lib/api/endpoints/vehicle";
import { vehicleIncidentAPI } from "@/lib/api/endpoints/vehicle-incident";
import { Options } from "@/lib/api/types";
import {
  CreateVehicleIncidentInput,
  UpdateVehicleIncidentInput,
} from "@/lib/schema/vehicle-incident";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { COMPLETED } from "@/constants/status";

interface VehicleIncidentFormValues {
  vehicleId: string;
  customerId: string;
  rentalId: string;
  incidentDate: string;
  incidentType: string;
  description: string;
  cost: string;
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
    cost: initialValues?.cost ?? "",
    status: initialValues?.status ?? "",
  });
  const [vehicleOptions, setVehicleOptions] = useState<Options[]>([]);
  const [rentalOptions, setRentalOptions] = useState<Options[]>([]);
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

  useEffect(() => {
    const fetchOptions = async () => {
      const [vehicleRes, rentalRes] = await Promise.all([
        vehicleAPI.options(),
        rentalAPI.options({ status: COMPLETED }),
      ]);

      if (vehicleRes.success && vehicleRes.data) {
        setVehicleOptions(
          vehicleRes.data.map((item) => ({
            label: `${item.id} - ${item.name}`,
            value: String(item.id),
          })),
        );
      }

      if (rentalRes.success && rentalRes.data) {
        setRentalOptions(
          rentalRes.data.map((item) => ({
            label: item.name,
            value: String(item.id),
          })),
        );
      }
    };

    fetchOptions();
  }, []);

  const buildPayload = (): CreateVehicleIncidentInput => ({
    vehicleId: Number(formValues.vehicleId),
    customerId: formValues.customerId
      ? Number(formValues.customerId)
      : undefined,
    rentalId: formValues.rentalId ? Number(formValues.rentalId) : undefined,
    incidentDate: new Date(formValues.incidentDate),
    incidentType: formValues.incidentType,
    description: formValues.description,
    cost: Number(formValues.cost),
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
            <SelectOptions
              options={vehicleOptions}
              value={formValues.vehicleId}
              onChange={(value) =>
                onChange("vehicleId", (value as string) ?? "")
              }
              placeholder="Select vehicle"
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <div className="grid gap-2">
            <Label htmlFor="rentalId">Rental ID (Optional)</Label>
            <SelectOptions
              options={rentalOptions}
              value={formValues.rentalId}
              onChange={(value) =>
                onChange("rentalId", (value as string) ?? "")
              }
              placeholder="Select rental"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="incidentType">Incident Type</Label>
          <SelectOptions
            options={[
              { label: "Accident", value: "accident" },
              { label: "Damage", value: "damage" },
              { label: "Theft", value: "theft" },
              { label: "Other", value: "other" },
            ]}
            value={formValues.incidentType}
            onChange={(e) => onChange("incidentType", e as string)}
            placeholder="Select Incident Type"
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
          <div className="grid gap-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              value={formValues.cost}
              onChange={(e) => onChange("cost", e.target.value)}
              placeholder="500000"
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
