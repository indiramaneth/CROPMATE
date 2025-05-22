"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { usePWAInstall } from "./install-context";

export function PhoneInstallButton() {
  const { isInstallable, isInstalled, handleInstallClick } = usePWAInstall();

  // For a better user experience in the mockup, always show the button
  // but disable it if it's not installable or already installed
  const isDisabled = !isInstallable || isInstalled;

  return (
    <Button
      size="sm"
      className="gap-2"
      onClick={handleInstallClick}
      disabled={isDisabled}
    >
      <Download className="h-4 w-4" />
      Install Now
    </Button>
  );
}
