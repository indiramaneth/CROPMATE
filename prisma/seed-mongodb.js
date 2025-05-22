// Native MongoDB driver seeding script
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

async function main() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // Clear existing collections to avoid duplicates
    await db.collection("User").deleteMany({});
    await db.collection("BankDetails").deleteMany({});
    await db.collection("Crop").deleteMany({});
    await db.collection("Order").deleteMany({});
    await db.collection("Delivery").deleteMany({});

    console.log("All collections cleared");

    // Create users
    console.log("Creating users...");

    const aliceId = new ObjectId();
    const bobId = new ObjectId();
    const charlieId = new ObjectId();

    const users = [
      {
        _id: aliceId,
        email: "alice@example.com",
        password: "password123",
        name: "Alice Smith",
        role: "CUSTOMER",
        address: "123 Main St, Springfield",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: bobId,
        email: "bob@example.com",
        password: "password123",
        name: "Bob Johnson",
        role: "FARMER",
        address: "456 Elm St, Shelbyville",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: charlieId,
        email: "charlie@example.com",
        password: "password123",
        name: "Charlie Brown",
        role: "DRIVER",
        address: "789 Oak St, Capital City",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("User").insertMany(users);
    console.log("Users created successfully");

    // Sample image URLs
    const sampleImageUrls = [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=60",
    ];

    // Create bank details
    console.log("Creating bank details...");
    const bankDetailsId = new ObjectId();
    await db.collection("BankDetails").insertOne({
      _id: bankDetailsId,
      accountName: "Bob Johnson",
      accountNumber: "1234567890",
      bankName: "Springfield Bank",
      branch: "Main Branch",
      userId: bobId.toString(),
    });
    console.log("Bank details created successfully");

    // Create crops
    console.log("Creating crops...");
    const wheatId = new ObjectId();
    const cornId = new ObjectId();

    const crops = [
      {
        _id: wheatId,
        name: "Wheat",
        description: "High-quality wheat harvested in 2023.",
        category: "grains",
        pricePerUnit: 10.5,
        availableQuantity: 100,
        unit: "kg",
        harvestDate: new Date("2023-08-01"),
        location: "Springfield Farms",
        imageUrl: sampleImageUrls[0],
        farmerId: bobId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: cornId,
        name: "Corn",
        description: "Organic corn ready for delivery.",
        category: "grains",
        pricePerUnit: 8.75,
        availableQuantity: 200,
        unit: "kg",
        harvestDate: new Date("2023-09-15"),
        location: "Shelbyville Farms",
        imageUrl: sampleImageUrls[1],
        farmerId: bobId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("Crop").insertMany(crops);
    console.log("Crops created successfully");

    // Create orders
    console.log("Creating orders...");
    const order1Id = new ObjectId();
    const order2Id = new ObjectId();

    const orders = [
      {
        _id: order1Id,
        quantity: 50,
        totalPrice: 50 * 10.5,
        status: "PENDING_PAYMENT",
        deliveryAddress: "123 Main St, Springfield",
        buyerId: aliceId.toString(),
        cropId: wheatId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: order2Id,
        quantity: 100,
        totalPrice: 100 * 8.75,
        status: "PAYMENT_RECEIVED",
        deliveryAddress: "123 Main St, Springfield",
        paymentProof: "https://example.com/payment-proof.jpg",
        buyerId: aliceId.toString(),
        cropId: cornId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("Order").insertMany(orders);
    console.log("Orders created successfully");

    // Create delivery
    console.log("Creating delivery...");
    const deliveryId = new ObjectId();
    await db.collection("Delivery").insertOne({
      _id: deliveryId,
      status: "ACCEPTED",
      pickupDate: new Date("2023-10-01T08:00:00Z"),
      deliveryDate: new Date("2023-10-01T12:00:00Z"),
      driverId: charlieId.toString(),
      orderId: order2Id.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Delivery created successfully");

    console.log("Database seeded successfully!");
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
