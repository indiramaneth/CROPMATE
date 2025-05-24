import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAvailableDeliveries } from "@/lib/actions/delivery.actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { columns } from "./columns";
import { PackageSearch, ArrowLeft } from "lucide-react";

export default async function AvailableDeliveriesPage() {
  const deliveries = await getAvailableDeliveries();

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Responsive header with navigation and description */}
      <div className="space-y-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-fit flex items-center text-muted-foreground"
        >
          <Link href="/dashboard/driver/deliveries">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to my deliveries
          </Link>
        </Button>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <PackageSearch className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Available Deliveries
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Browse and accept available delivery requests in your area. Each
            delivery shows pickup and drop-off locations.
          </p>
        </div>
      </div>

      <Card className="border-primary/10 shadow-md overflow-hidden">
        <CardHeader className="pb-3 border-b px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-semibold">
            {deliveries.length > 0
              ? `${deliveries.length} Available ${
                  deliveries.length === 1 ? "Delivery" : "Deliveries"
                }`
              : "No deliveries available"}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Select a delivery to view details and accept the job
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6">
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={deliveries}
              searchKey="order.crop.name"
              filters={[
                {
                  id: "location",
                  title: "Pickup Location",
                  options: Array.from(
                    new Set(deliveries.map((d) => d.order.crop.location))
                  ).map((location) => ({ label: location, value: location })),
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {deliveries.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <PackageSearch className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-30" />
          <p className="text-muted-foreground font-medium text-sm sm:text-base">
            No deliveries available at the moment
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Check back later for new delivery opportunities
          </p>
        </div>
      )}
    </div>
  );
}
