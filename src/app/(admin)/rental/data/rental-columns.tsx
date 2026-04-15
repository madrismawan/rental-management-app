"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Rental } from "@/lib/api/resource/rental";
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

interface RentalColumnOptions {
  onApprove: (rental: Rental) => void;
  onCancel: (rental: Rental) => void;
  onComplete: (rental: Rental) => void;
}

export const getRentalColumns = ({
  onApprove,
  onCancel,
  onComplete,
}: RentalColumnOptions): ColumnDef<Rental>[] => [
  {
    accessorKey: "noInvoice",
    header: "No Invoice",
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "vehicleName",
    header: "Vehicle",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.original.startDate),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => formatDate(row.original.endDate),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const normalizedStatus = row.original.status.toLowerCase();
      const statusClassName =
        normalizedStatus === "pending"
          ? "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
          : normalizedStatus === "active"
            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
            : normalizedStatus === "completed"
              ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
              : normalizedStatus === "cancelled"
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
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => row.original.subtotal.toLocaleString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const rental = row.original;
      const status = row.original.status.toLowerCase();

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
              <Link href={`/rental/${rental.id}`}>Detail</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              hidden={status !== "pending"}
              onClick={() => onApprove(rental)}
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              hidden={status !== "pending"}
              onClick={() => onCancel(rental)}
            >
              Cancel
            </DropdownMenuItem>
            <DropdownMenuItem
              hidden={status !== "active"}
              onClick={() => onComplete(rental)}
            >
              Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
