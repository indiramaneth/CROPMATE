import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { InstallPWA } from "@/components/pwa/install-button";
import { PWAInstallProvider } from "@/components/pwa/install-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CropMate - Farm to Table Marketplace",
    template: "%s | CropMate",
  },
  description:
    "Connect farmers, vendors, and drivers in a sustainable agricultural marketplace",
  manifest: "/manifest.json",
  themeColor: "#3b8f22",
  appleWebApp: {
    capable: true,
    title: "CropMate",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="CropMate" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CropMate" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b8f22" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script src="/register-sw.js" defer />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <PWAInstallProvider>
              <div className="fixed bottom-4 right-4 z-50">
                <InstallPWA />
              </div>
              {children}
              <Toaster />
            </PWAInstallProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
