import {
  getOrderById,
  markAsReadyForDelivery,
} from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import OrderStatusBadge from "@/components/orders/status-badge";
import { auth } from "@/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  // Check authorization
  const isOwner = order.buyerId === session?.user.id;
  const isFarmer = order.crop.farmerId === session?.user.id;
  const isDriver =
    session?.user.role === "DRIVER" &&
    order.delivery?.driverId === session?.user.id;

  if (!isOwner && !isFarmer && !isDriver) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 md:py-12 px-4 md:px-6 min-h-screen">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-muted-foreground mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <OrderStatusBadge status={order.status} className="text-lg" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 space-y-6 md:space-y-8">
          {/* Order Details Card */}
          <Card className="p-6 md:p-8 border shadow-sm dark:shadow-none dark:bg-card/50">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Order Details
            </h2>
            <Separator className="mb-6" />
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground text-sm">Crop</p>
                  <p className="font-medium text-lg">
                    {order.crop.name} ({order.quantity} {order.crop.unit})
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Price per unit
                  </p>
                  <p className="font-medium text-lg">
                    ${order.crop.pricePerUnit}/{order.crop.unit}
                  </p>
                </div>
                {!isDriver && (
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Amount
                    </p>
                    <p className="text-lg font-bold">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground text-sm">Farmer</p>
                  <p className="font-medium text-lg">
                    {order.crop.farmer.name}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Delivery Information Card */}
          <Card className="p-6 md:p-8 border shadow-sm dark:shadow-none dark:bg-card/50">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              Delivery Information
            </h2>
            <Separator className="mb-6" />
            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground text-sm">
                  Delivery Address
                </p>
                <p className="font-medium text-lg">{order.deliveryAddress}</p>
              </div>

              {order.delivery && (
                <>
                  <div className="flex items-center gap-3">
                    <p className="text-muted-foreground text-sm">
                      Delivery Status:
                    </p>
                    <OrderStatusBadge status={order.delivery.status} />
                  </div>
                  {order.delivery.driver && (
                    <div className="bg-muted/30 dark:bg-muted/10 p-4 rounded-lg">
                      <p className="text-muted-foreground text-sm">Driver</p>
                      <p className="font-medium text-lg flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-primary/20 dark:bg-primary/10 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                            <circle cx="7" cy="17" r="2"></circle>
                            <path d="M9 17h6"></path>
                            <circle cx="17" cy="17" r="2"></circle>
                          </svg>
                        </span>
                        {order.delivery.driver.name}
                      </p>
                    </div>
                  )}
                  {order.delivery.pickupDate && (
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Pickup Date
                      </p>
                      <p className="font-medium text-lg">
                        {new Date(order.delivery.pickupDate).toLocaleString()}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>{" "}
        <div className="space-y-6">
          {/* Farmer Actions */}
          {isFarmer && order.status === "PAYMENT_RECEIVED" && (
            <Card className="p-6 md:p-8 border shadow-sm dark:shadow-none bg-gradient-to-br from-white to-green-50 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800/30">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">
                Prepare Order
              </h2>
              <p className="text-muted-foreground mb-6">
                Once you've prepared the order, mark it as ready for delivery
              </p>
              <form action={markAsReadyForDelivery.bind(null, order.id)}>
                <Button
                  type="submit"
                  className="w-full py-6 text-base"
                  variant="default"
                  size="lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Mark as Ready for Delivery
                </Button>
              </form>
            </Card>
          )}

          {/* Support Card */}
          <Card className="p-6 md:p-8 border shadow-sm dark:shadow-none bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-100 dark:border-blue-800/30">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-400">
              Need Help?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our support team is available 24/7 to assist with any questions
            </p>
            <Button
              variant="outline"
              className="w-full py-6 text-base border-blue-200 hover:bg-blue-100/50 dark:border-blue-800 dark:hover:bg-blue-900/20"
              size="lg"
              asChild
            >
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                Contact Support
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
