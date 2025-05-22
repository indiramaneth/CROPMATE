"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { getCurrentUser } from "./user.actions";

export async function getFarmerEarnings() {
  const user = await getCurrentUser();

  if (!user || user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  // Get all completed orders for the farmer's crops
  const orders = await db.order.findMany({
    where: {
      crop: {
        farmerId: user.id,
      },
      status: {
        in: [
          "PAYMENT_RECEIVED",
          "READY_FOR_DELIVERY",
          "IN_TRANSIT",
          "DELIVERED",
        ],
      },
    },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate total earnings
  const totalEarnings = orders.reduce(
    (sum, order) => sum + order.farmerPayment,
    0
  );

  // Calculate monthly earnings
  const now = new Date();
  const monthlyEarnings = orders
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, order) => sum + order.farmerPayment, 0);

  // Get earnings by month for the past 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const earningsByMonth = [];
  for (let i = 0; i < 6; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);

    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const monthlyEarning = orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfMonth && orderDate <= endOfMonth;
      })
      .reduce((sum, order) => sum + order.farmerPayment, 0);

    const monthName = startOfMonth.toLocaleString("default", {
      month: "short",
    });
    earningsByMonth.unshift({
      month: `${monthName} ${startOfMonth.getFullYear()}`,
      amount: monthlyEarning,
    });
  }

  return {
    orders,
    totalEarnings,
    monthlyEarnings,
    earningsByMonth,
  };
}
