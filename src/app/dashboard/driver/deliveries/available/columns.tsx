"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Delivery } from "@/app/generated/prisma";
import { toast } from "sonner";
import { SendHorizonal } from "lucide-react";
import { RequestFormModal } from "@/components/deliveries/request-form-modal";

export const columns: ColumnDef<
  Delivery & {
    order: {
      crop: { name: string; location: string };
      buyer: { name: string };
      deliveryAddress: string;
    };
  }
>[] = [
  {
    accessorKey: "order.crop.name",
    header: "Crop",
  },
  {
    accessorKey: "order.crop.location",
    header: "Pickup Location",
  },
  {
    accessorKey: "order.deliveryAddress",
    header: "Delivery Address",
  },
  {
    accessorKey: "order.buyer.name",
    header: "Customer",
  },
  {
    accessorKey: "createdAt",
    header: "Posted",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const delivery = row.original;
      const [isModalOpen, setIsModalOpen] = useState(false);

      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={() => setIsModalOpen(true)}
          >
            <SendHorizonal className="h-3 w-3" />
            Send Request
          </Button>

          <RequestFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            deliveryId={delivery.id}
            cropName={delivery.order.crop.name}
          />
        </div>
      );
    },
  },
];
