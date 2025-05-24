import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Truck,
  Clock,
  CheckCircle,
  ArrowRight,
  Package,
  SendHorizonal,
  Bell,
} from "lucide-react";
import { getDriverStats } from "@/lib/actions/user.actions";
import { getRecentDeliveries } from "@/lib/actions/delivery.actions";
import OrderStatusBadge from "@/components/orders/status-badge";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function DriverDashboardPage() {
  const [stats, deliveries] = await Promise.all([
    getDriverStats(),
    getRecentDeliveries(),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8 p-2 sm:p-4 lg:p-6">
      {/* Header with welcome message - improved responsive layout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Driver Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back! Here's an overview of your delivery operations.
          </p>
        </div>
        <Button asChild className="mt-2 sm:mt-0 sm:self-start w-full sm:w-auto">
          <Link
            href="/dashboard/driver/deliveries/available"
            className="flex items-center justify-center gap-2"
          >
            <Package className="h-4 w-4" />
            Find Deliveries
          </Link>
        </Button>
      </div>

      {/* Stats Overview with responsive grid and adaptive sizing */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <CardTitle className="text-sm font-medium">
              Active Deliveries
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
              <Truck className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold text-blue-500">
              {stats.activeDeliveries}
            </div>
            <div className="flex items-center mt-1">
              <Badge
                variant={
                  stats.deliveriesChange >= 0 ? "default" : "destructive"
                }
                className="text-xs"
              >
                {stats.deliveriesChange >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(stats.deliveriesChange)}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                from last week
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <CardTitle className="text-sm font-medium">
              Pending Pickups
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold text-amber-500">
              {stats.pendingPickups}
            </div>
          </CardContent>
        </Card>{" "}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-950/50 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold text-green-500">
              {stats.completedToday}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center">
              <SendHorizonal className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="text-xl sm:text-2xl font-bold text-purple-500">
              {stats.pendingRequests || 0}
            </div>
            {stats.pendingRequests > 0 && (
              <div className="mt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <Link href="/dashboard/driver/delivery-requests">
                    View Requests
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Deliveries with responsive layout */}
      <Card className="border shadow-md">
        <CardHeader className="border-b bg-muted/30 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Recent Deliveries</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Your latest delivery assignments
                </CardDescription>
              </div>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 gap-1 self-start"
            >
              <Link
                href="/dashboard/driver/deliveries"
                className="flex items-center"
              >
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-4 sm:px-6">
          {deliveries.length === 0 ? (
            <div className="text-center py-8 sm:py-12 border border-dashed rounded-lg">
              <Truck className="h-10 sm:h-12 w-10 sm:w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-sm sm:text-base text-muted-foreground font-medium">
                No deliveries assigned yet
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4 w-full sm:w-auto"
              >
                <Link href="/dashboard/driver/deliveries/available">
                  Find available deliveries
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="border rounded-lg p-3 sm:p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                    <div>
                      <Link
                        href={`/orders/${delivery.order.id}`}
                        className="font-medium hover:underline text-primary text-sm sm:text-base"
                      >
                        Delivery #{delivery.id.slice(0, 8)}
                      </Link>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatDate(new Date(delivery.createdAt))}
                      </p>
                    </div>
                    <OrderStatusBadge status={delivery.status} />
                  </div>
                  <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-sm bg-muted/40 rounded-md p-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Crop
                      </p>
                      <p className="font-medium truncate">
                        {delivery.order.crop.name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Pickup Location
                      </p>
                      <p className="font-medium truncate">
                        {delivery.order.crop.location}
                      </p>
                    </div>
                    <div className="space-y-1 sm:col-span-2 md:col-span-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Delivery Address
                      </p>
                      <p className="font-medium truncate">
                        {delivery.order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
