import { cn } from "@/lib/utils";
import { StatusBadgeProps } from "@/types";

export default function OrderStatusBadge({
  status,
  className,
}: StatusBadgeProps) {
  const statusMap = {
    PENDING_PAYMENT: {
      label: "Pending Payment",
      color: "bg-yellow-100 text-yellow-800",
    },
    PAYMENT_RECEIVED: {
      label: "Payment Received",
      color: "bg-blue-100 text-blue-800",
    },
    READY_FOR_DELIVERY: {
      label: "Ready for Delivery",
      color: "bg-purple-100 text-purple-800",
    },
    IN_TRANSIT: {
      label: "In Transit",
      color: "bg-indigo-100 text-indigo-800",
    },
    DELIVERED: {
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    CANCELLED: {
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
    PENDING: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    ACCEPTED: {
      label: "Accepted",
      color: "bg-blue-100 text-blue-800",
    },
    PICKED_UP: {
      label: "Picked Up",
      color: "bg-indigo-100 text-indigo-800",
    },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusMap[status].color,
        className
      )}
    >
      {statusMap[status].label}
    </span>
  );
}
