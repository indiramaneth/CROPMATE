"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Delivery } from "@/app/generated/prisma";
import { acceptDelivery } from "@/lib/actions/delivery.actions";
import { toast } from "sonner";

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

      const handleAccept = async () => {
        try {
          await acceptDelivery(delivery.id);
          toast.success("Delivery accepted", {
            description: "You can now proceed to pick up the order",
          });
          router.push("/dashboard/driver/deliveries");
        } catch (error) {
          toast.error("Failed to accept delivery", {
            description: "An error occurred while accepting the delivery",
          });
        }
      };

      return <Button onClick={handleAccept}>Accept Delivery</Button>;
    },
  },
];
