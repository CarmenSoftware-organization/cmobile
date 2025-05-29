'use client';

import { cn } from "@/lib/utils";

interface CarmenLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CarmenLogo({ size = "md", className }: CarmenLogoProps) {
  const sizeClasses = {
    sm: "w-24 h-auto",
    md: "w-32 h-auto",
    lg: "w-50 h-auto"
  };

  return (
    <div 
      className={cn("flex items-center justify-center", className)}
      role="img"
      aria-label="Carmen Software Logo"
    >
      {/* Carmen Software Logo SVG */}
      <svg
        viewBox="0 0 200 60"
        className={cn(sizeClasses[size], "text-[#1E40AF]")}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Carmen Logo Design */}
        <rect x="0" y="0" width="200" height="60" fill="none" />
        
        {/* "C" Letter */}
        <path d="M20 15 C10 15, 5 20, 5 30 C5 40, 10 45, 20 45 L25 45 L25 40 L20 40 C15 40, 12 37, 12 30 C12 23, 15 20, 20 20 L25 20 L25 15 Z" />
        
        {/* "A" Letter */}
        <path d="M35 45 L30 45 L32 40 L42 40 L44 45 L49 45 L40 15 L34 15 Z M34 35 L37 25 L40 35 Z" />
        
        {/* "R" Letter */}
        <path d="M55 15 L55 45 L60 45 L60 32 L65 32 L70 45 L75 45 L69 31 C72 29, 74 26, 74 22 C74 17, 71 15, 66 15 Z M60 20 L66 20 C68 20, 69 21, 69 22 C69 24, 68 27, 66 27 L60 27 Z" />
        
        {/* "M" Letter */}
        <path d="M85 15 L85 45 L90 45 L90 25 L95 40 L100 40 L105 25 L105 45 L110 45 L110 15 L102 15 L97.5 32 L93 15 Z" />
        
        {/* "E" Letter */}
        <path d="M120 15 L120 45 L140 45 L140 40 L125 40 L125 32 L138 32 L138 27 L125 27 L125 20 L140 20 L140 15 Z" />
        
        {/* "N" Letter */}
        <path d="M150 15 L150 45 L155 45 L155 25 L170 45 L175 45 L175 15 L170 15 L170 35 L155 15 Z" />
        
        {/* Supply Chain Icon */}
        <circle cx="185" cy="25" r="3" />
        <circle cx="185" cy="35" r="3" />
        <line x1="185" y1="28" x2="185" y2="32" strokeWidth="2" stroke="currentColor" />
      </svg>
    </div>
  );
} 