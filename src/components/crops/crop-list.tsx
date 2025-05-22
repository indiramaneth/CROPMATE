import { Crop } from "@/app/generated/prisma";
import { getCrops } from "@/lib/actions/crop.actions";
import Link from "next/link";
import { Card } from "../ui/card";
import Image from "next/image";
import { CropSearchParams } from "@/types";
import { Badge } from "../ui/badge";

export default async function CropList({
  searchParams,
}: {
  searchParams: Promise<CropSearchParams>;
}) {
  const params = await searchParams;
  const crops = await getCrops(params);

  if (crops.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No crops found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {crops.map((crop) => (
        <CropCard key={crop.id} crop={crop} />
      ))}
    </div>
  );
}

function CropCard({ crop }: { crop: Crop }) {
  return (
    <Link href={`/crops/${crop.id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-green-100 dark:border-green-900/30 h-full flex flex-col">
        <div className="relative h-44 sm:h-52 w-full">
          <Image
            src={crop.imageUrl || "/crop-placeholder.jpg"}
            alt={crop.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <Badge className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">
              {crop.category}
            </Badge>
          </div>
        </div>
        <div className="p-3 sm:p-5 flex flex-col flex-grow">
          <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1">
            {crop.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-4 flex-grow">
            {crop.description || "Fresh produce from local farmers"}
          </p>

          <div className="pt-2 sm:pt-3 border-t flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 xs:gap-0">
            <span className="font-bold text-green-700 dark:text-green-500 text-base sm:text-lg">
              ${crop.pricePerUnit}/{crop.unit}
            </span>
            <span className="text-xs sm:text-sm bg-green-50 dark:bg-green-900/20 py-1 px-2 rounded whitespace-nowrap">
              {crop.availableQuantity} {crop.unit} available
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
