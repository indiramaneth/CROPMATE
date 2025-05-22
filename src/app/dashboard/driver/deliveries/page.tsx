import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDriverDeliveries } from "@/lib/actions/delivery.actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Package, Plus, Truck } from "lucide-react";

export default async function DriverDeliveriesPage() {
  const deliveries = await getDriverDeliveries({});

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Enhanced header section */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                My Deliveries
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and track your delivery assignments
              </p>
            </div>
          </div>
          <Button asChild className="gap-2 w-full sm:w-auto">
            <Link href="/dashboard/driver/deliveries/available">
              <Plus className="h-4 w-4" />
              <span className="whitespace-nowrap">Available Deliveries</span>
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-primary/10 shadow-md overflow-hidden">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg sm:text-xl">
            {deliveries.length > 0
              ? `${deliveries.length} Delivery Assignment${
                  deliveries.length === 1 ? "" : "s"
                }`
              : "No deliveries assigned"}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            View and manage your current delivery assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-2 sm:px-6">
          {deliveries.length === 0 ? (
            <div className="text-center py-8 sm:py-12 border border-dashed rounded-lg">
              <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground font-medium">
                No deliveries assigned yet
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Check available deliveries to start delivering
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4 w-full sm:w-auto"
              >
                <Link href="/dashboard/driver/deliveries/available">
                  Browse Available Deliveries
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={deliveries}
                searchKey="order.crop.name"
                filters={[
                  {
                    id: "status",
                    title: "Status",
                    options: [
                      { label: "Pending", value: "PENDING" },
                      { label: "Accepted", value: "ACCEPTED" },
                      { label: "Picked Up", value: "PICKED_UP" },
                      { label: "Completed", value: "COMPLETED" },
                    ],
                  },
                ]}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
