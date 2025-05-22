"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/lib/schemas";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { Leaf, Mail, Lock, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Component to handle search params with Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  // Update role based on tab
  const updateRole = (newRole: string) => {
    form.setValue(
      "role",
      newRole as "CUSTOMER" | "FARMER" | "DRIVER" | "ADMIN"
    );
  };

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const res = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Login failed", {
          description: res.error,
        });
        return;
      }

      router.push(callbackUrl);
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong",
      });
    }
  }

  return (
    <Card className="w-full max-w-[450px] shadow-lg border-primary/10">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          Welcome to CropMate
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your credentials to sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="CUSTOMER"
          className="mb-6"
          onValueChange={(value) => updateRole(value)}
        >
          <TabsList className="grid grid-cols-4 mb-6">
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
              <Leaf className="h-4 w-4" /> Farmer
            </TabsTrigger>
            <TabsTrigger
              value="DRIVER"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Lock className="h-4 w-4" /> Driver
            </TabsTrigger>
            <TabsTrigger
              value="ADMIN"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Lock className="h-4 w-4" /> Admin
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="your@email.com"
                        {...field}
                        className="pl-10 h-11"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="pl-10 h-11"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-11 mt-2 cursor-pointer">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">
              Don't have an account?
            </span>
          </div>
        </div>

        <Link href="/register">
          <Button variant="outline" className="w-full h-11">
            Create an account
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Missing import for useSearchParams
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-10">
      <Suspense
        fallback={
          <div className="w-full max-w-[450px] h-[600px] flex items-center justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
