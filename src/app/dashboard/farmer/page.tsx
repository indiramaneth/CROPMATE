import { getFarmerStats } from "@/lib/actions/user.actions";
import { getRecentOrders } from "@/lib/actions/order.actions";
import { getRecentCrops } from "@/lib/actions/crop.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Truck,
  Crop,
  Plus,
  TrendingUp,
  ArrowRight,
  Leaf,
  Wallet,
} from "lucide-react";
import OrderStatusBadge from "@/components/orders/status-badge";
import CropStatusBadge from "@/components/crops/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function FarmerDashboardPage() {
  const [stats, orders, crops] = await Promise.all([
    getFarmerStats(),
    getRecentOrders(),
    getRecentCrops({ take: 4 }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header with greeting */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your farm business.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/crops" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Market</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
            <Link
              href="/dashboard/farmer/crops/new"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Crop</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview - Enhanced with colors and better alignment */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center">
              <Package className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.activeCrops}
            </div>
            <div className="flex items-center mt-1">
              <Badge
                variant={stats.cropsChange >= 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {stats.cropsChange >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(stats.cropsChange)}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {stats.pendingOrders}
            </div>
            <div className="flex items-center mt-1">
              <Badge
                variant={stats.ordersChange >= 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {stats.ordersChange >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(stats.ordersChange)}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>{" "}
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${stats.allTimeRevenue}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime earnings from all orders
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
            <div className="h-9 w-9 rounded-full bg-purple-50 flex items-center justify-center">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
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
                from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid: Split Recent Orders and Crops side by side on larger screens */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border shadow-md">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-amber-600" />
                <CardTitle>Recent Orders</CardTitle>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                <Link href="/dashboard/farmer/orders">
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              Recent customer orders for your products
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {orders.length === 0 ? (
              <div className="text-center py-10 border border-dashed rounded-lg">
                <ShoppingCart className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground font-medium">
                  No orders yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Orders will appear here when customers place them
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <Link
                          href={`/orders/${order.id}`}
                          className="font-medium hover:underline text-primary"
                        >
                          Order #{order.id.slice(0, 8)}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Customer
                        </p>
                        <p className="font-medium">{order.buyer.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Crop
                        </p>
                        <p className="font-medium">{order.crop.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total
                        </p>
                        <p className="font-medium text-blue-600">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Crops */}
        <Card className="border shadow-md">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                <CardTitle>Your Crops</CardTitle>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-8 gap-1">
                <Link href="/dashboard/farmer/crops">
                  <span>Manage Crops</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              Your active crop listings in the marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {crops.length === 0 ? (
              <div className="text-center py-10 border border-dashed rounded-lg">
                <Leaf className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground font-medium">
                  You haven't listed any crops yet
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link
                    href="/dashboard/farmer/crops/new"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add your first crop</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                {crops.map((crop) => (
                  <div
                    key={crop.id}
                    className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          href={`/crops/${crop.id}`}
                          className="font-medium hover:underline text-primary"
                        >
                          {crop.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {crop.availableQuantity} {crop.unit} available
                          </span>
                          <CropStatusBadge
                            available={crop.availableQuantity}
                            unit={crop.unit}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-muted/40 rounded-md p-3">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Price
                        </p>
                        <p className="font-medium text-blue-600">
                          ${crop.pricePerUnit}/{crop.unit}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Harvest Date
                        </p>
                        <p className="font-medium">
                          {formatDate(new Date(crop.harvestDate))}
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
    </div>
  );
}
