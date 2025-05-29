'use client';

import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: "primary" | "secondary";
}

export function LoadingIndicator({ 
  size = "md", 
  className,
  color = "secondary" 
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const colorClasses = {
    primary: "text-[#1E40AF]",
    secondary: "text-[#3B82F6]"
  };

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading application"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
} 