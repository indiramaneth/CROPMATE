import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2 } from "lucide-react";
import CropList from "@/components/crops/crop-list";
import Filters from "@/components/crops/filters";
import { CropSearchParams } from "@/types";
import { Badge } from "@/components/ui/badge";
import MobileFilters from "@/components/crops/mobile-filters";

const CropsPage = async ({
  searchParams,
}: {
  searchParams: Promise<CropSearchParams>;
}) => {
  const params = await searchParams;
  const searchQuery = params?.q ?? "";

  // Calculate active filters for display
  const activeFilterCount = Object.keys(params).filter(
    (key) => key !== "q" && params[key as keyof CropSearchParams]
  ).length;

  return (
    <div className="container min-h-screen py-4 sm:py-8 mx-auto px-4 sm:px-6">
      {/* Hero section with improved styling */}
      <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 p-4 sm:p-8 mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground text-base sm:text-lg mt-2 max-w-2xl">
          Browse fresh, locally-grown produce directly from farmers in your area
        </p>
      </div>

      {/* Mobile filters button - only visible on mobile */}
      <div className="block md:hidden mb-4">
        <MobileFilters activeFilterCount={activeFilterCount}>
          <Filters />
        </MobileFilters>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar - hidden on mobile */}
        <div className="hidden md:block md:w-1/4">
          <Card className="p-6 sticky top-4 shadow-sm border-green-100 dark:border-green-900/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </h2>
            </div>
            <Filters />
          </Card>
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          {/* Search bar with improved visual design */}
          <div className="mb-6">
            <form className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search crops..."
                  className="pl-8 h-10 sm:h-11 border-green-100 dark:border-green-900/30"
                  defaultValue={searchQuery}
                />
              </div>
              <Button
                type="submit"
                className="h-10 sm:h-11 px-4 sm:px-6 bg-green-600 hover:bg-green-700 cursor-pointer"
              >
                Search
              </Button>
            </form>
          </div>

          {/* Results with improved loading state */}
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-10 sm:py-20">
                <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
                <p className="text-muted-foreground">
                  Loading available crops...
                </p>
              </div>
            }
          >
            <CropList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CropsPage;
