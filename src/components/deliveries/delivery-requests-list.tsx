"use client";

import { useState } from "react";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  acceptDeliveryRequest,
  rejectDeliveryRequest,
} from "@/lib/actions/delivery.actions";
import { useRouter } from "next/navigation";
import { Loader2, UserCircle2 } from "lucide-react";

interface DeliveryRequestWithRelations {
  id: string;
  deliveryId: string;
  driverId: string;
  customFee: number;
  message?: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
  driver: {
    name: string;
    email: string;
  };
  delivery: {
    order: {
      crop: {
        name: string;
        location: string;
      };
    };
  };
}

interface DeliveryRequestsListProps {
  requests: DeliveryRequestWithRelations[];
}

export default function DeliveryRequestsList({
  requests,
}: DeliveryRequestsListProps) {
  return (
    <div className="space-y-6">
      {requests.length === 0 ? (
        <div className="text-center py-10 border rounded-lg border-dashed">
          <p className="text-muted-foreground">
            No delivery requests available at the moment
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            When drivers send requests for your deliveries, they will appear
            here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}

function RequestCard({ request }: { request: DeliveryRequestWithRelations }) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptDeliveryRequest(request.id);
      toast.success("Driver request accepted", {
        description: "Your delivery has been assigned to the driver",
      });
      router.refresh();
    } catch (error) {
      toast.error("Failed to accept request", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await rejectDeliveryRequest(request.id);
      toast.success("Driver request rejected");
      router.refresh();
    } catch (error) {
      toast.error("Failed to reject request");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {request.delivery.order.crop.name} Delivery
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
          <div className="flex items-center gap-2">
            <UserCircle2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{request.driver.name}</p>
              <p className="text-xs text-muted-foreground">
                {request.driver.email}
              </p>
            </div>
          </div>
          {request.message && (
            <div className="bg-muted/50 rounded-md p-3 mt-2">
              <p className="text-sm italic">&quot;{request.message}&quot;</p>
            </div>
          )}
          <div className="text-xs text-muted-foreground pt-2">
            Request sent: {formatDate(request.createdAt)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleReject}
          disabled={isRejecting || isAccepting}
        >
          {isRejecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Reject"
          )}
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={handleAccept}
          disabled={isRejecting || isAccepting}
        >
          {isAccepting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Accept Offer"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
