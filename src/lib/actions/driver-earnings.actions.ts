"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { getCurrentUser } from "./user.actions";
import { uploadImage } from "@/lib/cloudinary";

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
  }); // Define type for delivery with included relations
  type DeliveryWithRelations = {
    requests?: {
      id: string;
      customFee: number;
      adminCommissionPaid?: boolean;
      paymentProof?: string | null;
    }[];
    order: {
      driverPayment: number;
    };
    id: string;
    updatedAt: Date;
    deliveryDate?: Date | null;
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
  // Calculate admin commission to be paid by driver (2% of driver earnings)
  const calculateAdminCommission = (delivery: DeliveryWithRelations) => {
    const earnings = calculateEarnings(delivery);
    return earnings * 0.02; // 2% commission for admin
  };

  // Check if admin commission has been paid
  const isCommissionPaid = (delivery: DeliveryWithRelations) => {
    if (delivery.requests && delivery.requests.length > 0) {
      return !!delivery.requests[0].adminCommissionPaid;
    }
    return false;
  };

  // Get payment proof if available
  const getPaymentProof = (delivery: DeliveryWithRelations) => {
    if (delivery.requests && delivery.requests.length > 0) {
      return delivery.requests[0].paymentProof;
    }
    return null;
  };

  // Get request ID
  const getRequestId = (delivery: DeliveryWithRelations) => {
    if (delivery.requests && delivery.requests.length > 0) {
      return delivery.requests[0].id;
    }
    return null;
  };

  // Calculate total admin commission
  const totalAdminCommission = deliveries.reduce(
    (sum, delivery) => sum + calculateAdminCommission(delivery as any),
    0
  );

  // Calculate unpaid admin commission
  const unpaidAdminCommission = deliveries.reduce(
    (sum, delivery) =>
      sum +
      (isCommissionPaid(delivery as any)
        ? 0
        : calculateAdminCommission(delivery as any)),
    0
  );

  // Get admin bank details (dummy details for now)
  const adminBankDetails = {
    accountName: "CropMate Admin",
    accountNumber: "1234567890",
    bankName: "Agricultural Bank",
    branch: "Main Branch",
  };

  return {
    deliveries,
    totalEarnings,
    monthlyEarnings,
    earningsByMonth,
    totalAdminCommission,
    unpaidAdminCommission,
    adminBankDetails,
    pendingPayments: deliveries
      .filter((delivery) => !isCommissionPaid(delivery as any))
      .map((delivery) => ({
        id: getRequestId(delivery as any) || delivery.id,
        deliveryId: delivery.id,
        date: delivery.deliveryDate || delivery.updatedAt,
        amount: calculateAdminCommission(delivery as any),
        earnings: calculateEarnings(delivery as any),
        isPaid: isCommissionPaid(delivery as any),
        paymentProof: getPaymentProof(delivery as any),
      })),
  };
}

// Function to submit driver's admin commission payment proof
export async function submitDriverAdminPayment(
  requestId: string,
  file: any // File upload
) {
  const session = await auth();

  if (!session || session.user.role !== "DRIVER") {
    throw new Error("Unauthorized");
  }

  // Upload the bank slip image
  let paymentProofUrl = null;
  try {
    const result = await uploadImage(file);
    paymentProofUrl = (result as { secure_url: string }).secure_url;
  } catch (error) {
    throw new Error("Failed to upload payment proof");
  }

  // Update the delivery request with payment proof
  const updatedRequest = await db.deliveryRequest.update({
    where: {
      id: requestId,
    },
    data: {
      paymentProof: paymentProofUrl,
      adminCommissionPaid: true,
    },
  });

  return updatedRequest;
}
