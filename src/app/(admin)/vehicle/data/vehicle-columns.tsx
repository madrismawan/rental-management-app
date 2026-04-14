"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Vehicle } from "@/lib/api/resource/vehicle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";

const formatDate = (value: Date | string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

interface VehicleColumnOptions {
  onCancel: (vehicle: Vehicle) => void;
  deletingId?: number | null;
}

export const getVehicleColumns = ({
  onCancel,
  deletingId,
}: VehicleColumnOptions): ColumnDef<Vehicle>[] => [
  {
    accessorKey: "plateNumber",
    header: "Plate Number",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "dailyRate",
    header: "Daily Rate",
    cell: ({ row }) => row.original.dailyRate.toLocaleString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const normalizedStatus = row.original.status.toLowerCase();
      return (
        <Badge
          variant={
            normalizedStatus === "available"
              ? "default"
              : normalizedStatus === "rent"
                ? "outline"
                : "destructive"
          }
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const vehicle = row.original;
      const isDeleting = deletingId === vehicle.id;

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
              <Link href={`/vehicle/${vehicle.id}`}>Detail</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/vehicle/${vehicle.id}/edit`}>Update</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              disabled={isDeleting}
              onClick={() => onCancel(vehicle)}
            >
              {isDeleting ? "Cancelling..." : "Cancel"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
