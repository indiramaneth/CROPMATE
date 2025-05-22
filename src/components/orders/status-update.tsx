// components/orders/status-update.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  markAsReadyForDelivery,
  cancelOrder,
} from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface StatusUpdateProps {
  orderId: string;
  currentStatus: string;
}

export function StatusUpdate({ orderId, currentStatus }: StatusUpdateProps) {
  const router = useRouter();

  const handleAction = async (
    action: () => Promise<void>,
    successMessage: string
  ) => {
    try {
      await action();
      toast.success(successMessage);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentStatus === "PAYMENT_RECEIVED" && (
          <DropdownMenuItem
            onClick={() =>
              handleAction(
                () => markAsReadyForDelivery(orderId),
                "Order marked as ready for delivery"
              )
            }
          >
            Mark as Ready for Delivery
          </DropdownMenuItem>
        )}
        {currentStatus !== "CANCELLED" && currentStatus !== "DELIVERED" && (
          <DropdownMenuItem
            className="text-red-600"
            onClick={() =>
              handleAction(
                () => cancelOrder(orderId),
                "Order has been cancelled"
              )
            }
          >
            Cancel Order
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
