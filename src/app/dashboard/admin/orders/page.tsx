import { DataTable } from "@/components/ui/data-table";
import { getAllOrders } from "@/lib/actions/order.actions";
import { columns } from "./columns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PackageCheck, ClipboardList } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  // Calculate order statistics
  const totalOrders = orders.length;
  const pendingPayment = orders.filter(
    (order) => order.status === "PENDING_PAYMENT"
  ).length;
  const inProgress = orders.filter((order) =>
    ["PAYMENT_RECEIVED", "READY_FOR_DELIVERY", "IN_TRANSIT"].includes(
      order.status
    )
  ).length;
  const completed = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;
  const cancelled = orders.filter(
    (order) => order.status === "CANCELLED"
  ).length;

  const totalRevenue = orders
    .filter(
      (order) =>
        order.status !== "CANCELLED" && order.status !== "PENDING_PAYMENT"
    )
    .reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Order Management
          </h1>
        </div>
        <p className="text-muted-foreground">
          View and manage all orders across the platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-card border-l-4 border-l-primary">
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total Orders
            </span>
            <span className="text-2xl font-bold mt-1">{totalOrders}</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-yellow-500">
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pending Payment
            </span>
            <span className="text-2xl font-bold mt-1">{pendingPayment}</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              In Progress
            </span>
            <span className="text-2xl font-bold mt-1">{inProgress}</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-green-500">
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Completed
            </span>
            <span className="text-2xl font-bold mt-1">{completed}</span>
          </CardContent>
        </Card>

        <Card className="bg-card border-l-4 border-l-purple-500">
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total Revenue
            </span>
            <span className="text-2xl font-bold mt-1">
              $
              {totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="shadow-lg">
        <CardHeader className="pb-2 bg-muted/30">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-primary" />
            <CardTitle>All Orders</CardTitle>
          </div>
          <CardDescription>
            Comprehensive view of all orders in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-2 sm:px-6 overflow-auto">
          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <DataTable
              columns={columns}
              data={orders}
              searchKey="buyer.name"
              filters={[
                {
                  id: "status",
                  title: "Status",
                  options: [
                    { label: "Pending Payment", value: "PENDING_PAYMENT" },
                    { label: "Payment Received", value: "PAYMENT_RECEIVED" },
                    {
                      label: "Ready for Delivery",
                      value: "READY_FOR_DELIVERY",
                    },
                    { label: "In Transit", value: "IN_TRANSIT" },
                    { label: "Delivered", value: "DELIVERED" },
                    { label: "Cancelled", value: "CANCELLED" },
                  ],
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
