// This is a one-time migration script to update existing DeliveryRequest records
// Run this script manually after deploying the schema changes

import db from "@/lib/db";

async function migrateExistingDeliveryRequests() {
  console.log("Starting migration of existing delivery requests...");

  try {
    // Get all accepted delivery requests
    const deliveryRequests = await db.deliveryRequest.findMany({
      where: {
        status: "ACCEPTED",
      },
    });

    console.log(
      `Found ${deliveryRequests.length} delivery requests to update.`
    );

    // For each request, add the admin commission defaults
    for (const request of deliveryRequests) {
      await db.deliveryRequest.update({
        where: {
          id: request.id,
        },
        data: {
          adminCommissionPaid: false, // Assume all existing requests haven't paid commission yet
          // Don't set paymentProof as it's null by default
        },
      });
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  }
}

// This function can be imported and executed after schema changes are deployed
export default migrateExistingDeliveryRequests;
