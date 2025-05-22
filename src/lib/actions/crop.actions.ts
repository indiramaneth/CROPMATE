"use server";

import db from "@/lib/db";
import { Prisma } from "@/app/generated/prisma";
import { CropSearchParams } from "@/types";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { cropSchema } from "../schemas";
import { uploadImage } from "../cloudinary";
import { revalidatePath } from "next/cache";

export async function createCrop(formData: FormData) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "FARMER") {
      return {
        error: "Unauthorized: Only farmers can create crops",
        message: "Unauthorized: Only farmers can create crops",
      };
    }

    // Get existingImage value first and handle empty string
    const existingImage = formData.get("existingImage");

    // Parse and validate form data
    const validatedFields = cropSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description") || "",
      category: formData.get("category"),
      pricePerUnit: Number(formData.get("pricePerUnit")),
      availableQuantity: Number(formData.get("availableQuantity")),
      unit: formData.get("unit"),
      harvestDate: new Date(formData.get("harvestDate") as string),
      location: formData.get("location"),
      image: formData.get("image"),
      existingImage: existingImage ? String(existingImage) : undefined,
    });

    console.log(
      "Parsed fields:",
      validatedFields.success ? validatedFields.data : validatedFields.error
    );

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Validation failed",
      };
    }

    let imageUrl = validatedFields.data.existingImage || "";

    const imageFile = validatedFields.data.image;
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        const result = (await uploadImage(imageFile)) as { secure_url: string };
        if (!result.secure_url) {
          throw new Error("Failed to get secure URL from upload");
        }
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        return {
          error: "Image upload failed",
          message: "Failed to upload crop image. Please try again.",
        };
      }
    }

    const crop = await db.crop.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description || "",
        category: validatedFields.data.category,
        pricePerUnit: validatedFields.data.pricePerUnit,
        availableQuantity: validatedFields.data.availableQuantity,
        unit: validatedFields.data.unit,
        harvestDate: validatedFields.data.harvestDate,
        location: validatedFields.data.location,
        imageUrl: imageUrl,
        farmerId: session.user.id,
      },
    });

    revalidatePath("/dashboard/crops");

    return {
      message: "Crop created successfully",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      error: "Database error",
      message: "Failed to create crop. Please try again later.",
    };
  }
}

export async function updateCrop(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "FARMER") {
      return {
        error: "Unauthorized: Only farmers can update crops",
        message: "Unauthorized: Only farmers can update crops",
      };
    }

    // Check if the crop exists and belongs to the current farmer
    const existingCrop = await db.crop.findFirst({
      where: {
        id,
        farmerId: session.user.id,
      },
    });

    if (!existingCrop) {
      return {
        error: "Not found",
        message: "Crop not found or you don't have permission to edit it",
      };
    }

    const existingImage = formData.get("existingImage");

    const imageInput = formData.get("image");
    const validatedFields = cropSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description") || "",
      category: formData.get("category"),
      pricePerUnit: Number(formData.get("pricePerUnit")),
      availableQuantity: Number(formData.get("availableQuantity")),
      unit: formData.get("unit"),
      harvestDate: new Date(formData.get("harvestDate") as string),
      location: formData.get("location"),
      image: imageInput instanceof File ? imageInput : undefined,
      existingImage: existingImage ? String(existingImage) : undefined,
    });

    console.log(
      "Parsed fields for update:",
      validatedFields.success ? validatedFields.data : validatedFields.error
    );

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Validation failed",
      };
    }

    // Handle image processing
    let imageUrl = existingCrop.imageUrl;

    const imageFile = validatedFields.data.image;
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        const result = (await uploadImage(imageFile)) as { secure_url: string };
        if (!result.secure_url) {
          throw new Error("Failed to get secure URL from upload");
        }
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        return {
          error: "Image upload failed",
          message: "Failed to upload crop image. Please try again.",
        };
      }
    }

    // Update the crop in the database
    await db.crop.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description || "",
        category: validatedFields.data.category,
        pricePerUnit: validatedFields.data.pricePerUnit,
        availableQuantity: validatedFields.data.availableQuantity,
        unit: validatedFields.data.unit,
        harvestDate: validatedFields.data.harvestDate,
        location: validatedFields.data.location,
        imageUrl: imageUrl,
      },
    });

    revalidatePath("/dashboard/farmer/crops");

    return {
      message: "Crop updated successfully",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      error: "Database error",
      message: "Failed to update crop. Please try again later.",
    };
  }
}

export async function getCrops(searchParams: CropSearchParams) {
  try {
    const { q, category, minPrice, maxPrice, location } = searchParams;

    const where: Prisma.CropWhereInput = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.pricePerUnit = {};
      if (minPrice) {
        where.pricePerUnit.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.pricePerUnit.lte = parseFloat(maxPrice);
      }
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    const crops = await db.crop.findMany({
      where,
      include: {
        farmer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return crops;
  } catch (error) {
    console.error("Failed to fetch crops:", error);
    throw new Error("Failed to fetch crops");
  }
}

export async function getCropById(id: string) {
  try {
    const crop = await db.crop.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            address: true,
            bankDetails: {
              select: {
                accountName: true,
                bankName: true,
                accountNumber: true,
              },
            },
          },
        },
      },
    });

    if (!crop) {
      notFound();
    }

    return crop;
  } catch (error) {
    console.error(`Failed to fetch crop with ID ${id}:`, error);
    throw new Error("Failed to fetch crop details");
  }
}

export async function getFarmerCrops({ take }: { take?: number }) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  return await db.crop.findMany({
    where: { farmerId: session.user.id },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function deleteCrop(id: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "FARMER") {
      throw new Error("Unauthorized");
    }

    const crop = await db.crop.findFirst({
      where: {
        id,
        farmerId: session.user.id,
      },
    });

    if (!crop) {
      throw new Error(
        "Crop not found or you don't have permission to delete it"
      );
    }

    await db.crop.delete({
      where: {
        id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete crop:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete crop"
    );
  }
}

export async function getRecentCrops({ take = 3 }: { take?: number } = {}) {
  const session = await auth();
  if (!session || session.user.role !== "FARMER") {
    throw new Error("Unauthorized");
  }

  return await db.crop.findMany({
    where: { farmerId: session.user.id },
    orderBy: { createdAt: "desc" },
    take,
  });
}
