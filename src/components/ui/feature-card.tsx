import Link from "next/link";
import { 
  Home, 
  Package, 
  CheckCircle, 
  ShoppingCart, 
  ClipboardList, 
  Search,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string; 
  href: string; 
  count?: number;
  description?: string;
}

export function FeatureCard({ title, href, count, description }: FeatureCardProps) {
  // Map icons based on the title
  const getIcon = () => {
    switch(title) {
      case "Receiving":
      case "Purchase Order Receiving":
        return <Package className="w-6 h-6 text-primary" />;
      case "Purchase Request Approval":
      case "PR Approval":
        return <CheckCircle className="w-6 h-6 text-primary" />;
      case "Store Requisition Approval":
      case "Store Requisition":
        return <ShoppingCart className="w-6 h-6 text-primary" />;
      case "Physical Count":
        return <ClipboardList className="w-6 h-6 text-primary" />;
      case "Spot Check":
        return <Search className="w-6 h-6 text-success" />;
      default:
        return <Home className="w-6 h-6 text-primary" />;
    }
  };

  // Determine if we should show the alert indicator
  const showAlert = typeof count === "number" && count > 0;

  return (
    <Link href={href} className="block w-full">
      <div className={cn(
        "h-full p-4 bg-card rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm",
        "active:bg-primary/5 touch-manipulation", // Better for touch devices
        "flex items-center transition-all"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          showAlert ? "bg-primary/10" : "bg-gray-100 dark:bg-gray-800"
        )}>
          {getIcon()}
        </div>
        
        <div className="ml-4 flex-1">
          <div className="font-semibold text-base text-foreground">{title}</div>
          {description ? (
            <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
          ) : (
            <>
              {showAlert ? (
                <div className="text-xs font-medium text-primary mt-0.5 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {count} {count === 1 ? 'item' : 'items'} pending
                </div>
              ) : (
                <div className="text-xs text-muted-foreground mt-0.5">
                  No pending items
                </div>
              )}
            </>
          )}
        </div>
        
        <ChevronRight className="w-5 h-5 text-muted-foreground ml-2" />
      </div>
    </Link>
  );
} 