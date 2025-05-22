import CropsTable from "@/components/dashboard/farmer/crops-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getFarmerCrops } from "@/lib/actions/crop.actions";
import Link from "next/link";
import { Leaf, Plus } from "lucide-react";

export default async function FarmerCropsPage() {
  const crops = await getFarmerCrops({});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="h-4 w-4 text-primary" />
            </span>
            My Crops
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your crop listings and inventory
          </p>
        </div>
        <Button asChild className="sm:self-start">
          <Link
            href="/dashboard/farmer/crops/new"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Crop
          </Link>
        </Button>
      </div>

      <Card className="border-green-100 dark:border-green-900/30 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Crop Inventory</CardTitle>
          <CardDescription>
            {crops.length > 0
              ? `You have ${crops.length} crop${
                  crops.length === 1 ? "" : "s"
                } listed for sale`
              : "You haven't listed any crops yet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CropsTable crops={crops} />
        </CardContent>
      </Card>
    </div>
  );
}
