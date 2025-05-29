import * as React from "react";
import Link from "next/link";

export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  // Size classes mapping
  const sizeClasses = {
    small: "h-6",
    default: "h-8",
    large: "h-10"
  };
  
  return (
    <Link href="/dashboard" className="flex items-center">
      <div className={`font-bold text-primary flex items-center ${sizeClasses[size]}`}>
        <span className="bg-primary text-white px-1.5 rounded-l-md h-full flex items-center">
          Carmen
        </span>
        <span className="text-primary border-y border-r border-primary px-1.5 rounded-r-md h-full flex items-center">
          Supply
        </span>
      </div>
    </Link>
  );
} 