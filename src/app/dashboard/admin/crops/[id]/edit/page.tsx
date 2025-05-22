import CropForm from "@/components/crops/crop-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminUpdateCrop } from "@/lib/actions/admin.actions";
import { getCropById } from "@/lib/actions/crop.actions";
import Link from "next/link";
import { ChevronLeft, HelpCircle, Leaf, Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CropCategory } from "@/app/generated/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

const AdminEditCropPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const crop = await getCropById(id);

  if (!crop) {
    notFound();
  }

  // Function to handle form submission - wraps adminUpdateCrop for the CropForm component
  const handleAdminUpdate = async (formData: FormData) => {
    "use server";

    // Get category as string and convert to proper enum value
    const categoryString = formData.get("category") as string;
    const category = categoryString as CropCategory;

    return adminUpdateCrop(id, {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || "",
      category,
      pricePerUnit: Number(formData.get("pricePerUnit")),
      availableQuantity: Number(formData.get("availableQuantity")),
      unit: formData.get("unit") as string,
      harvestDate: new Date(formData.get("harvestDate") as string),
      location: formData.get("location") as string,
    });
  };

  const defaultValues = {
    name: crop.name,
    description: crop.description ?? undefined,
    category: crop.category,
    pricePerUnit: crop.pricePerUnit,
    availableQuantity: crop.availableQuantity,
    unit: crop.unit,
    harvestDate: crop.harvestDate,
    location: crop.location,
    existingImage: crop.imageUrl ?? undefined,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Improved header with breadcrumb-style navigation */}
      <div className="flex flex-col space-y-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-fit flex items-center text-muted-foreground"
        >
          <Link href="/dashboard/admin/crops">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to crops
          </Link>
        </Button>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Admin Edit Crop</h1>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Edit crop details as an administrator
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Farmer info badge */}
        <div className="mt-2">
          <Badge
            variant="outline"
            className="text-xs flex items-center gap-1 pl-1.5"
          >
            <Leaf className="h-3 w-3 text-primary" />
            Managed by farmer: {crop.farmer.name}
          </Badge>
        </div>
      </div>

      <Card className="border-primary-100 dark:border-primary-900/30 shadow-md">
        <CardHeader className="pb-4 border-b">
          <CardTitle>Crop Information</CardTitle>
          <CardDescription>
            Make administrative changes to this crop listing
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <CropForm
            action={handleAdminUpdate}
            defaultValues={defaultValues}
            successRedirect="/dashboard/admin/crops"
          />
        </CardContent>
      </Card>

      {/* Admin notes section */}
      <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-400 text-lg">
            Admin Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            • Changes made here will immediately affect the farmer's listing
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            • The system will log all administrative changes to crops
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            • Remember to check availability and pricing carefully before saving
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEditCropPage;
