import { DataTable } from "@/components/ui/data-table";
import { getFarmerOrders } from "@/lib/actions/order.actions";
import { columns } from "./columns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default async function FarmerOrdersPage() {
  const orders = await getFarmerOrders({});

  return (
    <div className="space-y-6">
      {/* Enhanced header section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Customer Orders</h1>
        </div>
        <p className="text-muted-foreground">
          Manage and track all orders from your customers
        </p>
      </div>

      {/* Wrapped DataTable in a Card for better visual hierarchy */}
      <Card className="border-green-100 dark:border-green-900/30 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            {orders.length === 0
              ? "No orders received yet"
              : `You have ${orders.length} order${
                  orders.length === 1 ? "" : "s"
                }`}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  { label: "Ready for Delivery", value: "READY_FOR_DELIVERY" },
                  { label: "In Transit", value: "IN_TRANSIT" },
                  { label: "Delivered", value: "DELIVERED" },
                  { label: "Cancelled", value: "CANCELLED" },
                ],
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
