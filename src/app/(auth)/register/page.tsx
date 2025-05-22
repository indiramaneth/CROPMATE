"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, User, Building, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/types/index";

const RegisterPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
      address: "",
      accountName: "",
      accountNumber: "",
      bankName: "",
    },
  });

  const role = form.watch("role");

  // Helper function to update role
  const updateRole = (newRole: UserRole) => {
    form.setValue("role", newRole);
  };

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await registerUser(values);
      toast.success("Registration successful", {
        description: "You can now sign in to your account",
      });
      router.push("/login");
    } catch (error: any) {
      toast.error("Registration failed", {
        description: error.message,
      });
    }
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-[600px] shadow-lg border-primary/10">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Join CropMate</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Create an account and start connecting with the agricultural
            community
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="CUSTOMER"
            className="mb-6"
            onValueChange={(value) => updateRole(value as UserRole)}
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger
                value="CUSTOMER"
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="h-4 w-4" /> Customer
              </TabsTrigger>
              <TabsTrigger
                value="FARMER"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Building className="h-4 w-4" /> Farmer
              </TabsTrigger>
              <TabsTrigger
                value="DRIVER"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Truck className="h-4 w-4" /> Driver
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Farm St, Agricultural City"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hidden role field that gets updated via tabs */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>{" "}
                  </FormItem>
                )}
              />

              {(role === "FARMER" || role === "DRIVER") && (
                <div className="space-y-5 pt-2">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <h3 className="text-sm font-medium flex items-center gap-2 text-primary mb-1">
                      {role === "FARMER" ? (
                        <Building className="h-4 w-4" />
                      ) : (
                        <Truck className="h-4 w-4" />
                      )}{" "}
                      {role === "FARMER" ? "Farmer" : "Driver"} Bank Details
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Required for receiving payments{" "}
                      {role === "FARMER" ? "from sales" : "for deliveries"}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="accountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1234567890"
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="National Bank"
                            {...field}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button type="submit" className="w-full h-11 mt-6 cursor-pointer">
                Create Account
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline cursor-pointer"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
