"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Mic, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/explain", label: "Explain", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Navigation() {
  const pathname = usePathname();
  const { settings, setSettings } = useSettings();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <nav className="container flex min-h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="text-lg">EduArtha</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground",
                  pathname === link.href && "bg-accent text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSettings({ ...settings, theme: settings.theme === "dark" ? "light" : "dark" })}
        >
          {settings.theme === "dark" ? "Light" : "Dark"}
        </Button>
      </nav>
      <div className="grid grid-cols-3 border-t md:hidden">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-2 text-xs text-muted-foreground",
                pathname === link.href && "text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
