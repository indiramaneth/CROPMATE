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

// New server actions for the delivery request system

/**
 * Creates a delivery request from a driver to a customer
 */
export async function createDeliveryRequest({
  deliveryId,
  customFee,
  message,
}: {
  deliveryId: string;
  customFee: number;
  message?: string;
}) {
  const session = await auth();
  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  // Check if delivery exists and is still pending
  const delivery = await db.delivery.findUnique({
    where: {
      id: deliveryId,
      status: "PENDING",
      order: {
        status: "READY_FOR_DELIVERY",
      },
    },
    select: { id: true },
  });

  if (!delivery) {
    throw new Error("Delivery not found or not available");
  }

  // Check if driver already created a request for this delivery
  const existingRequest = await db.deliveryRequest.findFirst({
    where: {
      deliveryId,
      driverId: session.user.id,
    },
  });

  if (existingRequest) {
    throw new Error("You already made a request for this delivery");
  }

  const deliveryRequest = await db.deliveryRequest.create({
    data: {
      deliveryId,
      driverId: session.user.id,
      customFee,
      message,
    },
  });

  revalidatePath("/dashboard/driver/deliveries/available");
  return deliveryRequest;
}

/**
 * Gets all pending delivery requests for a customer's delivery
 */
export async function getCustomerDeliveryRequests() {
  const session = await auth();
  if (!session || session.user.role !== "CUSTOMER") {
    throw new Error("Unauthorized");
  }

  return await db.deliveryRequest.findMany({
    where: {
      delivery: {
        order: {
          buyerId: session.user.id,
        },
        status: "PENDING",
      },
      status: "PENDING",
    },
    include: {
      delivery: {
        include: {
          order: {
            include: {
              crop: true,
            },
          },
        },
      },
      driver: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Gets all delivery requests made by a driver
 */
export async function getDriverDeliveryRequests() {
  const session = await auth();
  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }
  return await db.deliveryRequest.findMany({
    where: {
      driverId: session.user.id,
    },
    include: {
      delivery: {
        include: {
          order: {
            include: {
              crop: true,
              buyer: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Accepts a delivery request (customer accepting driver's offer)
 */
export async function acceptDeliveryRequest(requestId: string) {
  const session = await auth();
  if (!session || session.user.role !== "CUSTOMER") {
    throw new Error("Unauthorized");
  }

  const request = await db.deliveryRequest.findUnique({
    where: { id: requestId },
    include: {
      delivery: {
        include: {
          order: { select: { buyerId: true, status: true, id: true } },
        },
      },
    },
  });

  if (!request) {
    throw new Error("Delivery request not found");
  }

  if (request.delivery.order.buyerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (request.status !== "PENDING") {
    throw new Error("This request has already been processed");
  }

  // Perform all operations in a transaction
  await db.$transaction(async (tx) => {
    // Update the request to accepted
    await tx.deliveryRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });

    // Reject all other pending requests for this delivery
    await tx.deliveryRequest.updateMany({
      where: {
        deliveryId: request.deliveryId,
        id: { not: requestId },
        status: "PENDING",
      },
      data: { status: "REJECTED" },
    });

    // Update the delivery with the driver and set status to ACCEPTED
    await tx.delivery.update({
      where: { id: request.deliveryId },
      data: {
        driverId: request.driverId,
        status: "ACCEPTED",
      },
    });

    // Update the order status to IN_TRANSIT
    await tx.order.update({
      where: { id: request.delivery.order.id },
      data: {
        status: "IN_TRANSIT",
      },
    });
  });

  revalidatePath("/dashboard/customer/delivery-requests");
  revalidatePath("/dashboard/driver/deliveries");
}

/**
 * Rejects a delivery request (customer rejecting driver's offer)
 */
export async function rejectDeliveryRequest(requestId: string) {
  const session = await auth();
  if (!session || session.user.role !== "CUSTOMER") {
    throw new Error("Unauthorized");
  }

  const request = await db.deliveryRequest.findUnique({
    where: { id: requestId },
    include: {
      delivery: {
        include: {
          order: { select: { buyerId: true } },
        },
      },
    },
  });

  if (!request) {
    throw new Error("Delivery request not found");
  }

  if (request.delivery.order.buyerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (request.status !== "PENDING") {
    throw new Error("This request has already been processed");
  }

  await db.deliveryRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/dashboard/customer/delivery-requests");
}
