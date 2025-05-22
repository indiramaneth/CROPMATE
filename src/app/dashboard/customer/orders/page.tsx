import { DataTable } from "@/components/ui/data-table";
import { getCustomerOrders } from "@/lib/actions/order.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { Package } from "lucide-react";

export default async function CustomerOrdersPage() {
  const orders = await getCustomerOrders({});

  return (
    <div className="container mx-auto py-4 space-y-4 px-2 sm:py-8 sm:px-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-4 sm:p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Orders
            </h1>
            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Track and manage your crop orders
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto mt-3 sm:mt-0">
          <div className="text-left sm:text-right w-full sm:w-auto">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Total Orders
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {orders.length}
            </p>
          </div>
        </div>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:py-4">
          <CardTitle className="text-base sm:text-xl dark:text-gray-100">
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 sm:pt-6 px-1 sm:px-6 overflow-auto">
          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <DataTable
              columns={columns}
              data={orders}
              searchKey="crop.name"
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
