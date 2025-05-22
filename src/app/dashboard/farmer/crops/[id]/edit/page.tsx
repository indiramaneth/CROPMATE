import CropForm from "@/components/crops/crop-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCropById, updateCrop } from "@/lib/actions/crop.actions";
import Link from "next/link";
import { ChevronLeft, HelpCircle, Leaf } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const EditCropPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const crop = await getCropById(id);

  if (!crop) {
    notFound();
  }

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
          <Link href="/dashboard/farmer/crops">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to my crops
          </Link>
        </Button>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Edit Crop</h1>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Update your crop details to keep your listing accurate
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Card className="border-green-100 dark:border-green-900/30 shadow-md">
        <CardHeader className="pb-4 border-b">
          <CardTitle>Crop Information</CardTitle>
          <CardDescription>
            Make changes to your crop listing information
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <CropForm
            action={updateCrop.bind(null, id)}
            defaultValues={defaultValues}
            successRedirect="/dashboard/farmer/crops"
          />
        </CardContent>
      </Card>

      {/* Helpful tips section */}
      <Card className="bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-400 text-lg">
            Tips for Better Listings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-green-700 dark:text-green-400">
            • Keep your crop information up-to-date, especially quantity and
            price
          </p>
          <p className="text-sm text-green-700 dark:text-green-400">
            • Refresh images regularly to show the current condition of your
            crops
          </p>
          <p className="text-sm text-green-700 dark:text-green-400">
            • Add any new certifications or quality improvements to your
            descriptions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCropPage;
