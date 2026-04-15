"use client";

import { ColumnDef } from "@tanstack/react-table";
import { VehicleIncident } from "@/lib/api/resource/vehicle-incident";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { formatDate } from "@/lib/date";

interface VehicleIncidentColumnOptions {
  onDelete: (incident: VehicleIncident) => void;
  deletingId?: number | null;
}

export const getVehicleIncidentColumns = ({
  onDelete,
  deletingId,
}: VehicleIncidentColumnOptions): ColumnDef<VehicleIncident>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "vehicleId",
    header: "Vehicle ID",
  },
  {
    accessorKey: "incidentType",
    header: "Incident Type",
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => row.original.cost.toLocaleString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const normalizedStatus = row.original.status.toLowerCase();
      const statusClassName =
        normalizedStatus === "open"
          ? "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
          : normalizedStatus === "in_progress"
            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
            : normalizedStatus === "resolved"
              ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
              : normalizedStatus === "closed"
                ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
                : "bg-muted text-muted-foreground border-border hover:bg-muted";

      return (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={`pointer-events-none h-7 rounded-full px-3 ${statusClassName}`}
        >
          {row.original.status}
        </Button>
      );
    },
  },
  {
    accessorKey: "incidentDate",
    header: "Incident Date",
    cell: ({ row }) => formatDate(row.original.incidentDate),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const incident = row.original;
      const isDeleting = deletingId === incident.id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem asChild>
              <Link href={`/vehicle-incident/${incident.id}`}>Detail</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/vehicle-incident/${incident.id}/edit`}>Update</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              disabled={isDeleting}
              onClick={() => onDelete(incident)}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
