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
  const adminPayment = totalPrice * 0.05; // 5% for admin
  const driverPayment = totalPrice * 0.1; // 10% for driver
  const farmerPayment = totalPrice * 0.85; // 85% for farmer

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

  if (order.status !== "PENDING_PAYMENT") {
    throw new Error("Order is not in pending payment status");
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
