"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ui/modeToggle";
import {
  Bell,
  Key,
  Paintbrush,
  Save,
  Trash,
  User,
  type LucideIcon,
} from "lucide-react";

const Icons = {
  bell: Bell,
  key: Key,
  paintbrush: Paintbrush,
  save: Save,
  trash: Trash,
  user: User,
} satisfies Record<string, LucideIcon>;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="container px-4 sm:px-6 max-w-4xl mx-auto space-y-6 md:space-y-8 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account preferences and settings.
          </p>
        </div>
        <ModeToggle />
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Icons.bell className="h-4 w-4 sm:h-5 sm:w-5" />
            Notifications
          </CardTitle>
          <CardDescription className="text-sm">
            Configure how you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="space-y-0.5">
              <Label
                className="text-sm sm:text-base"
                htmlFor="email-notifications"
              >
                Email notifications
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Receive email notifications for updates and alerts
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked={true} />
          </div>
          <Separator className="my-2 sm:my-4" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm sm:text-base" htmlFor="marketing">
                Marketing emails
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Receive emails about new features and promotions
              </p>
            </div>
            <Switch id="marketing" defaultChecked={false} />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Icons.paintbrush className="h-4 w-4 sm:h-5 sm:w-5" />
            Appearance
          </CardTitle>
          <CardDescription className="text-sm">
            Customize the appearance of the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="space-y-0.5">
              <Label className="text-sm sm:text-base" htmlFor="theme">
                Dark mode
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
            {mounted && (
              <Switch
                id="theme"
                checked={theme === "dark"}
                onCheckedChange={handleThemeChange}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Icons.user className="h-4 w-4 sm:h-5 sm:w-5" />
            Account
          </CardTitle>
          <CardDescription className="text-sm">
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <Button variant="outline" className="w-full">
              <Icons.key className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            <Button variant="destructive" className="w-full">
              <Icons.trash className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" className="w-full sm:w-auto">
          <Icons.save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
