"use server";

import { auth } from "@/auth";
import db from "@/lib/db";

export async function getAdminEarnings() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  // Get all orders with payments received or later status
  const orders = await db.order.findMany({
    where: {
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

  // Calculate total admin earnings
  const totalEarnings = orders.reduce(
    (sum, order) => sum + order.adminPayment,
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
    .reduce((sum, order) => sum + order.adminPayment, 0);

  // Get earnings by month for the past 6 months
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
      .reduce((sum, order) => sum + order.adminPayment, 0);

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
