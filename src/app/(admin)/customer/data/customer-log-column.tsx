import { CustomerLog } from "@/lib/api/resource/customer-log";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";

export const customerLogColumns: ColumnDef<CustomerLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.status}</span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="max-w-md whitespace-normal wrap-break-word">
        {row.original.reason || "-"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];
