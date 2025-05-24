"use client";

import { formatDate, formatPrice } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DeliveryRequestWithRelations {
  id: string;
  deliveryId: string;
  customFee: number;
  message?: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
  delivery: {
    order: {
      crop: {
        name: string;
        location: string;
        // Allow other properties
        [key: string]: any;
      };
      deliveryAddress: string;
      buyer: {
        name: string;
        // Allow other properties
        [key: string]: any;
      };
      // Allow other properties
      [key: string]: any;
    };
    // Allow other properties
    [key: string]: any;
  };
}

interface DriverRequestsListProps {
  requests: DeliveryRequestWithRelations[];
}

export default function DriverRequestsList({
  requests,
}: DriverRequestsListProps) {
  // Group requests by status
  const pendingRequests = requests.filter((req) => req.status === "PENDING");
  const acceptedRequests = requests.filter((req) => req.status === "ACCEPTED");
  const rejectedRequests = requests.filter((req) => req.status === "REJECTED");

  if (requests.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg border-dashed">
        <p className="text-muted-foreground">
          You haven't sent any delivery requests yet
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Check the available deliveries to send offers to customers
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Pending Requests ({pendingRequests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {acceptedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Accepted Requests ({acceptedRequests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {rejectedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Rejected Requests ({rejectedRequests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rejectedRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RequestCard({ request }: { request: DeliveryRequestWithRelations }) {
  const statusColors = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
  };

  const statusLabels = {
    PENDING: "Pending Response",
    ACCEPTED: "Request Accepted",
    REJECTED: "Request Rejected",
  };

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {request.delivery.order.crop.name}
            </CardTitle>
            <CardDescription className="mt-1">
              From {request.delivery.order.crop.location}
            </CardDescription>
          </div>
          <Badge variant="secondary">{formatPrice(request.customFee)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              Customer
            </p>
            <p className="text-sm">{request.delivery.order.buyer.name}</p>
          </div>

          {request.message && (
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-sm italic">&quot;{request.message}&quot;</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-2">
            Request sent: {formatDate(request.createdAt)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <div
          className={`w-full text-center text-sm py-1 px-2 rounded-md ${
            statusColors[request.status]
          }`}
        >
          {statusLabels[request.status]}
        </div>
      </CardFooter>
    </Card>
  );
}
