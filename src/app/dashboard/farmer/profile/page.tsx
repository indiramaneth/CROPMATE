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
import { getCurrentUser } from "@/lib/actions/user.actions";
import { User, Building2, Landmark } from "lucide-react";

export default async function FarmerProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Farmer Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal and payment information
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-green-100 dark:border-green-900/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Personal Information</CardTitle>
          </div>
          <CardDescription>Your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user?.name || ""} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user?.email || ""} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Farm Address</Label>
            <Input id="address" defaultValue={user?.address || ""} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-green-100 dark:border-green-900/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            <CardTitle>Bank Details</CardTitle>
          </div>
          <CardDescription>
            Required for receiving payments from customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                defaultValue={user?.bankDetails?.accountName || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                defaultValue={user?.bankDetails?.accountNumber || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                defaultValue={user?.bankDetails?.bankName || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch (Optional)</Label>
              <Input
                id="branch"
                defaultValue={user?.bankDetails?.branch || ""}
              />
            </div>
          </div>

          <Button className="mt-6 w-full sm:w-auto">Update Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
