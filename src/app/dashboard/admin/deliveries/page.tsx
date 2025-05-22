import { DataTable } from "@/components/ui/data-table";
import { getAllDeliveries } from "@/lib/actions/delivery.actions";
import { columns } from "./columns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Truck, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminDeliveriesPage() {
  const deliveries = await getAllDeliveries();

  // Calculate delivery statistics
  const totalDeliveries = deliveries.length;
  const pendingDeliveries = deliveries.filter(
    (d) => d.status === "PENDING"
  ).length;
  const inTransitDeliveries = deliveries.filter((d) =>
    ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"].includes(d.status)
  ).length;
  const completedDeliveries = deliveries.filter(
    (d) => d.status === "DELIVERED"
  ).length;
  const cancelledDeliveries = deliveries.filter(
    (d) => d.status === "CANCELLED"
  ).length;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Delivery Management
        </h1>
        <p className="text-muted-foreground">
          Monitor and track all delivery operations across the platform
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deliveries
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
              <Truck className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {totalDeliveries}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {inTransitDeliveries}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {pendingDeliveries} pending assignment
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-950/50 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {completedDeliveries}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((completedDeliveries / (totalDeliveries || 1)) * 100)}
              % completion rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {cancelledDeliveries}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border shadow-md">
        <CardHeader className="pb-3 border-b">
          <CardTitle>All Deliveries</CardTitle>
          <CardDescription>
            View and manage all delivery operations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={deliveries}
            searchKey="order.crop.name"
            filters={[
              {
                id: "status",
                title: "Status",
                options: [
                  { label: "Pending", value: "PENDING" },
                  { label: "Accepted", value: "ACCEPTED" },
                  { label: "Picked Up", value: "PICKED_UP" },
                  { label: "In Transit", value: "IN_TRANSIT" },
                  { label: "Delivered", value: "DELIVERED" },
                  { label: "Cancelled", value: "CANCELLED" },
                ],
              },
              {
                id: "hasDriver",
                title: "Driver Assigned",
                options: [
                  { label: "Assigned", value: "true" },
                  { label: "Unassigned", value: "false" },
                ],
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
