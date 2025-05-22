"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function Filters({ onApply }: { onApply?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 1000,
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams.toString());

    formData.forEach((value, key) => {
      if (value) {
        if (key === "category" && value === "all") {
          params.delete(key);
        } else {
          params.set(key, value.toString());
        }
      } else {
        params.delete(key);
      }
    });

    router.push(`/crops?${params.toString()}`);
    if (onApply) onApply();
  };

  const clearFilters = () => {
    router.push("/crops");
    if (onApply) onApply();
  };

  const handleSliderChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);

    if (minInputRef.current) {
      minInputRef.current.value = value[0].toString();
    }

    if (maxInputRef.current) {
      maxInputRef.current.value = value[1].toString();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <Select
          name="category"
          defaultValue={searchParams.get("category") || ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="fruits">Fruits</SelectItem>
            <SelectItem value="grains">Grains</SelectItem>
            <SelectItem value="legumes">Legumes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="font-medium mb-3">Price range</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="w-full flex items-center space-x-2">
              <Input
                name="minPrice"
                type="number"
                placeholder="Min"
                defaultValue={searchParams.get("minPrice") || ""}
                className="w-full"
                ref={minInputRef}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setPriceRange([value, priceRange[1]]);
                }}
              />
              <span className="text-muted-foreground sm:hidden">to</span>
            </div>
            <span className="hidden sm:block text-muted-foreground">to</span>
            <Input
              name="maxPrice"
              type="number"
              placeholder="Max"
              defaultValue={searchParams.get("maxPrice") || ""}
              className="w-full"
              ref={maxInputRef}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPriceRange([priceRange[0], value]);
              }}
            />
          </div>
          <Slider
            defaultValue={[0, 1000]}
            value={priceRange}
            min={0}
            max={1000}
            step={10}
            minStepsBetweenThumbs={1}
            onValueChange={handleSliderChange}
            className="mt-6"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>$0</span>
            <span>$500</span>
            <span>$1000</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-3">Location</h3>
        <Input
          name="location"
          placeholder="City or region"
          defaultValue={searchParams.get("location") || ""}
        />
      </div>{" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
        <Button type="submit" className="w-full cursor-pointer">
          Apply filters
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          className="w-full cursor-pointer"
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
