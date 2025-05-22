"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { confirmPayment, rejectPayment } from "@/lib/actions/order.actions";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface PaymentProofModalProps {
  orderId: string;
  paymentProof?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farmerPayment?: number;
  totalPrice?: number;
}

export function PaymentProofModal({
  orderId,
  paymentProof,
  open,
  onOpenChange,
  farmerPayment = 0,
  totalPrice = 0,
}: PaymentProofModalProps) {
  const router = useRouter();
  console.log("Payment proof:", paymentProof);
  console.log("Payment proof type:", typeof paymentProof);
  console.log(
    "Payment proof empty check:",
    !paymentProof || paymentProof.trim() === ""
  );
  console.log("Total price:", totalPrice);
  console.log("Farmer payment:", farmerPayment);

  const handleConfirm = async () => {
    try {
      await confirmPayment(orderId);
      toast.success("Payment confirmed", {
        description: "Order status updated to Payment Received",
      });
      router.refresh();
    } catch (error) {
      toast.error("Failed to confirm payment", {
        description: "An error occurred while confirming the payment",
      });
    }
    onOpenChange(false);
  };

  const handleReject = async () => {
    try {
      await rejectPayment(orderId);
      toast.error("Payment rejected", {
        description: "Order status set back to Pending Payment",
      });
      router.refresh();
    } catch (error) {
      toast.error("Failed to reject payment", {
        description: "An error occurred while rejecting the payment",
      });
    }
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {" "}
      <DialogContent className="sm:max-w-[700px]">
        {" "}
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">
            Payment Proof Review
          </DialogTitle>
          <DialogDescription>
            {farmerPayment > 0
              ? "Please review the payment details before confirming or rejecting."
              : "Please verify the payment proof image before confirming or rejecting the payment."}
          </DialogDescription>
        </DialogHeader>
        {farmerPayment > 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 border rounded-lg bg-gray-50 h-[300px]">
            <div className="text-4xl font-bold text-green-600">
              {totalPrice > 0 ? formatCurrency(totalPrice) : "Payment Received"}
            </div>
            <div className="text-xl">
              <p>You will receive:</p>
              <p className="font-bold text-2xl text-green-600 mt-2">
                {formatCurrency(farmerPayment)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                (85% of total payment)
              </p>
            </div>
            <p className="text-gray-600">
              The customer has submitted a payment. Please confirm receipt of
              this payment to proceed with the order.
            </p>
          </div>
        ) : paymentProof && paymentProof.trim() !== "" ? (
          <div className="relative h-[450px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src={paymentProof}
              alt="Payment proof"
              fill
              className="object-contain bg-gray-50"
              quality={100}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 border rounded-lg bg-gray-50 h-[300px]">
            <div className="text-4xl font-bold text-green-600">
              Payment Pending
            </div>
            <p className="text-gray-600">
              No payment proof or payment information is available.
            </p>
          </div>
        )}
        <div className="flex justify-end gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6"
          >
            Close
          </Button>
          <Button variant="destructive" onClick={handleReject} className="px-6">
            Reject Payment
          </Button>
          <Button onClick={handleConfirm} className="px-6">
            Confirm Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
