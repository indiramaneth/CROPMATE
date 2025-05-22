"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  adminDeleteCrop,
  adminToggleCropAvailability,
} from "@/lib/actions/admin.actions";
import Link from "next/link";
import { toast } from "sonner";

interface CropActionsProps {
  cropId: string;
  cropName: string;
  hasActiveOrders: boolean;
}

export default function CropActions({
  cropId,
  cropName,
  hasActiveOrders,
}: CropActionsProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await adminDeleteCrop(cropId);

      if (result.success) {
        toast.success("Crop deleted", {
          description: `${cropName} has been removed from the marketplace.`,
        });
        router.refresh();
      } else {
        toast.error("Failed to delete crop", {
          description: result.message || "Something went wrong",
        });
      }
    } catch (error) {
      toast.error("Operation failed", {
        description: "There was an error deleting this crop.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleToggleAvailability = async (makeAvailable: boolean) => {
    setIsToggling(true);
    try {
      const result = await adminToggleCropAvailability(cropId, makeAvailable);

      if (result.success) {
        toast.success(
          makeAvailable
            ? "Crop marked as available"
            : "Crop marked as unavailable",
          {
            description: `${cropName} has been ${
              makeAvailable ? "made available" : "made unavailable"
            } in the marketplace.`,
          }
        );
        router.refresh();
      } else {
        toast.error("Failed to update crop", {
          description: result.message || "Something went wrong",
        });
      }
    } catch (error) {
      toast.error("Operation failed", {
        description: "There was an error updating this crop.",
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button asChild size="icon" variant="outline">
          <Link href={`/crops/${cropId}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => router.push(`/dashboard/admin/crops/${cropId}/edit`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setIsDeleteDialogOpen(true)}
          size="icon"
          variant="outline"
          className="text-destructive hover:bg-destructive/10"
          disabled={hasActiveOrders}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Crop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{cropName}</span>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">
              Deleting this crop will remove it entirely from the system.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Crop"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
