"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import OrderStatusBadge from "@/components/orders/status-badge";
import { StatusBadgeProps } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ExternalLink } from "lucide-react";

// Define the type for delivery data with nested relationships
type DeliveryWithRelations = {
  id: string;
  status: StatusBadgeProps["status"]; // Use the status type from StatusBadgeProps
  createdAt: Date;
  pickupDate: Date | null;
  deliveryDate: Date | null;
  orderId: string;
  driverId: string | null;
  order: {
    id: string;
    deliveryAddress: string;
    crop: {
      name: string;
      location: string;
      farmer: {
        name: string;
        email: string;
      };
    };
    buyer: {
      name: string;
      email: string;
    };
  };
  driver: {
    name: string;
    email: string;
  } | null;
};

export const columns: ColumnDef<DeliveryWithRelations>[] = [
  {
    accessorKey: "id",
    header: "Delivery ID",
    cell: ({ row }) => (
      <div className="w-[100px] truncate font-medium">
        {row.original.id.slice(0, 8)}...
      </div>
    ),
  },
  {
    accessorKey: "order.crop.name",
    header: "Crop",
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate">
        {row.original.order.crop.name}
      </div>
    ),
  },
  {
    accessorKey: "order.crop.farmer.name",
    header: "Farmer",
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate">
        {row.original.order.crop.farmer.name}
      </div>
    ),
  },
  {
    accessorKey: "order.buyer.name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate">
        {row.original.order.buyer.name}
      </div>
    ),
  },
  {
    accessorKey: "driver.name",
    header: "Driver",
    cell: ({ row }) => (
      <div className="max-w-[120px] truncate">
        {row.original.driver?.name || "Not assigned"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const delivery = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/orders/${delivery.orderId}`}
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>View Order</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/admin/deliveries/${delivery.id}`}>
                Delivery Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
