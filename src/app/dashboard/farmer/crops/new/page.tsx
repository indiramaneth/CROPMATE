import CropForm from "@/components/crops/crop-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createCrop } from "@/lib/actions/crop.actions";
import Link from "next/link";
import { ChevronLeft, HelpCircle, Leaf } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NewCropPage() {
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
            <h1 className="text-2xl font-bold">Add New Crop</h1>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Add details about your crop to list it on the marketplace
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
            Provide accurate information to help customers find your produce
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <CropForm
            action={createCrop}
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
            • Include clear, high-quality images of your crops to attract more
            buyers
          </p>
          <p className="text-sm text-green-700 dark:text-green-400">
            • Set competitive prices by checking similar products in the
            marketplace
          </p>
          <p className="text-sm text-green-700 dark:text-green-400">
            • Add detailed descriptions including variety, growing methods, and
            freshness
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
