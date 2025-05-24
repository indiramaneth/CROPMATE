"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDeliveryRequest } from "@/lib/actions/delivery.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface RequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryId: string;
  cropName: string;
}

export function RequestFormModal({
  isOpen,
  onClose,
  deliveryId,
  cropName,
}: RequestFormModalProps) {
  const router = useRouter();
  const [customFee, setCustomFee] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (customFee <= 0) {
        toast.error("Please enter a valid delivery fee");
        return;
      }

      await createDeliveryRequest({
        deliveryId,
        customFee,
        message,
      });

      toast.success("Delivery request sent successfully", {
        description: "The customer will be notified of your offer",
      });

      onClose();
      router.refresh();
    } catch (error) {
      toast.error("Failed to send request", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Delivery Request</DialogTitle>
          <DialogDescription>
            Propose your delivery fee for delivering &quot;{cropName}&quot;
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="fee">Your Delivery Fee ($)</Label>
            <Input
              id="fee"
              type="number"
              step="0.01"
              min="0"
              value={customFee || ""}
              onChange={(e) => setCustomFee(parseFloat(e.target.value))}
              placeholder="Enter your delivery fee"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the amount you want to charge for this delivery
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any details about your delivery service"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
