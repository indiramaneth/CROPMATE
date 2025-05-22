"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getRecentDeliveries({
  take = 3,
}: { take?: number } = {}) {
  const session = await auth();
  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  return await db.delivery.findMany({
    where: { driverId: session.user.id },
    include: {
      order: {
        include: {
          crop: { select: { name: true, location: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getAvailableDeliveries() {
  const session = await auth();
  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  return await db.delivery.findMany({
    where: {
      status: "PENDING",
      order: {
        status: "READY_FOR_DELIVERY",
      },
    },
    include: {
      order: {
        include: {
          crop: {
            select: {
              name: true,
              location: true,
              farmer: {
                select: {
                  name: true,
                  address: true,
                },
              },
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
  });
}

export async function getDriverDeliveries({ take }: { take?: number }) {
  const session = await auth();
  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  return await db.delivery.findMany({
    where: { driverId: session.user.id },
    include: {
      order: {
        include: {
          crop: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function acceptDelivery(deliveryId: string) {
  const session = await auth();
  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  const delivery = await db.delivery.findUnique({
    where: { id: deliveryId },
    select: { orderId: true },
  });

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  await db.$transaction([
    db.delivery.update({
      where: { id: deliveryId },
      data: {
        driverId: session.user.id,
        status: "ACCEPTED",
      },
    }),
    db.order.update({
      where: { id: delivery.orderId },
      data: {
        status: "IN_TRANSIT",
      },
    }),
  ]);

  revalidatePath("/dashboard/driver/deliveries");
  revalidatePath("/dashboard/driver/available");
}

export async function completeDelivery(deliveryId: string) {
  const session = await auth();
  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  // First get the order
  const delivery = await db.delivery.findUnique({
    where: { id: deliveryId },
    select: { orderId: true },
  });

  if (!delivery) {
    throw new Error("Delivery not found");
  }

  await db.$transaction([
    db.delivery.update({
      where: {
        id: deliveryId,
        driverId: session.user.id,
      },
      data: {
        status: "DELIVERED",
        deliveryDate: new Date(),
      },
    }),
    db.order.update({
      where: { id: delivery.orderId },
      data: {
        status: "DELIVERED",
      },
    }),
  ]);

  revalidatePath("/dashboard/driver/deliveries");
}

export async function pickupDelivery(deliveryId: string) {
  const session = await auth();
  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  await db.delivery.update({
    where: {
      id: deliveryId,
      driverId: session.user.id,
    },
    data: {
      status: "PICKED_UP",
      pickupDate: new Date(),
    },
  });

  revalidatePath("/dashboard/driver/deliveries");
}

export async function getAllDeliveries() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return await db.delivery.findMany({
    include: {
      order: {
        include: {
          crop: {
            include: {
              farmer: {
                select: { name: true, email: true },
              },
            },
          },
          buyer: {
            select: { name: true, email: true },
          },
        },
      },
      driver: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
