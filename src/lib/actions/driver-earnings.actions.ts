"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { getCurrentUser } from "./user.actions";

export async function getDriverEarnings() {
  const user = await getCurrentUser();

  if (!user || user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  // Get all completed deliveries for the driver
  const deliveries = await db.delivery.findMany({
    where: {
      driverId: user.id,
      status: "DELIVERED", // Only show completed deliveries
    },
    include: {
      order: {
        include: {
          crop: {
            select: {
              name: true,
              unit: true,
            },
          },
          buyer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Get the orders associated with the completed deliveries
  const completedOrders = deliveries.map((delivery) => delivery.order);

  // Calculate total earnings
  const totalEarnings = completedOrders.reduce(
    (sum, order) => sum + order.driverPayment,
    0
  );

  // Calculate monthly earnings
  const now = new Date();
  const monthlyEarnings = deliveries
    .filter((delivery) => {
      const deliveryDate = new Date(delivery.updatedAt);
      return (
        deliveryDate.getMonth() === now.getMonth() &&
        deliveryDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, delivery) => sum + delivery.order.driverPayment, 0);

  // Get earnings by month for the past 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const earningsByMonth = [];
  for (let i = 0; i < 6; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);

    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const monthlyEarning = deliveries
      .filter((delivery) => {
        const deliveryDate = new Date(delivery.updatedAt);
        return deliveryDate >= startOfMonth && deliveryDate <= endOfMonth;
      })
      .reduce((sum, delivery) => sum + delivery.order.driverPayment, 0);

    const monthName = startOfMonth.toLocaleString("default", {
      month: "short",
    });
    earningsByMonth.unshift({
      month: `${monthName} ${startOfMonth.getFullYear()}`,
      amount: monthlyEarning,
    });
  }

  return {
    deliveries,
    totalEarnings,
    monthlyEarnings,
    earningsByMonth,
  };
}
