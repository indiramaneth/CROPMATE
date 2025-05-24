import { getCustomerDeliveryRequests } from "@/lib/actions/delivery.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MoveLeft, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DeliveryRequestsList from "@/components/deliveries/delivery-requests-list";

export default async function CustomerDeliveryRequestsPage() {
  // Get all delivery requests for this customer
  const requests = await getCustomerDeliveryRequests().catch((error) => {
    console.error("Error fetching delivery requests:", error);
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
          <Link href="/dashboard/customer">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to dashboard
          </Link>
        </Button>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <PackageSearch className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Delivery Requests
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Review and accept delivery requests from drivers
          </p>
        </div>
      </div>

      {/* Main content */}
      <Card className="border shadow-md">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg">
            {requests.length > 0
              ? `${requests.length} Pending ${
                  requests.length === 1 ? "Request" : "Requests"
                }`
              : "No Pending Requests"}
          </CardTitle>
          <CardDescription>
            {requests.length > 0
              ? "Select a driver to deliver your order"
              : "When drivers send offers, they will appear here"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <DeliveryRequestsList requests={requests} />
        </CardContent>
      </Card>
    </div>
  );
}
