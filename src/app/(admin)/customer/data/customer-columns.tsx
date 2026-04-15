"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/lib/api/resource/customer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { formatDate } from "@/lib/date";

interface CustomerColumnOptions {
  onDelete: (customer: Customer) => void;
  onBanend: (customer: Customer) => void;
  deletingId?: string | null;
}

export const getCustomerColumns = ({
  onDelete,
  onBanend,
  deletingId,
}: CustomerColumnOptions): ColumnDef<Customer>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
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
    cell: ({ row }) =>
      row.original.avatarUrl ? (
        <Image
          src={row.original.avatarUrl}
          alt={row.original.name}
          unoptimized
          width={40}
          height={40}
          className="h-10 w-10 rounded-md object-cover border"
        />
      ) : (
        <span className="text-muted-foreground text-xs">No image</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Join Date",
    cell: ({ row }) => formatDate(row.original.createdAt),
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
              hidden={customer.status.toLowerCase() === "banned"}
              onClick={() => onBanend(customer)}
            >
              Banend
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
