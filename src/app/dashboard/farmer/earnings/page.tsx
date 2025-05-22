import { getFarmerEarnings } from "@/lib/actions/earnings.actions";
import { formatCurrency, formatDate } from "@/lib/utils";
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
import {
  Calendar,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import OrderStatusBadge from "@/components/orders/status-badge";

export default async function FarmerEarningsPage() {
  const { orders, totalEarnings, monthlyEarnings, earningsByMonth } =
    await getFarmerEarnings();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-primary" />
          </span>
          My Earnings
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your sales and monitor your earnings
        </p>
      </div>

      {/* Earnings Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(totalEarnings)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime earnings from all orders
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month's Earnings
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(monthlyEarnings)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Earnings in{" "}
              {new Date().toLocaleString("default", { month: "long" })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Completed Orders
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-purple-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {orders.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Orders with payment received or delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Earnings</CardTitle>
          <CardDescription>
            Detailed breakdown of your earnings from orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>{order.crop.name}</TableCell>
                      <TableCell>
                        {order.quantity} {order.crop.unit}
                      </TableCell>
                      <TableCell>{order.buyer.name}</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.farmerPayment)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/farmer/orders/${order.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No earnings yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                You haven't received any payments yet. Earnings will appear here
                once customers purchase your crops.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
