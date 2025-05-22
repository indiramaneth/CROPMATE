"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { deleteCrop } from "@/lib/actions/crop.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Crop } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface CropsTableProps {
  crops: Crop[];
}

const CropsTable = ({ crops }: CropsTableProps) => {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await deleteCrop(id);
      toast.success(`"${name}" deleted successfully`);
      router.refresh();
    } catch (error) {
      toast.error("Error deleting crop");
    }
  };

  const checkInventoryStatus = (quantity: number) => {
    if (quantity <= 0)
      return { label: "Out of stock", variant: "destructive" as const };
    if (quantity < 10)
      return { label: "Low stock", variant: "secondary" as const };
    return { label: "In stock", variant: "default" as const };
  };

  const columns: ColumnDef<Crop>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const crop = row.original;
        return (
          <div className="flex flex-col">
            <Link
              href={`/crops/${crop.id}`}
              className="font-medium hover:underline text-primary"
            >
              {crop.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              {crop.category}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "pricePerUnit",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("pricePerUnit"));
        return (
          <div className="font-medium">
            ${price.toFixed(2)}/{row.original.unit}
          </div>
        );
      },
    },
    {
      accessorKey: "availableQuantity",
      header: "Inventory",
      cell: ({ row }) => {
        const quantity = row.getValue("availableQuantity") as number;
        const status = checkInventoryStatus(quantity);

        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">
              {quantity} {row.original.unit}
            </span>
            <Badge variant={status.variant} className="w-fit">
              {status.label}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "harvestDate",
      header: "Harvest Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("harvestDate"));
        return <div className="font-medium">{formatDate(date)}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const crop = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/crops/${crop.id}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/farmer/crops/${crop.id}/edit`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive flex items-center gap-2 cursor-pointer"
                onClick={() => handleDelete(crop.id, crop.name)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={crops}
      searchKey="name"
      filters={[
        {
          id: "category",
          title: "Category",
          options: Array.from(new Set(crops.map((crop) => crop.category))).map(
            (category) => ({ label: category, value: category })
          ),
        },
      ]}
    />
  );
};

export default CropsTable;
