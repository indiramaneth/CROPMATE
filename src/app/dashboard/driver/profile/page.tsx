import { getCurrentUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, MapPin, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function DriverProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="container px-4 sm:px-6 max-w-2xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Driver Profile
        </h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          Manage your personal information and preferences
        </p>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">
            Personal Information
          </CardTitle>
          <CardDescription className="text-sm">
            Your profile information will be displayed publicly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base">
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                defaultValue={user?.name || ""}
                disabled
                className="pl-10 h-10 text-sm sm:text-base"
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                disabled
                className="pl-10 h-10 text-sm sm:text-base"
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <Separator />

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="address" className="text-sm sm:text-base">
              Delivery Address
            </Label>
            <div className="relative">
              <Input
                id="address"
                defaultValue={user?.address || ""}
                placeholder="Enter your delivery address"
                className="pl-10 h-10 text-sm sm:text-base"
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="flex justify-center sm:justify-end w-full mt-4 sm:mt-6">
            <Button size="default" className="w-full sm:w-auto px-4 sm:px-8">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
