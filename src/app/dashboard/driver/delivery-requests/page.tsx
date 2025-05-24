import { getDriverDeliveryRequests } from "@/lib/actions/delivery.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DriverRequestsList from "@/components/deliveries/driver-requests-list";

export default async function DriverDeliveryRequestsPage() {
  // Get all delivery requests made by this driver
  const requests = await getDriverDeliveryRequests().catch((error) => {
    console.error("Error fetching driver delivery requests:", error);
    notFound();
  });

  return (
    <div className="max-w-screen-xl mx-auto space-y-6 p-4">
      {/* Header with nav */}
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
              My Delivery Requests
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Track the status of delivery requests you've sent to customers
          </p>
        </div>
      </div>

      {/* Main content */}
      <Card className="border shadow-md">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg">Delivery Request History</CardTitle>
          <CardDescription>
            Overview of all your sent delivery requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <DriverRequestsList requests={requests} />
        </CardContent>
      </Card>
    </div>
  );
}
