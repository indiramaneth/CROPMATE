"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CropCategory } from "@/app/generated/prisma";

export async function getAdminDashboardStats() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  // Get counts for various entities
  const [
    totalUsers,
    customerCount,
    farmerCount,
    driverCount,
    adminCount,
    totalCrops,
    totalOrders,
    totalDeliveries,
  ] = await Promise.all([
    // Total users
    db.user.count(),

    // User counts by role
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.user.count({ where: { role: "FARMER" } }),
    db.user.count({ where: { role: "DRIVER" } }),
    db.user.count({ where: { role: "ADMIN" } }),

    // Total crops
    db.crop.count(),

    // Total orders
    db.order.count(),

    // Total deliveries
    db.delivery.count(),
  ]);

  // Get recent activity data
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const [
    newUsers,
    newOrders,
    newCrops,
    completedDeliveries,
    monthlyOrderStats,
    monthlyCropStats,
  ] = await Promise.all([
    // New user registrations in the last week
    db.user.count({
      where: {
        createdAt: { gte: lastWeek },
      },
    }),

    // New orders in the last week
    db.order.count({
      where: {
        createdAt: { gte: lastWeek },
      },
    }),

    // New crops listed in the last week
    db.crop.count({
      where: {
        createdAt: { gte: lastWeek },
      },
    }),

    // Completed deliveries in the last week
    db.delivery.count({
      where: {
        status: "DELIVERED",
        deliveryDate: { gte: lastWeek },
      },
    }),

    // Monthly order statistics (for chart)
    getMonthlyStats("order"),

    // Monthly crop statistics (for chart)
    getMonthlyStats("crop"),
  ]);

  // Get recent orders and crops for display
  const [recentOrders, recentCrops] = await Promise.all([
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        buyer: { select: { name: true } },
        crop: { select: { name: true } },
      },
    }),

    db.crop.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        farmer: { select: { name: true } },
      },
    }),
  ]);

  return {
    // User stats
    totalUsers,
    customerCount,
    farmerCount,
    driverCount,
    adminCount,

    // Entity counts
    totalCrops,
    totalOrders,
    totalDeliveries,

    // Weekly activity
    weeklyActivity: {
      newUsers,
      newOrders,
      newCrops,
      completedDeliveries,
    },

    // Chart data
    chartData: {
      orders: monthlyOrderStats,
      crops: monthlyCropStats,
    },

    // Recent items
    recentOrders,
    recentCrops,
  };
}

// Helper function to get monthly stats for charts
async function getMonthlyStats(entity: "order" | "crop") {
  const now = new Date();
  const months = [];
  const counts = [];

  // Get stats for the last 12 months
  for (let i = 0; i < 12; i++) {
    const month = new Date(now);
    month.setMonth(month.getMonth() - i);

    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const count = await (entity === "order"
      ? db.order.count({
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        })
      : db.crop.count({
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }));

    counts.unshift(count); // Add to beginning of array so most recent is last
  }

  return counts;
}

// Function to get all users for the admin users page
export async function getAllUsers() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      bankDetails: true,
    },
  });
}

// Function to get all crops for the admin crops page
export async function getAllCrops() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return db.crop.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      farmer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orders: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });
}

// Function to get all orders for the admin orders page
export async function getAllOrders() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      crop: {
        include: {
          farmer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      delivery: true,
    },
  });
}

// Function to get all deliveries for the admin deliveries page
export async function getAllDeliveries() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return db.delivery.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      order: {
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
            },
          },
          crop: {
            include: {
              farmer: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      driver: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

// Function to delete a user (admin only)
export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  // Check if the user exists
  const userToDelete = await db.user.findUnique({
    where: { id: userId },
    include: {
      bankDetails: true,
      crops: true,
      orders: true,
      deliveries: true,
    },
  });

  if (!userToDelete) {
    throw new Error("User not found");
  }

  // Don't allow deleting the last admin
  if (userToDelete.role === "ADMIN") {
    const adminCount = await db.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      throw new Error("Cannot delete the last admin user");
    }
  }

  try {
    // Start a transaction to handle different scenarios based on user role
    await db.$transaction(async (tx) => {
      // Handle related data differently based on the user's role
      if (userToDelete.role === "FARMER") {
        // For farmers, check if they have any orders in progress
        const activeOrders = await tx.order.count({
          where: {
            crop: { farmerId: userId },
            status: { notIn: ["DELIVERED", "CANCELLED"] },
          },
        });

        if (activeOrders > 0) {
          throw new Error("Cannot delete farmer with active orders");
        }

        // Delete bank details if they exist
        if (userToDelete.bankDetails) {
          await tx.bankDetails.delete({
            where: { userId },
          });
        }

        // Mark crops as unavailable instead of deleting them
        await tx.crop.updateMany({
          where: { farmerId: userId },
          data: { availableQuantity: 0 },
        });
      }

      if (userToDelete.role === "DRIVER") {
        // Check if driver has active deliveries
        const activeDeliveries = await tx.delivery.count({
          where: {
            driverId: userId,
            status: { notIn: ["DELIVERED", "CANCELLED"] },
          },
        });

        if (activeDeliveries > 0) {
          throw new Error("Cannot delete driver with active deliveries");
        }

        // Reset driverId to null in deliveries
        await tx.delivery.updateMany({
          where: { driverId: userId },
          data: { driverId: null },
        });
      }

      if (userToDelete.role === "CUSTOMER") {
        // Check if customer has active orders
        const activeOrders = await tx.order.count({
          where: {
            buyerId: userId,
            status: { notIn: ["DELIVERED", "CANCELLED"] },
          },
        });

        if (activeOrders > 0) {
          throw new Error("Cannot delete customer with active orders");
        }
      }

      // Finally delete the user
      await tx.user.delete({ where: { id: userId } });
    });

    return { success: true, message: "User deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete user",
    };
  }
}

// Function to edit a user (admin only)
export async function editUser(
  userId: string,
  userData: {
    name?: string;
    email?: string;
    role?: "CUSTOMER" | "FARMER" | "DRIVER" | "ADMIN";
    address?: string;
    bankDetails?: {
      accountName?: string;
      accountNumber?: string;
      bankName?: string;
      branch?: string;
    };
  }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  // Check if the user exists
  const existingUser = await db.user.findUnique({
    where: { id: userId },
    include: { bankDetails: true },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  // Don't allow the last admin to lose admin privileges
  if (
    existingUser.role === "ADMIN" &&
    userData.role &&
    userData.role !== "ADMIN"
  ) {
    const adminCount = await db.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      throw new Error("Cannot remove admin role from the last admin");
    }
  }

  try {
    // Update user in a transaction to handle bank details as well
    const result = await db.$transaction(async (tx) => {
      // Prepare user update data
      const userUpdateData: any = {};
      if (userData.name) userUpdateData.name = userData.name;
      if (userData.email) userUpdateData.email = userData.email;
      if (userData.role) userUpdateData.role = userData.role;
      if (userData.address) userUpdateData.address = userData.address;

      // Update user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: userUpdateData,
      });

      // Handle bank details if user is a farmer or becoming a farmer
      if (
        userData.bankDetails &&
        (existingUser.role === "FARMER" || userData.role === "FARMER")
      ) {
        const bankDetailsData: any = {};
        if (userData.bankDetails.accountName)
          bankDetailsData.accountName = userData.bankDetails.accountName;
        if (userData.bankDetails.accountNumber)
          bankDetailsData.accountNumber = userData.bankDetails.accountNumber;
        if (userData.bankDetails.bankName)
          bankDetailsData.bankName = userData.bankDetails.bankName;
        if (userData.bankDetails.branch)
          bankDetailsData.branch = userData.bankDetails.branch;

        // If bank details exist, update them; otherwise create them
        if (existingUser.bankDetails) {
          await tx.bankDetails.update({
            where: { userId },
            data: bankDetailsData,
          });
        } else {
          await tx.bankDetails.create({
            data: {
              ...bankDetailsData,
              userId,
            },
          });
        }
      }

      return updatedUser;
    });

    return { success: true, user: result };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, message: "Email already in use" };
    }
    return {
      success: false,
      message: error.message || "Failed to update user",
    };
  }
}

// Function for admins to update crop information
export async function adminUpdateCrop(
  cropId: string,
  cropData: {
    name?: string;
    description?: string;
    category?: CropCategory;
    pricePerUnit?: number;
    availableQuantity?: number;
    unit?: string;
    harvestDate?: Date;
    location?: string;
    imageUrl?: string;
  }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    // Check if the crop exists
    const existingCrop = await db.crop.findUnique({
      where: { id: cropId },
    });

    if (!existingCrop) {
      throw new Error("Crop not found");
    }

    // Update the crop
    const updatedCrop = await db.crop.update({
      where: { id: cropId },
      data: {
        ...(cropData.name && { name: cropData.name }),
        ...(cropData.description !== undefined && {
          description: cropData.description,
        }),
        ...(cropData.category && { category: cropData.category }),
        ...(cropData.pricePerUnit !== undefined && {
          pricePerUnit: cropData.pricePerUnit,
        }),
        ...(cropData.availableQuantity !== undefined && {
          availableQuantity: cropData.availableQuantity,
        }),
        ...(cropData.unit && { unit: cropData.unit }),
        ...(cropData.harvestDate && { harvestDate: cropData.harvestDate }),
        ...(cropData.location && { location: cropData.location }),
        ...(cropData.imageUrl && { imageUrl: cropData.imageUrl }),
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/admin/crops");
    return { success: true, crop: updatedCrop };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update crop",
    };
  }
}

// Function for admins to delete a crop
export async function adminDeleteCrop(cropId: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    // Check if crop exists and if it has any active orders
    const crop = await db.crop.findUnique({
      where: { id: cropId },
      include: {
        orders: {
          where: {
            status: { notIn: ["DELIVERED", "CANCELLED"] },
          },
        },
      },
    });

    if (!crop) {
      throw new Error("Crop not found");
    }

    // Don't allow deletion if there are active orders
    if (crop.orders && crop.orders.length > 0) {
      throw new Error("Cannot delete crop with active orders");
    }

    // Proceed with deletion
    await db.crop.delete({
      where: { id: cropId },
    });

    revalidatePath("/dashboard/admin/crops");
    return { success: true, message: "Crop deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete crop",
    };
  }
}

// Function for admins to update crop availability (quick toggle)
export async function adminToggleCropAvailability(
  cropId: string,
  available: boolean
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  try {
    const existingCrop = await db.crop.findUnique({
      where: { id: cropId },
    });

    if (!existingCrop) {
      throw new Error("Crop not found");
    }

    const updatedCrop = await db.crop.update({
      where: { id: cropId },
      data: {
        availableQuantity: available
          ? existingCrop.availableQuantity > 0
            ? existingCrop.availableQuantity
            : 10
          : 0,
      },
    });

    revalidatePath("/dashboard/admin/crops");
    return {
      success: true,
      available,
      message: `Crop ${
        available ? "marked as available" : "marked as unavailable"
      }`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update crop availability",
    };
  }
}
