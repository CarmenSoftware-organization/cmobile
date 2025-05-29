import * as React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function AppBar({ title, children, className = "", showLogo = true }: { 
  title: string; 
  children?: React.ReactNode; 
  className?: string;
  showLogo?: boolean;
}) {
  return (
    <header className={cn("fixed top-0 left-0 right-0 z-40 bg-card border-b border-border h-14 flex items-center px-4 shadow-sm", className)}>
      {showLogo && (
        <div className={title ? "mr-3" : "flex-1 flex justify-center"}>
          <Logo size="small" />
        </div>
      )}
      {title && <h1 className="text-lg font-bold flex-1 truncate text-foreground">{title}</h1>}
      {children && <div className="ml-2 flex items-center gap-2">{children}</div>}
    </header>
  );
} 