"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Delivery } from "@/app/generated/prisma";
import OrderStatusBadge from "@/components/orders/status-badge";
import { toast } from "sonner";
import {
  acceptDelivery,
  completeDelivery,
  pickupDelivery,
} from "@/lib/actions/delivery.actions";

export const columns: ColumnDef<
  Delivery & {
    order: {
      crop: { name: string; location: string };
      deliveryAddress: string;
    };
  }
>[] = [
  {
    accessorKey: "id",
    header: "Delivery ID",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.orderId}`}
        className="font-medium hover:underline text-xs sm:text-sm"
      >
        #{row.original.id.slice(0, 8)}
      </Link>
    ),
  },
  {
    accessorKey: "order.crop.name",
    header: "Crop",
    cell: ({ row }) => (
      <div className="max-w-[100px] sm:max-w-full truncate">
        {row.original.order.crop.name}
      </div>
    ),
  },
  {
    accessorKey: "order.crop.location",
    header: "Pickup Location",
    cell: ({ row }) => (
      <div className="max-w-[100px] sm:max-w-full truncate">
        {row.original.order.crop.location}
      </div>
    ),
    enableHiding: true,
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "order.deliveryAddress",
    header: "Delivery Address",
    cell: ({ row }) => (
      <div className="max-w-[100px] sm:max-w-full truncate">
        {row.original.order.deliveryAddress}
      </div>
    ),
    enableHiding: true,
    meta: {
      className: "hidden md:table-cell",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-xs sm:text-sm">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    enableHiding: true,
    meta: {
      className: "hidden sm:table-cell",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const delivery = row.original;

      const handleAction = async (
        action: () => Promise<void>,
        successMessage: string
      ) => {
        try {
          await action();
          toast.success(successMessage);
          router.refresh();
        } catch (error) {
          toast.error("Failed to update delivery");
        }
      };

      return (
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
          {delivery.status === "PENDING" && (
            <Button
              size="sm"
              className="text-xs px-2 py-1 h-auto sm:h-8"
              onClick={() =>
                handleAction(
                  () => acceptDelivery(delivery.id),
                  "Delivery accepted successfully"
                )
              }
            >
              Accept
            </Button>
          )}
          {delivery.status === "ACCEPTED" && (
            <Button
              size="sm"
              className="text-xs px-2 py-1 h-auto sm:h-8"
              onClick={() =>
                handleAction(
                  () => pickupDelivery(delivery.id),
                  "Delivery marked as picked up"
                )
              }
            >
              Pick Up
            </Button>
          )}
          {delivery.status === "PICKED_UP" && (
            <Button
              size="sm"
              className="text-xs px-2 py-1 h-auto sm:h-8"
              onClick={() =>
                handleAction(
                  () => completeDelivery(delivery.id),
                  "Delivery marked as completed"
                )
              }
            >
              Deliver
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/orders/${delivery.orderId}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="#">View Pickup Location</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="md:hidden">
                <Link href="#">View Delivery Address</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
