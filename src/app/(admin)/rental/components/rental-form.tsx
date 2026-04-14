"use client";

import { SelectOptions } from "@/components/common/select-option";
import { AVAILABLE } from "@/constants/status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { customerAPI } from "@/lib/api/endpoints/customer";
import { rentalAPI } from "@/lib/api/endpoints/rental";
import { vehicleAPI } from "@/lib/api/endpoints/vehicle";
import { Options } from "@/lib/api/types";
import { CreateRentalInput, UpdateRentalInput } from "@/lib/schema/rental";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { calculateTotalDays } from "@/lib/date";

interface RentalFormValues {
  customerId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  returnDate: string;
  totalDay: string;
  price: string;
  penaltyFee: string;
  subtotal: string;
  notes: string;
  status: string;
  vehicleConditionStart: string;
  vehicleConditionEnd: string;
  mileageStart: string;
  mileageUsed: string;
  mileageEnd: string;
}

interface RentalFormProps {
  mode: "create" | "edit";
  rentalId?: number;
  initialValues?: Partial<RentalFormValues>;
}

interface VehicleOptionItem {
  id: number;
  name: string;
  dailyRate: number;
  mileage: number;
  condition: string;
}

export function RentalForm({ mode, rentalId, initialValues }: RentalFormProps) {
  const [formValues, setFormValues] = useState<RentalFormValues>({
    customerId: initialValues?.customerId ?? "",
    vehicleId: initialValues?.vehicleId ?? "",
    startDate: initialValues?.startDate ?? "",
    endDate: initialValues?.endDate ?? "",
    returnDate: initialValues?.returnDate ?? "",
    totalDay: initialValues?.totalDay ?? "",
    price: initialValues?.price ?? "",
    penaltyFee: initialValues?.penaltyFee ?? "",
    subtotal: initialValues?.subtotal ?? "",
    notes: initialValues?.notes ?? "",
    status: initialValues?.status ?? "",
    vehicleConditionStart: initialValues?.vehicleConditionStart ?? "",
    vehicleConditionEnd: initialValues?.vehicleConditionEnd ?? "",
    mileageStart: initialValues?.mileageStart ?? "",
    mileageUsed: initialValues?.mileageUsed ?? "",
    mileageEnd: initialValues?.mileageEnd ?? "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [customerOptions, setCustomerOptions] = useState<Options[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<Options[]>([]);
  const [vehicleOptionData, setVehicleOptionData] = useState<
    VehicleOptionItem[]
  >([]);
  const { success, error } = useToast();
  const router = useRouter();

  const title = useMemo(
    () => (mode === "create" ? "Create Rental" : "Update Rental"),
    [mode],
  );
  const backHref = mode === "create" ? "/rental" : `/rental/${rentalId}`;
  const submitLabel = mode === "create" ? "Create" : "Update";
  const totalDayValue = calculateTotalDays(
    formValues.startDate,
    formValues.endDate,
  );
  const subtotalValue = totalDayValue * Number(formValues.price || 0);

  const onChange = (field: keyof RentalFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const onVehicleChange = (value: string) => {
    const selectedVehicle = vehicleOptionData.find(
      (item) => String(item.id) === value,
    );

    setFormValues((prev) => ({
      ...prev,
      vehicleId: value,
      price: selectedVehicle ? String(selectedVehicle.dailyRate) : prev.price,
      mileageStart: selectedVehicle
        ? String(selectedVehicle.mileage)
        : prev.mileageStart,
      vehicleConditionStart: selectedVehicle
        ? selectedVehicle.condition
        : prev.vehicleConditionStart,
    }));
  };

  useEffect(() => {
    const fetchCustomerOptions = async () => {
      const res = await customerAPI.options();
      if (res.success && res.data) {
        const mappedOptions = res.data.map((item) => ({
          label: item.name,
          value: String(item.id),
        }));

        setCustomerOptions(mappedOptions);
      }
    };

    const fetchVehicleOptions = async () => {
      const res = await vehicleAPI.options(AVAILABLE);
      if (res.success && res.data) {
        setVehicleOptionData(res.data);

        const mappedOptions = res.data.map((item) => ({
          label: item.name,
          value: String(item.id),
        }));

        setVehicleOptions(mappedOptions);
      }
    };

    fetchCustomerOptions();
    fetchVehicleOptions();
  }, []);

  const buildPayload = (): CreateRentalInput => ({
    customerId: Number(formValues.customerId),
    vehicleId: Number(formValues.vehicleId),
    startDate: new Date(formValues.startDate),
    endDate: new Date(formValues.endDate),
    returnDate: formValues.returnDate
      ? new Date(formValues.returnDate)
      : undefined,
    totalDay: totalDayValue,
    price: Number(formValues.price),
    penaltyFee: Number(formValues.penaltyFee),
    subtotal: subtotalValue,
    notes: formValues.notes,
    status: formValues.status,
    vehicleConditionStart: formValues.vehicleConditionStart,
    vehicleConditionEnd: formValues.vehicleConditionEnd,
    mileageStart: Number(formValues.mileageStart),
    mileageUsed: Number(formValues.mileageUsed),
    mileageEnd: Number(formValues.mileageEnd),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "create") {
      const payload = buildPayload();
      const res = await rentalAPI.create(payload);
      if (res.success) {
        success("Rental created successfully");
        router.push("/rental");
      } else {
        error(res.error?.message ?? "Failed to create rental");
      }
      setSubmitting(false);
      return;
    }

    if (rentalId === undefined) {
      error("Rental ID is required for update");
      setSubmitting(false);
      return;
    }

    const payload: UpdateRentalInput = buildPayload();
    const res = await rentalAPI.update(rentalId, payload);
    if (res.success) {
      success("Rental updated successfully");
      router.push(`/rental/${rentalId}`);
    } else {
      error(res.error?.message ?? "Failed to update rental");
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
            <Label htmlFor="customerId">Customer</Label>
            <SelectOptions
              options={customerOptions}
              value={formValues.customerId}
              onChange={(value) => onChange("customerId", value as string)}
              placeholder="Select customer"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vehicleId">Vehicle</Label>
            <SelectOptions
              options={vehicleOptions}
              value={formValues.vehicleId}
              onChange={(value) => onVehicleChange(value as string)}
              placeholder="Select vehicle"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formValues.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              min={(() => {
                if (!formValues.startDate) return "";
                const start = new Date(formValues.startDate);
                start.setDate(start.getDate() + 1);
                return start.toISOString().split("T")[0];
              })()}
              value={formValues.endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="totalDay">Total Day</Label>
            <Input
              id="totalDay"
              disabled
              type="number"
              value={totalDayValue}
              onChange={(e) => onChange("totalDay", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              disabled
              value={formValues.price}
              onChange={(e) => onChange("price", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1">
          <div className="grid gap-2">
            <Label htmlFor="subtotal">Subtotal</Label>
            <Input
              id="subtotal"
              type="number"
              disabled
              value={subtotalValue}
              onChange={(e) => onChange("subtotal", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="vehicleConditionStart">
              Vehicle Condition Start
            </Label>
            <SelectOptions
              options={[
                { label: "Good", value: "good" },
                { label: "Broke", value: "broke" },
                { label: "Service", value: "service" },
              ]}
              value={formValues.vehicleConditionStart}
              onChange={(value) =>
                onChange("vehicleConditionStart", value as string)
              }
              placeholder="Select vehicleConditionStart"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mileageStart">Mileage Start</Label>
            <Input
              id="mileageStart"
              type="number"
              value={formValues.mileageStart}
              onChange={(e) => onChange("mileageStart", e.target.value)}
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
