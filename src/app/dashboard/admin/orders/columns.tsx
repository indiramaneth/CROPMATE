"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/app/generated/prisma";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import OrderStatusBadge from "@/components/orders/status-badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  markAsReadyForDelivery,
  cancelOrder,
} from "@/lib/actions/order.actions";

// Define the Order type with includes
type OrderWithRelations = Order & {
  crop: {
    name: string;
    unit: string;
    farmer: {
      name: string;
    };
  };
  buyer: {
    name: string;
    email: string;
  };
  delivery?: {
    status: string;
    driver?: {
      name: string;
      email: string;
    } | null;
  } | null;
};

export const columns: ColumnDef<OrderWithRelations>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.id}`}
        className="font-medium hover:underline text-sm text-primary"
      >
        #{row.original.id.slice(0, 8)}
      </Link>
    ),
  },
  {
    accessorKey: "buyer.name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        <span className="font-medium">{row.original.buyer.name}</span>
        <div className="text-xs text-muted-foreground truncate">
          {row.original.buyer.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "crop.name",
    header: "Crop",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">{row.original.crop.name}</div>
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
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm">
        {row.original.quantity} {row.original.crop.unit}
      </span>
    ),
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "delivery.driver.name",
    header: "Driver",
    cell: ({ row }) => {
      const delivery = row.original.delivery;
      if (!delivery || !delivery.driver) {
        return (
          <span className="text-muted-foreground text-xs">Not assigned</span>
        );
      }
      return <span>{delivery.driver.name}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const order = row.original;

      const handleAction = async (
        action: () => Promise<void>,
        successMessage: string
      ) => {
        try {
          await action();
          toast.success(successMessage);
          router.refresh();
        } catch (error: any) {
          toast.error(`Failed: ${error.message || "Unknown error"}`);
        }
      };

      return (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/orders/${order.id}`}>View Details</Link>
              </DropdownMenuItem>
              {order.status === "PAYMENT_RECEIVED" && (
                <DropdownMenuItem
                  onClick={() =>
                    handleAction(
                      () => markAsReadyForDelivery(order.id),
                      "Order marked as ready for delivery"
                    )
                  }
                >
                  Mark as Ready for Delivery
                </DropdownMenuItem>
              )}
              {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() =>
                    handleAction(
                      () => cancelOrder(order.id),
                      "Order has been cancelled"
                    )
                  }
                >
                  Cancel Order
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
