"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BanendCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => Promise<void> | void;
  submitting?: boolean;
  title?: string;
  description?: string;
}

export function BanendCustomerModal({
  open,
  onOpenChange,
  onSubmit,
  submitting = false,
  title = "Banend Customer",
  description = "Input reason before creating customer banend log",
}: BanendCustomerModalProps) {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
      setReasonError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    const nextReason = reason.trim();
    if (!nextReason) {
      setReasonError("Reason is required");
      return;
    }

    setReasonError("");
    await onSubmit(nextReason);
  };

  return (
    <Modal
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="banend-reason">Reason</Label>
          <Textarea
            id="banend-reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (reasonError) setReasonError("");
            }}
            placeholder="Input reason"
            aria-invalid={!!reasonError}
          />
          {reasonError && (
            <p className="text-sm text-destructive">{reasonError}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
