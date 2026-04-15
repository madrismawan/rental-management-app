"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Vehicle } from "@/lib/api/resource/vehicle";
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
      const statusClassName =
        normalizedStatus === "available"
          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
          : normalizedStatus === "rented" || normalizedStatus === "rent"
            ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
            : normalizedStatus === "maintenance"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
              : normalizedStatus === "unavailable"
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
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
