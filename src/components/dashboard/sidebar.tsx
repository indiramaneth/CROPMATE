"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
  Home,
  Package,
  ShoppingCart,
  Truck,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Leaf,
  ArrowLeft,
  Menu,
  X,
  DollarSign,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { DashboardSidebarProps } from "@/types";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Custom hook for media query
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check if the screen is mobile sized
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Auto-collapse sidebar on mobile screens
  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    } else {
      setExpanded(true);
      setMobileOpen(false);
    }
  }, [isMobile]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const customerLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/customer",
      icon: Home,
    },
    {
      name: "My Orders",
      href: "/dashboard/customer/orders",
      icon: ShoppingCart,
    },
    {
      name: "Profile",
      href: "/dashboard/customer/profile",
      icon: User,
    },
  ];
  const farmerLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/farmer",
      icon: Home,
    },
    {
      name: "My Crops",
      href: "/dashboard/farmer/crops",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/dashboard/farmer/orders",
      icon: ShoppingCart,
    },
    {
      name: "Earnings",
      href: "/dashboard/farmer/earnings",
      icon: DollarSign,
    },
    {
      name: "Profile",
      href: "/dashboard/farmer/profile",
      icon: User,
    },
  ];
  const driverLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/driver",
      icon: Home,
    },
    {
      name: "Deliveries",
      href: "/dashboard/driver/deliveries",
      icon: Truck,
    },
    {
      name: "Earnings",
      href: "/dashboard/driver/earnings",
      icon: DollarSign,
    },
    {
      name: "Profile",
      href: "/dashboard/driver/profile",
      icon: User,
    },
  ];
  const adminLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/admin",
      icon: Home,
    },
    {
      name: "Users",
      href: "/dashboard/admin/users",
      icon: User,
    },
    {
      name: "Crops",
      href: "/dashboard/admin/crops",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/dashboard/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Deliveries",
      href: "/dashboard/admin/deliveries",
      icon: Truck,
    },
    {
      name: "Earnings",
      href: "/dashboard/admin/earnings",
      icon: DollarSign,
    },
    {
      name: "Driver Commissions",
      href: "/dashboard/admin/driver-commissions",
      icon: DollarSign,
    },
  ];

  const links =
    role === "FARMER"
      ? farmerLinks
      : role === "DRIVER"
      ? driverLinks
      : role === "ADMIN"
      ? adminLinks
      : customerLinks;

  const commonLinks = [
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const roleLabel =
    role === "FARMER"
      ? "Farmer"
      : role === "DRIVER"
      ? "Driver"
      : role === "ADMIN"
      ? "Admin"
      : "Customer";

  return (
    <>
      {/* Mobile Menu Toggle Button (visible only on mobile) */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r shadow-xl md:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center justify-between border-b px-4">
                  <div className="flex items-center gap-2 font-semibold">
                    <Leaf className="h-6 w-6 text-primary" />
                    <span className="text-primary text-lg font-bold">
                      Cropmate
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="px-3 py-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{roleLabel}</p>
                      <p className="text-xs text-muted-foreground">Account</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <div className="px-2 pb-2">
                    <Link
                      href="/"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Home</span>
                    </Link>
                  </div>

                  <nav className="grid gap-1 px-2 py-3">
                    {links.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                          pathname === link.href
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-6">
                    <div className="px-4 mb-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        SETTINGS
                      </p>
                    </div>
                    <nav className="grid gap-1 px-2">
                      {commonLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                            pathname === link.href
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          <link.icon className="h-4 w-4" />
                          {link.name}
                        </Link>
                      ))}

                      <Button
                        variant="ghost"
                        className="justify-start gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (hidden on mobile when drawer is open) */}
      <div
        className={cn(
          "h-screen transition-all duration-300 shadow-sm",
          expanded ? "w-64" : "w-20",
          isMobile ? "fixed left-0 top-0 -translate-x-full" : "sticky top-0",
          isMobile && mobileOpen ? "translate-x-0" : "",
          "border-r bg-card z-30"
        )}
      >
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center gap-2 font-semibold">
              <Leaf className="h-6 w-6 text-primary" />
              {expanded && (
                <span className="text-primary text-lg font-bold">Cropmate</span>
              )}
            </div>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpanded(!expanded)}
                className="ml-auto rounded-full h-8 w-8 cursor-pointer"
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    !expanded && "rotate-180"
                  )}
                />
              </Button>
            )}
          </div>

          <div className="px-2 pt-2">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all",
                !expanded && "justify-center"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              {expanded && <span>Back to Home</span>}
            </Link>
          </div>

          <div className={cn("px-3 pt-6", expanded && "px-4")}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              {expanded && (
                <div>
                  <p className="font-medium text-sm">{roleLabel}</p>
                  <p className="text-xs text-muted-foreground">Account</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <nav className="grid gap-1 px-2 py-3">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                    pathname === link.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    !expanded && "justify-center"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {expanded && link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-6">
              <div className={cn("px-3 mb-2", expanded && "px-4")}>
                {expanded && (
                  <p className="text-xs font-medium text-muted-foreground">
                    SETTINGS
                  </p>
                )}
              </div>
              <nav className="grid gap-1 px-2">
                {commonLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                      pathname === link.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      !expanded && "justify-center"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {expanded && link.name}
                  </Link>
                ))}

                <Button
                  variant="ghost"
                  className={cn(
                    "justify-start gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer",
                    !expanded && "justify-center"
                  )}
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4" />
                  {expanded && "Sign Out"}
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
