"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import OrderStatusBadge from "@/components/orders/status-badge";
import { Order } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const columns: ColumnDef<
  Order & {
    crop: {
      name: string;
      unit: string;
      farmerId: string;
      farmer: { name: string };
    };
  }
>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.id}`}
        className="font-medium hover:underline text-sm"
      >
        #{row.original.id.slice(0, 8)}
      </Link>
    ),
  },
  {
    accessorKey: "crop.name",
    header: "Crop",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate font-medium">
        {row.original.crop.name}
      </div>
    ),
  },
  {
    accessorKey: "crop.farmer.name",
    header: "Farmer",
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate">
        {row.original.crop.farmer.name}
      </div>
    ),
    enableHiding: true,
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm">
        {row.original.quantity} {row.original.crop.unit}
      </span>
    ),
    enableHiding: true,
    meta: {
      className: "hidden sm:table-cell",
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium">
        {formatCurrency(row.original.totalPrice)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    enableHiding: true,
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-500"
            asChild
          >
            <Link href={`/orders/${order.id}`} aria-label="View order details">
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
