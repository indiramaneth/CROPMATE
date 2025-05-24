import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["CUSTOMER", "FARMER", "DRIVER", "ADMIN"]),
});

export const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    role: z.enum(["CUSTOMER", "FARMER", "DRIVER", "ADMIN"]),
    address: z.string().min(10),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
    if (data.role === "FARMER" || data.role === "DRIVER") {
      if (!data.accountName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Account name is required for ${data.role.toLowerCase()}s`,
          path: ["accountName"],
        });
      }
      if (!data.accountNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Account number is required for ${data.role.toLowerCase()}s`,
          path: ["accountNumber"],
        });
      }
      if (!data.bankName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Bank name is required for ${data.role.toLowerCase()}s`,
          path: ["bankName"],
        });
      }
    }
  });

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageSchema = z
  .instanceof(File)
  .optional()
  .refine(
    (file) => !file || (file && file.size <= MAX_FILE_SIZE),
    "Max image size is 5MB."
  )
  .refine(
    (file) => !file || (file && ACCEPTED_IMAGE_TYPES.includes(file.type)),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  );

export const cropSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.enum(["vegetables", "fruits", "grains", "legumes"]),
  pricePerUnit: z.number().min(0),
  availableQuantity: z.number().min(0),
  unit: z.string().min(1),
  harvestDate: z.date(),
  location: z.string().min(2),
  image: imageSchema,
  existingImage: z.string().optional(),
});

export const orderSchema = z.object({
  quantity: z.number().min(1),
  deliveryAddress: z.string().min(10),
});

export const deliverySchema = z.object({
  pickupDate: z.date().optional(),
  deliveryDate: z.date().optional(),
  status: z.enum([
    "PENDING",
    "ACCEPTED",
    "PICKED_UP",
    "IN_TRANSIT",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export const deliveryRequestSchema = z.object({
  deliveryId: z.string().min(1),
  customFee: z.number().min(0),
  message: z.string().optional(),
});
