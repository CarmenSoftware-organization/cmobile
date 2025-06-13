"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, CheckCircle, ShoppingCart, ClipboardList, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppBar } from "@/components/ui/appbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/receiving", label: "Receiving", icon: Package, fullLabel: "Receiving" },
  { href: "/pr-approval", label: "Approval", icon: CheckCircle },
  { href: "/store-requisition", label: "Store Req.", icon: ShoppingCart },
  { href: "/stock-take", label: "Stock Take", icon: ClipboardList },
];

function getTitle(pathname: string) {
  // Check exact path matches first
  const match = tabs.find(tab => tab.href === pathname);
  if (match) return match.fullLabel || match.label;
  
  // Check if path starts with any of the tab paths (for sub-pages)
  const parentMatch = tabs.find(tab => pathname.startsWith(tab.href) && tab.href !== "/dashboard");
  if (parentMatch) return parentMatch.fullLabel || parentMatch.label;
  
  // Add specific handling for spot-check path
  if (pathname.startsWith("/spot-check")) return "Spot Check";
  
  // Add specific handling for physical-count path
  if (pathname.startsWith("/physical-count")) return "Physical Count";
  
  // Default title - empty to show only logo
  return "";
}

export default function MobileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const title = getTitle(pathname);
  
  return (
    <div className="min-h-screen flex flex-col bg-background"> 
      <AppBar title={title}>
        <Link href="/notifications" aria-label="Notifications" className="mr-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
        </Link>
        <ThemeToggle />
        <Link href="/profile" aria-label="Profile">
          <User className="w-4 h-4 text-muted-foreground" />
        </Link>
      </AppBar>
      <main className="flex-1 pt-14 pb-16">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around items-center h-16 shadow-sm">
        {tabs.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs px-2 py-1 transition-colors",
              pathname === href || pathname.startsWith(href + "/") ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
            aria-label={href === "/dashboard" ? "Home" : label}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
} 