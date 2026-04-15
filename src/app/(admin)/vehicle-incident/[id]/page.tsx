"use client";

import { Button } from "@/components/ui/button";
import { vehicleIncidentAPI } from "@/lib/api/endpoints/vehicle-incident";
import { VehicleIncident } from "@/lib/api/resource/vehicle-incident";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const formatDate = (value: Date | string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export default function VehicleIncidentDetailPage() {
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
    <section className="grid gap-4 container max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Vehicle Incident Detail</p>
          <p className="text-muted-foreground text-sm">
            View incident information.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/vehicle-incident">Back</Link>
          </Button>
          <Button asChild hidden={incident.status.toLowerCase() !== "open"}>
            <Link href={`/vehicle-incident/${incident.id}/edit`}>Update</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border p-4 text-sm">
        <p>
          <span className="font-medium">ID:</span> {incident.id}
        </p>
        <p>
          <span className="font-medium">Vehicle ID:</span> {incident.vehicleId}
        </p>
        <p>
          <span className="font-medium">Customer ID:</span>{" "}
          {incident.customerId ?? "-"}
        </p>
        <p>
          <span className="font-medium">Rental ID:</span>{" "}
          {incident.rentalId ?? "-"}
        </p>
        <p>
          <span className="font-medium">Incident Date:</span>{" "}
          {formatDate(incident.incidentDate)}
        </p>
        <p>
          <span className="font-medium">Incident Type:</span>{" "}
          {incident.incidentType}
        </p>
        <p>
          <span className="font-medium">Description:</span>{" "}
          {incident.description}
        </p>
        <p>
          <span className="font-medium">Cost:</span> {incident.cost}
        </p>
        <p>
          <span className="font-medium">Status:</span> {incident.status}
        </p>
        <p>
          <span className="font-medium">Created At:</span>{" "}
          {formatDate(incident.createdAt)}
        </p>
        <p>
          <span className="font-medium">Updated At:</span>{" "}
          {formatDate(incident.updatedAt)}
        </p>
      </div>
    </section>
  );
}
