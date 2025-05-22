"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cropSchema } from "@/lib/schemas";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AlertCircle, CalendarIcon, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";

interface CropFormProps {
  action: (values: FormData) => Promise<{
    errors?: Record<string, string[]> | undefined;
    message?: string;
    error?: string;
  }>;
  defaultValues?: Partial<z.infer<typeof cropSchema>> & { imageUrl?: string };
  successRedirect: string;
}

const CropForm = ({
  action,
  defaultValues,
  successRedirect,
}: CropFormProps) => {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(
    defaultValues?.existingImage || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof cropSchema>>({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || "vegetables",
      pricePerUnit: defaultValues?.pricePerUnit || 0,
      availableQuantity: defaultValues?.availableQuantity || 0,
      unit: defaultValues?.unit || "kg",
      harvestDate: defaultValues?.harvestDate || new Date(),
      location: defaultValues?.location || "",
      existingImage: defaultValues?.existingImage || undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      form.setValue("image", file);
      form.clearErrors("image");
    }
  };

  async function onSubmit(values: z.infer<typeof cropSchema>) {
    try {
      setIsSubmitting(true);
      setFormError(null);
      const formData = new FormData();

      // Append basic form fields
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("category", values.category);
      formData.append("pricePerUnit", values.pricePerUnit.toString());
      formData.append("availableQuantity", values.availableQuantity.toString());
      formData.append("unit", values.unit);
      formData.append("harvestDate", values.harvestDate.toISOString());
      formData.append("location", values.location);

      // Handle image properly
      if (values.image instanceof File) {
        formData.append("image", values.image);
      } else if (values.existingImage) {
        formData.append("existingImage", values.existingImage);
      }

      const result = await action(formData);

      if (result.errors || result.error) {
        const errorMessage = result.errors
          ? Object.values(result.errors).flat().join(", ")
          : result.message || "An unknown error occurred";

        setFormError(errorMessage);
        toast.error("Failed to create crop", {
          description: errorMessage,
        });
        return;
      }

      toast.success("Success", {
        description: result.message || "Crop added successfully",
      });
      router.push(successRedirect);
    } catch (error) {
      console.error("Submission error:", error);
      setFormError("Failed to create crop. Please try again.");
      toast.error("Error", {
        description: "Failed to create crop. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Crop Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Crop Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Organic Tomatoes"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="grains">Grains</SelectItem>
                      <SelectItem value="legumes">Legumes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="pricePerUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Price per Unit *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8 h-10"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Location *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Farm location or address"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Quantity and Unit in a single row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="availableQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Available Quantity *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="100"
                        className="h-10"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unit */}
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Unit *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="lb">Pound (lb)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                        <SelectItem value="oz">Ounce (oz)</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="bunch">Bunch</SelectItem>
                        <SelectItem value="crate">Crate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Harvest Date */}
            <FormField
              control={form.control}
              name="harvestDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base">Harvest Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="h-10 pl-3 text-left font-normal w-full justify-start"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-xs">
                    When was this crop harvested?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your crop (variety, quality, organic status, etc.)"
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Image Upload - Full Width */}
        <div className="border-t pt-6">
          <h3 className="text-base font-medium mb-4">Crop Image</h3>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {previewImage ? (
              <div className="relative h-56 w-56 rounded-md overflow-hidden border bg-muted/30">
                <Image
                  src={previewImage}
                  alt="Crop preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-56 w-56 rounded-md border flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No image selected
                  </p>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <FormControl>
                <div className="space-y-3">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image"
                    className="inline-flex cursor-pointer items-center justify-center rounded-md border bg-background px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    Choose Image
                  </Label>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Upload a clear image of your crop</p>
                    <p className="text-xs">
                      Supported formats: JPG, PNG (Max: 2MB)
                    </p>
                    {!previewImage && (
                      <p className="text-xs text-amber-700">
                        An image will help your crop listing stand out to buyers
                      </p>
                    )}
                  </div>
                </div>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(successRedirect)}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Crop"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CropForm;
