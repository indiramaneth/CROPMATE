import { Crop, CropCategory } from "@/app/generated/prisma";

export type UserRole = "CUSTOMER" | "FARMER" | "DRIVER" | "ADMIN";

export interface CropSearchParams {
  q?: string;
  category?: CropCategory;
  minPrice?: string;
  maxPrice?: string;
  location?: string;
}

export interface OrderFormProps {
  crop: {
    id: string;
    pricePerUnit: number;
    availableQuantity: number;
    unit: string;
    farmer: {
      bankDetails: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        branch?: string;
      };
    };
  };
}

export interface CreateOrderParams {
  cropId: string;
  quantity: number;
  deliveryAddress: string;
  paymentProof: File;
}

export interface DashboardSidebarProps {
  role: UserRole;
}

export interface StatusBadgeProps {
  status:
    | "PENDING_PAYMENT"
    | "PAYMENT_RECEIVED"
    | "READY_FOR_DELIVERY"
    | "IN_TRANSIT"
    | "DELIVERED"
    | "CANCELLED"
    | "PENDING"
    | "ACCEPTED"
    | "PICKED_UP";
  className?: string;
}

export interface CropsTableProps {
  crop: Crop[];
}
