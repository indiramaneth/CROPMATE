import { getAllCrops } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Leaf, Search, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/crops/status-badge";
import CropActions from "@/components/dashboard/admin/crop-actions";

export default async function AdminCropsPage() {
  const crops = await getAllCrops();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Crop Management</h2>
          <p className="text-muted-foreground">
            Manage all crops in the marketplace
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-primary" />
              All Crops
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
          <CardDescription>
            Total: {crops.length} crops in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crops.map((crop) => {
                  const inventoryStatus = checkInventoryStatus(
                    crop.availableQuantity
                  );
                  // Check if crop has any active orders by looking at the orders property
                  const hasActiveOrders =
                    crop.orders &&
                    crop.orders.some(
                      (order) =>
                        !["DELIVERED", "CANCELLED"].includes(order.status)
                    );

                  return (
                    <TableRow key={crop.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden relative">
                            <Image
                              src={crop.imageUrl || "/placeholder-crop.jpg"}
                              alt={crop.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{crop.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ID: {crop.id.substring(0, 8)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{crop.farmer.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {crop.farmer.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {crop.category.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(crop.pricePerUnit)} / {crop.unit}
                      </TableCell>
                      <TableCell>
                        {crop.availableQuantity} {crop.unit}
                      </TableCell>
                      <TableCell>{formatDate(crop.createdAt)}</TableCell>
                      <TableCell>
                        <StatusBadge variant={inventoryStatus.variant}>
                          {inventoryStatus.label}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <CropActions
                          cropId={crop.id}
                          cropName={crop.name}
                          hasActiveOrders={hasActiveOrders}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function checkInventoryStatus(quantity: number) {
  if (quantity <= 0)
    return { label: "Out of stock", variant: "destructive" as const };
  if (quantity < 10) return { label: "Low stock", variant: "warning" as const };
  return { label: "In stock", variant: "default" as const };
}
