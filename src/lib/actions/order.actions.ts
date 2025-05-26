"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadImage } from "../cloudinary";
import { CreateOrderParams } from "@/types";

export async function createOrder({
  cropId,
  quantity,
  deliveryAddress,
  paymentProof,
}: CreateOrderParams) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const crop = await db.crop.findUnique({
    where: { id: cropId },
    select: { pricePerUnit: true },
  });

  if (!crop) {
    throw new Error("Crop not found");
  }
  const totalPrice = quantity * crop.pricePerUnit;
  // Calculate payment distributions
  const adminPayment = totalPrice * 0.02; // 2% for admin (reduced from 5%)
  const driverPayment = 0; // Driver payment is now handled through customFee in delivery requests
  const farmerPayment = totalPrice * 0.98; // 98% for farmer (all remaining after admin fee)

  let paymentProofUrl = null;
  try {
    const result = await uploadImage(paymentProof);
    paymentProofUrl = (result as { secure_url: string }).secure_url;
  } catch (error) {
    throw new Error("Failed to upload payment proof");
  }

  const order = await db.order.create({
    data: {
      quantity,
      totalPrice,
      adminPayment,
      driverPayment,
      farmerPayment,
      deliveryAddress,
      paymentProof: paymentProofUrl,
      status: "PENDING_PAYMENT",
      buyerId: session.user.id,
      cropId: cropId,
    },
  });

  revalidatePath("/dashboard/orders");
  return order;
}

export async function getCustomerOrders({ take }: { take?: number }) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return await db.order.findMany({
    where: { buyerId: session.user.id },
    include: {
      crop: {
        include: {
          farmer: {
            select: { name: true },
          },
        },
      },
      delivery: true,
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getFarmerOrders({ take }: { take?: number }) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  return await db.order.findMany({
    where: { crop: { farmerId: session.user.id } },
    include: { crop: true, buyer: true },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getRecentOrders({ take = 3 }: { take?: number } = {}) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  return await db.order.findMany({
    where: { crop: { farmerId: session.user.id } },
    include: {
      crop: { select: { name: true } },
      buyer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function confirmPayment(orderId: string) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { crop: true },
  });

  if (!order || order.crop.farmerId !== session.user.id) {
    throw new Error("Order not found or unauthorized");
  }

  // Check if the order has a valid status for confirmation
  if (order.status !== "PENDING_PAYMENT") {
    // Log more information to help debug
    console.log(
      `Cannot confirm payment for order ${orderId}. Current status: ${order.status}`
    );

    // If the payment was already confirmed, we can just let it pass instead of throwing an error
    if (
      order.status === "PAYMENT_RECEIVED" ||
      order.status === "READY_FOR_DELIVERY" ||
      order.status === "IN_TRANSIT" ||
      order.status === "DELIVERED"
    ) {
      console.log(
        "Order already has payment confirmed or is in a later stage, skipping confirmation"
      );
      return; // Skip the update since it's already in a confirmed state
    }

    throw new Error(
      `Order is not in pending payment status. Current status: ${order.status}`
    );
  }

  await db.$transaction([
    db.order.update({
      where: { id: orderId },
      data: { status: "PAYMENT_RECEIVED" },
    }),
    db.delivery.create({
      data: {
        orderId,
        status: "PENDING",
      },
    }),
  ]);

  revalidatePath("/dashboard/farmer/orders");
  revalidatePath(`/orders/${orderId}`);
}

export async function rejectPayment(orderId: string) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { crop: true },
  });

  if (!order || order.crop.farmerId !== session.user.id) {
    throw new Error("Order not found or unauthorized");
  }

  if (order.status !== "PENDING_PAYMENT") {
    throw new Error("Order is not in pending payment status");
  }

  await db.order.update({
    where: { id: orderId },
    data: {
      status: "PENDING_PAYMENT",
      paymentProof: null,
    },
  });

  revalidatePath("/dashboard/farmer/orders");
  revalidatePath(`/orders/${orderId}`);
}

export async function markAsReadyForDelivery(orderId: string) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { crop: true },
  });

  if (!order || order.crop.farmerId !== session.user.id) {
    throw new Error("Order not found or unauthorized");
  }

  if (order.status !== "PAYMENT_RECEIVED") {
    throw new Error("Order must have payment received first");
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: "READY_FOR_DELIVERY" },
  });

  revalidatePath("/dashboard/farmer/orders");
  revalidatePath(`/orders/${orderId}`);
}

export async function cancelOrder(orderId: string) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { crop: true },
  });

  if (!order || order.crop.farmerId !== session.user.id) {
    throw new Error("Order not found or unauthorized");
  }

  if (order.status === "DELIVERED" || order.status === "CANCELLED") {
    throw new Error(`Order cannot be cancelled in ${order.status} status`);
  }

  await db.$transaction([
    db.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    }),
    db.delivery.updateMany({
      where: { orderId },
      data: { status: "CANCELLED" },
    }),
  ]);

  revalidatePath("/dashboard/farmer/orders");
  revalidatePath(`/orders/${orderId}`);
}

export async function getOrderById(id: string) {
  return await db.order.findUnique({
    where: { id },
    include: {
      crop: {
        include: {
          farmer: {
            include: {
              bankDetails: true,
            },
          },
        },
      },
      delivery: {
        include: {
          driver: true,
          requests: true, // Include delivery requests to get the driver fee
        },
      },
      buyer: true,
    },
  });
}

export async function getAllOrders() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return await db.order.findMany({
    include: {
      crop: {
        include: {
          farmer: {
            select: { name: true },
          },
        },
      },
      buyer: {
        select: { name: true, email: true },
      },
      delivery: {
        include: {
          driver: {
            select: { name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
