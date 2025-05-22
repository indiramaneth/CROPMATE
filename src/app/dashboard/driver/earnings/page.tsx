import { getDriverEarnings } from "@/lib/actions/driver-earnings.actions";
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
  Truck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function DriverEarningsPage() {
  const { deliveries, totalEarnings, monthlyEarnings, earningsByMonth } =
    await getDriverEarnings();

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
          Track your deliveries and monitor your earnings
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
              Lifetime earnings from all completed deliveries
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
              Total Completed Deliveries
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-purple-50 flex items-center justify-center">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {deliveries.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully completed deliveries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Earnings</CardTitle>
          <CardDescription>
            Detailed breakdown of your earnings from completed deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deliveries.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">
                        {delivery.deliveryDate
                          ? formatDate(delivery.deliveryDate)
                          : formatDate(delivery.updatedAt)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {delivery.orderId.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{delivery.order.crop.name}</TableCell>
                      <TableCell>
                        {delivery.order.quantity} {delivery.order.crop.unit}
                      </TableCell>
                      <TableCell>{delivery.order.buyer.name}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(delivery.order.driverPayment)}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/driver/deliveries/${delivery.id}`}
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
                You haven't completed any deliveries yet. Earnings will appear
                here once you have successfully delivered orders.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Earnings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
          <CardDescription>
            Your earnings breakdown for the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {earningsByMonth.map((item) => (
              <div
                key={item.month}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span>{item.month}</span>
                </div>
                <div className="font-medium">{formatCurrency(item.amount)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
