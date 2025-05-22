"use client";

import React, { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "../ui/separator";

interface MobileFiltersProps {
  children: React.ReactElement<{ onApply?: () => void }>;
  activeFilterCount: number;
}

export default function MobileFilters({
  children,
  activeFilterCount,
}: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border border-green-100 dark:border-green-900/30 h-11"
        >
          <Filter className="h-4 w-4" />
          <span>Filter Crops</span>
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 max-h-[85vh]">
        <div className="max-w-md w-full mx-auto">
          <DrawerHeader className="text-left px-0">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-xl font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Crops
              </DrawerTitle>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription className="pt-2">
              Apply filters to find the crops you're looking for
            </DrawerDescription>
          </DrawerHeader>
          <Separator className="my-4" />
          <div className="overflow-y-auto px-0 pb-2">
            {/* Clone the children and add the onApply callback */}
            {React.cloneElement(children, {
              onApply: () => setOpen(false),
            })}
          </div>
          <Separator className="my-4" />
          <DrawerFooter className="flex flex-row gap-3 px-0">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              onClick={() => {
                // Apply filters and close
                setOpen(false);
              }}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Apply Filters
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
