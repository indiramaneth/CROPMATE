import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Leaf } from "lucide-react";

export const metadata = {
  title: "Offline | CropMate",
  description: "You are currently offline",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-md">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Leaf className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">You're offline</h1>
        <p className="text-muted-foreground">
          It looks like you're not connected to the internet. Check your
          connection and try again.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/">Try Again</Link>
        </Button>
      </div>
    </div>
  );
}
