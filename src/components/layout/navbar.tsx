"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { Leaf, Search, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import UserDropdown from "./user-dropdown";
import { ModeToggle } from "../ui/modeToggle";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      router.push(`/crops?q=${encodeURIComponent(query)}`);
    }
  };

  const navLinks = [
    { href: "/crops", label: "Browse Crops" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg text-primary">Cropmate</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden sm:block flex-1 max-w-md mx-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              type="search"
              placeholder="Search crops..."
              className="pl-8 w-full bg-background border-muted focus-visible:ring-primary/20"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <ModeToggle />
          {session ? (
            <UserDropdown user={session.user} />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push("/crops")}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile menu button */}
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[95vh]">
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      <DrawerTitle className="text-lg font-bold text-primary">
                        Cropmate
                      </DrawerTitle>
                    </div>
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
                </DrawerHeader>
                <Separator className="my-2" />

                {/* Mobile Navigation Links */}
                <div className="px-4 py-4">
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsDrawerOpen(false)}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          pathname === link.href
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Search Form */}
                  <div className="mt-6">
                    <form
                      onSubmit={(e) => {
                        handleSearch(e);
                        setIsDrawerOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          name="search"
                          type="search"
                          placeholder="Search crops..."
                          className="pl-9"
                        />
                      </div>
                      <Button type="submit" size="sm">
                        Search
                      </Button>
                    </form>
                  </div>

                  {/* Mobile Auth Buttons */}
                  {!session && (
                    <div className="flex flex-col gap-2 mt-6">
                      <Button asChild size="sm">
                        <Link
                          href="/register"
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          Register
                        </Link>
                      </Button>
                      <Button variant="outline" asChild size="sm">
                        <Link
                          href="/login"
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          Login
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* User Dashboard Link */}
                  {session && (
                    <div className="mt-6">
                      <Button asChild className="w-full" size="sm">
                        <Link
                          href={`/dashboard/${session.user.role?.toLowerCase()}`}
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
