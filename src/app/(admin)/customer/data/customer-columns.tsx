"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/lib/api/resource/customer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

interface CustomerColumnOptions {
  onDelete: (customer: Customer) => void;
  deletingId?: string | null;
}

export const getCustomerColumns = ({
  onDelete,
  deletingId,
}: CustomerColumnOptions): ColumnDef<Customer>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <span className="block max-w-xs truncate" title={row.original.address}>
        {row.original.address}
      </span>
    ),
  },
  {
    accessorKey: "avatarUrl",
    header: "Avatar",
    cell: ({ row }) => (
      <a
        href={row.original.avatarUrl}
        target="_blank"
        rel="noreferrer"
        className="text-primary hover:underline"
      >
        View
      </a>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => formatDate(row.original.updatedAt),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const customer = row.original;
      const isDeleting = deletingId === customer.id;

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
              <Link href={`/customer/${customer.id}`}>Detail</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/customer/${customer.id}/edit`}>Update</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              disabled={isDeleting}
              onClick={() => onDelete(customer)}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
