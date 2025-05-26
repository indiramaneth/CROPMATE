"use server";

import { auth } from "@/auth";
import db from "@/lib/db";

export async function getDriverCommissions() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Get all delivery requests with admin commissions
  const driverRequests = await db.deliveryRequest.findMany({
    where: {
      status: "ACCEPTED",
      delivery: {
        status: "DELIVERED",
      },
    },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          email: true,
          // The User model doesn't appear to have an image field
        },
      },
      delivery: {
        select: {
          id: true,
          deliveryDate: true,
          updatedAt: true,
          order: {
            select: {
              id: true,
              totalPrice: true,
              status: true,
              crop: {
                select: {
                  name: true,
                  unit: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  // Define type with explicit included relations
  type DeliveryRequestWithRelations = (typeof driverRequests)[number];

  // Calculate total commissions
  const totalPaidCommissions = driverRequests
    .filter((req: DeliveryRequestWithRelations) => req.adminCommissionPaid)
    .reduce((sum, req) => sum + req.customFee * 0.02, 0);

  const totalPendingCommissions = driverRequests
    .filter((req: DeliveryRequestWithRelations) => !req.adminCommissionPaid)
    .reduce((sum, req) => sum + req.customFee * 0.02, 0);
  const totalCommissions = totalPaidCommissions + totalPendingCommissions;
  // Format data for display
  const formattedRequests = driverRequests.map(
    (req: DeliveryRequestWithRelations) => {
      // Use type assertion with unknown first to avoid TypeScript errors
      const reqWithRelations = req as unknown as {
        driver: { id: string; name: string };
        delivery: {
          deliveryDate: Date | null;
          updatedAt: Date;
          order: { crop: { name: string } };
        };
        id: string;
        driverId: string;
        deliveryId: string;
        customFee: number;
        adminCommissionPaid: boolean;
        paymentProof: string | null;
        updatedAt: Date;
      };
      return {
        id: reqWithRelations.id,
        driverId: reqWithRelations.driverId,
        driverName: reqWithRelations.driver.name,
        driverImage: null, // User model doesn't have image field
        deliveryId: reqWithRelations.deliveryId,
        deliveryDate:
          reqWithRelations.delivery.deliveryDate ||
          reqWithRelations.delivery.updatedAt,
        cropName: reqWithRelations.delivery.order.crop.name,
        driverEarnings: reqWithRelations.customFee,
        adminCommission: reqWithRelations.customFee * 0.02, // 2% of driver earnings
        isPaid: reqWithRelations.adminCommissionPaid,
        paymentProof: reqWithRelations.paymentProof,
        updatedAt: reqWithRelations.updatedAt,
      };
    }
  );
  return {
    driverCommissions: formattedRequests,
    summary: {
      totalCommissions,
      totalPaidCommissions,
      totalPendingCommissions,
      totalRequests: driverRequests.length,
      paidRequests: driverRequests.filter(
        (req: DeliveryRequestWithRelations) => req.adminCommissionPaid
      ).length,
      pendingRequests: driverRequests.filter(
        (req: DeliveryRequestWithRelations) => !req.adminCommissionPaid
      ).length,
    },
  };
}

export async function approveDriverCommission(requestId: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Mark the commission as paid
  const updatedRequest = await db.deliveryRequest.update({
    where: {
      id: requestId,
    },
    data: {
      adminCommissionPaid: true,
    },
  });

  return updatedRequest;
}
