"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import OrderStatusBadge from "@/components/orders/status-badge";
import { Order } from "@/app/generated/prisma";
import { PaymentProofModal } from "@/components/orders/payment-proof-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StatusUpdate } from "@/components/orders/status-update";

export const columns: ColumnDef<
  Order & {
    crop: { name: string; unit: string };
    buyer: { name: string };
  }
>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.id}`}
        className="font-medium hover:underline"
      >
        #{row.original.id.slice(0, 8)}
      </Link>
    ),
  },
  {
    accessorKey: "buyer.name",
    header: "Customer",
  },
  {
    accessorKey: "crop.name",
    header: "Crop",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span>
        {row.original.quantity} {row.original.crop.unit}
      </span>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.original.totalPrice),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showPaymentProof, setShowPaymentProof] = useState(false);
      const order = row.original;

      return (
        <div className="flex items-center gap-2">
          {" "}
          {order.status === "PENDING_PAYMENT" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPaymentProof(true)}
              >
                Review Payment
              </Button>
              <PaymentProofModal
                orderId={order.id}
                paymentProof={order.paymentProof}
                farmerPayment={order.farmerPayment}
                totalPrice={order.totalPrice}
                open={showPaymentProof}
                onOpenChange={setShowPaymentProof}
              />
            </>
          )}
          <StatusUpdate orderId={order.id} currentStatus={order.status} />
        </div>
      );
    },
  },
];
