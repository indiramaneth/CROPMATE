"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { usePWAInstall } from "./install-context";

export function InstallPWA() {
  const { isInstallable, isInstalled, handleInstallClick } = usePWAInstall();

  if (!isInstallable || isInstalled) return null;

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
}
