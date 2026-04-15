"use client";

import { SelectOptions } from "@/components/common/select-option";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeRentalSchema, CompleteRentalInput } from "@/lib/schema/rental";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { z } from "zod";

const completeFormValidationSchema = completeRentalSchema.extend({
  hasIncident: z.boolean(),
});

export interface CompleteFormValues {
  returnDate: string;
  vehicleConditionEnd?: CompleteRentalInput["vehicleConditionEnd"];
  mileageEnd?: CompleteRentalInput["mileageEnd"];
  hasIncident: boolean;
  incidentType: NonNullable<CompleteRentalInput["incidentType"]>;
  penaltyFee?: CompleteRentalInput["penaltyFee"];
  description: NonNullable<CompleteRentalInput["description"]>;
}

interface CompleteRentalFormProps {
  initialValues: CompleteFormValues;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: CompleteFormValues) => void;
}

export function CompleteRentalForm({
  initialValues,
  submitting,
  onClose,
  onSubmit,
}: CompleteRentalFormProps) {
  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: ({ value }) => {
        const parsed = completeFormValidationSchema.safeParse(value);
        if (parsed.success) return undefined;
        return parsed.error.issues.map((issue) => issue.message).join(", ");
      },
    },
    onSubmit: async ({ value }) => {
      onSubmit(value as CompleteFormValues);
    },
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="returnDate">
        {(field) => {
          const error =
            field.state.meta.isTouched && !field.state.meta.isValid
              ? field.state.meta.errors
              : undefined;

          return (
            <div className="grid gap-2">
              <Label htmlFor="returnDate">Return Date</Label>
              <Input
                id="returnDate"
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={!!error}
              />
              {error && (
                <p className="text-sm text-destructive">{String(error[0])}</p>
              )}
            </div>
          );
        }}
      </form.Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field name="vehicleConditionEnd">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="vehicleConditionEnd">Return Condition</Label>
              <SelectOptions
                options={[
                  { label: "Good", value: "good" },
                  { label: "Broke", value: "broke" },
                  { label: "Service", value: "service" },
                ]}
                value={field.state.value}
                onChange={(value) => {
                  const next = (value as string) || "";
                  field.handleChange(next);
                  form.setFieldValue(
                    "hasIncident",
                    next === "broke" || next === "service",
                  );
                }}
                placeholder="Select condition"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="mileageEnd">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="mileageEnd">Mileage End</Label>
              <Input
                id="mileageEnd"
                type="number"
                value={field.state.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.handleChange(value ? Number(value) : undefined);
                }}
                placeholder="13000"
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="hasIncident">
        {(field) => (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
            />
            Has Incident
          </label>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.values.hasIncident}>
        {(hasIncident) =>
          hasIncident && (
            <div className="grid gap-4">
              <form.Field name="incidentType">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="incidentType">Incident Type</Label>
                    <SelectOptions
                      options={[
                        { label: "Accident", value: "accident" },
                        { label: "Damage", value: "damage" },
                        { label: "Theft", value: "theft" },
                        { label: "Other", value: "other" },
                      ]}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e as string)}
                      placeholder="Select Incident Type"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="penaltyFee">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="penaltyFee">Cost Penalty</Label>
                    <Input
                      id="penaltyFee"
                      type="number"
                      value={field.state.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.handleChange(value ? Number(value) : undefined);
                      }}
                      placeholder="500000"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Describe the incident"
                    />
                  </div>
                )}
              </form.Field>
            </div>
          )
        }
      </form.Subscribe>

      <div className="flex w-full justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button type="submit" disabled={!canSubmit || submitting}>
              {isSubmitting || submitting ? "Completing..." : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
