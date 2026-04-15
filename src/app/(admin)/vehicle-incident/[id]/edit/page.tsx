"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { vehicleIncidentAPI } from "@/lib/api/endpoints/vehicle-incident";
import { VehicleIncident } from "@/lib/api/resource/vehicle-incident";
import { VehicleIncidentForm } from "../../../vehicle-incident/components/vehicle-incident-form";

const toDateInput = (value: Date | string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export default function VehicleIncidentEditPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [incident, setIncident] = useState<VehicleIncident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      if (Number.isNaN(id)) {
        setLoading(false);
        return;
      }

      const res = await vehicleIncidentAPI.getById(id);
      if (res.success && res.data) {
        setIncident(res.data);
      }
      setLoading(false);
    };

    fetchIncident();
  }, [id]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground container">Loading...</p>
    );
  }

  if (!incident) {
    return (
      <p className="text-sm text-destructive container">
        Vehicle incident not found.
      </p>
    );
  }

  return (
    <VehicleIncidentForm
      mode="edit"
      incidentId={incident.id}
      initialValues={{
        vehicleId: String(incident.vehicleId),
        customerId: incident.customerId ? String(incident.customerId) : "",
        rentalId: incident.rentalId ? String(incident.rentalId) : "",
        incidentDate: toDateInput(incident.incidentDate),
        incidentType: incident.incidentType,
        description: incident.description,
        cost: String(incident.cost),
        status: incident.status,
      }}
    />
  );
}
