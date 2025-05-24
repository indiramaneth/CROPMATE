import OrderStatusBadge from "@/components/orders/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getCustomerOrders } from "@/lib/actions/order.actions";
import { getCustomerDeliveryRequests } from "@/lib/actions/delivery.actions";
import Link from "next/link";
import {
  ShoppingCart,
  Package,
  Clock,
  ArrowRight,
  Bell,
  Truck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function CustomerDashboardPage() {
  const [orders, deliveryRequests] = await Promise.all([
    getCustomerOrders({ take: 3 }),
    getCustomerDeliveryRequests(),
  ]);

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Enhanced header with welcome message */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            My Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Welcome back! Here's an overview of your recent activity.
          </p>
        </div>
        <Button asChild className="mt-2 sm:mt-0 sm:self-start gap-2">
          <Link href="/crops">
            <Package className="h-4 w-4" />
            Browse Crops
          </Link>
        </Button>
      </div>

      {/* Recent Orders Card with improved styling */}
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-2 md:pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg md:text-xl">
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Your latest purchases and their status
                </CardDescription>
              </div>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1 self-end sm:self-auto"
            >
              <Link href="/dashboard/customer/orders">
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          {orders.length === 0 ? (
            <div className="text-center py-8 md:py-12 border border-dashed rounded-lg">
              <ShoppingCart className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4 opacity-30" />
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                No orders yet
              </p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/crops">Start shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-3 md:p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <div className="space-y-1">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium hover:underline text-primary"
                      >
                        Order #{order.id.slice(0, 8)}
                      </Link>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Ordered {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="mt-3 flex flex-col sm:flex-row justify-between gap-2 sm:items-center bg-muted/50 rounded-md p-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.crop.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {order.quantity} {order.crop.unit}
                      </p>
                    </div>
                    <p className="text-base md:text-lg font-semibold text-primary">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>{" "}
      </Card>

      {/* Delivery Requests Card */}
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-2 md:pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg md:text-xl">
                  Delivery Requests
                </CardTitle>
                {deliveryRequests.length > 0 && (
                  <Badge variant="default" className="ml-2">
                    {deliveryRequests.length} new
                  </Badge>
                )}
              </div>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1 self-end sm:self-auto"
            >
              <Link href="/dashboard/customer/delivery-requests">
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          <CardDescription className="text-xs md:text-sm mt-1">
            Driver offers for your deliveries
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          {deliveryRequests.length === 0 ? (
            <div className="text-center py-8 md:py-12 border border-dashed rounded-lg">
              <Bell className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4 opacity-30" />
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                No delivery requests yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                When drivers send offers for your deliveries, they'll appear
                here
              </p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {deliveryRequests.slice(0, 2).map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-3 md:p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {request.delivery.order.crop.name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        From {request.driver.name}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="sm:self-start px-2 py-1"
                    >
                      ${request.customFee.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              ))}
              {deliveryRequests.length > 2 && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full text-center mt-2"
                >
                  <Link href="/dashboard/customer/delivery-requests">
                    View {deliveryRequests.length - 2} more requests
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
