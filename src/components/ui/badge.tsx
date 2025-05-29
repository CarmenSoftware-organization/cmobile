import { cn } from "@/lib/utils";

export function Badge({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: "default" | "secondary"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block font-medium px-2 py-0.5 rounded-full",
        variant === "secondary"
          ? "bg-primary/10 text-primary"
          : "bg-primary text-primary-foreground",
        className
      )}
    >
      {children}
    </span>
  );
} 