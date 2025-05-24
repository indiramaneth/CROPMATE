"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { getCurrentUser } from "./user.actions";

export async function getDriverEarnings() {
  const user = await getCurrentUser();

  if (!user || user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  // Get all completed deliveries and their associated delivery requests for the driver
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
      requests: {
        where: {
          driverId: user.id,
          status: "ACCEPTED",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  // Define type for delivery with included relations
  type DeliveryWithRelations = {
    requests?: {
      customFee: number;
    }[];
    order: {
      driverPayment: number;
    };
  };

  // Calculate earnings based on delivery request customFee
  // For each delivery, use the customFee from the accepted request if available
  const calculateEarnings = (delivery: DeliveryWithRelations) => {
    // Use the customFee from the accepted request if available
    if (delivery.requests && delivery.requests.length > 0) {
      return delivery.requests[0].customFee;
    }

    // Fallback to order.driverPayment for backwards compatibility with existing data
    return delivery.order.driverPayment;
  };

  // Calculate total earnings
  const totalEarnings = deliveries.reduce(
    (sum, delivery) => sum + calculateEarnings(delivery),
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
    .reduce((sum, delivery) => sum + calculateEarnings(delivery), 0);

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
      .reduce((sum, delivery) => sum + calculateEarnings(delivery), 0);

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
