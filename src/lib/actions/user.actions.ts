"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { UserRole } from "@/types";
import bcrypt from "bcryptjs";

export async function loginUser({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: UserRole;
}) {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: { bankDetails: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== role) {
      throw new Error(`Please login as ${user.role}`);
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw new Error("Invalid credentials");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

export async function registerUser(values: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  address: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(values.password, 10);
    const userData: any = {
      name: values.name,
      email: values.email,
      password: hashedPassword,
      role: values.role,
      address: values.address,
    };

    if (values.role === "FARMER" || values.role === "DRIVER") {
      userData.bankDetails = {
        create: {
          accountName: values.accountName!,
          accountNumber: values.accountNumber!,
          bankName: values.bankName!,
        },
      };
    }

    const user = await db.user.create({
      data: userData,
      include: { bankDetails: true },
    });

    return user;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Email already in use");
    }
    throw error;
  }
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { bankDetails: true },
  });

  return user;
}

export async function getFarmerStats() {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  // Fix date calculations
  const currentDate = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(currentDate.getMonth() - 1);

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(currentDate.getMonth() - 2);
  // Get all-time total revenue
  const allTimeOrders = await db.order.findMany({
    where: {
      crop: { farmerId: session.user.id },
      status: {
        in: [
          "PAYMENT_RECEIVED",
          "READY_FOR_DELIVERY",
          "IN_TRANSIT",
          "DELIVERED",
        ],
      },
    },
    select: {
      farmerPayment: true,
    },
  });

  const allTimeRevenue = allTimeOrders.reduce((total, order) => {
    return total + order.farmerPayment;
  }, 0);

  const [currentPeriod, previousPeriod] = await Promise.all([
    // Current period (last 30 days)
    Promise.all([
      db.crop.count({
        where: {
          farmerId: session.user.id,
          availableQuantity: { gt: 0 },
        },
      }),
      db.order.count({
        where: {
          crop: { farmerId: session.user.id },
          status: { in: ["PENDING_PAYMENT", "PAYMENT_RECEIVED"] },
        },
      }),
      db.order.findMany({
        where: {
          crop: { farmerId: session.user.id },
          status: "PAYMENT_RECEIVED", // Changed from DELIVERED to include paid orders
          createdAt: { gte: lastMonth },
        },
        include: {
          crop: true,
        },
      }),
      db.delivery.count({
        where: {
          order: { crop: { farmerId: session.user.id } },
          status: { in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
        },
      }),
    ]),
    // Previous period stats
    Promise.all([
      db.crop.count({
        where: {
          farmerId: session.user.id,
          createdAt: {
            gte: twoMonthsAgo,
            lt: lastMonth,
          },
          availableQuantity: { gt: 0 },
        },
      }),
      db.order.count({
        where: {
          crop: { farmerId: session.user.id },
          status: { in: ["PENDING_PAYMENT", "PAYMENT_RECEIVED"] },
          createdAt: {
            gte: twoMonthsAgo,
            lt: lastMonth,
          },
        },
      }),
      db.order.findMany({
        where: {
          crop: { farmerId: session.user.id },
          status: "PAYMENT_RECEIVED", // Changed from DELIVERED to include paid orders
          createdAt: {
            gte: twoMonthsAgo,
            lt: lastMonth,
          },
        },
        include: {
          crop: true,
        },
      }),
      db.delivery.count({
        where: {
          order: { crop: { farmerId: session.user.id } },
          status: { in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
          createdAt: {
            gte: twoMonthsAgo,
            lt: lastMonth,
          },
        },
      }),
    ]),
  ]);

  const [activeCrops, pendingOrders, currentDeliveredOrders, activeDeliveries] =
    currentPeriod;
  const [
    prevActiveCrops,
    prevPendingOrders,
    prevDeliveredOrders,
    prevDeliveries,
  ] = previousPeriod;

  // Calculate current period total revenue from PAYMENT_RECEIVED orders
  const currentRevenue = currentDeliveredOrders.reduce((total, order) => {
    return total + order.totalPrice; // Using totalPrice directly from order
  }, 0);

  // Calculate previous period total revenue
  const previousRevenue = prevDeliveredOrders.reduce((total, order) => {
    return total + order.totalPrice; // Using totalPrice directly from order
  }, 0);

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };
  return {
    activeCrops,
    cropsChange: calculateChange(activeCrops, prevActiveCrops),
    pendingOrders,
    ordersChange: calculateChange(pendingOrders, prevPendingOrders),
    totalRevenue: Math.round(currentRevenue * 100) / 100, // Round to 2 decimal places
    revenueChange: calculateChange(currentRevenue, previousRevenue),
    activeDeliveries,
    deliveriesChange: calculateChange(activeDeliveries, prevDeliveries),
    allTimeRevenue: Math.round(allTimeRevenue * 100) / 100, // All time revenue rounded to 2 decimal places
  };
}

export async function getDriverStats() {
  const session = await auth();
  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [activeDeliveries, pendingPickups, completedToday, pendingRequests] =
    await Promise.all([
      db.delivery.count({
        where: {
          driverId: session.user.id,
          status: { in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
        },
      }),
      db.delivery.count({
        where: {
          driverId: session.user.id,
          status: "ACCEPTED",
        },
      }),
      db.delivery.count({
        where: {
          driverId: session.user.id,
          status: "DELIVERED",
          updatedAt: { gte: today },
        },
      }),
      db.deliveryRequest.count({
        where: {
          driverId: session.user.id,
          status: "PENDING",
        },
      }),
    ]);

  return {
    activeDeliveries,
    pendingPickups,
    completedToday,
    pendingRequests,
    deliveriesChange: Math.floor(Math.random() * 20) + 5, // Mock growth percentage
  };
}
