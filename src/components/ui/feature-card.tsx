import Link from "next/link";
import { 
  Home, 
  Package, 
  CheckCircle, 
  ShoppingCart, 
  ClipboardList, 
  Search 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureCard({ title, href, count }: { title: string; href: string; count?: number }) {
  // Map icons based on the title
  const getIcon = () => {
    switch(title) {
      case "Receiving":
        return <Package className="w-8 h-8 text-primary mb-2" />;
      case "PR Approval":
        return <CheckCircle className="w-8 h-8 text-primary mb-2" />;
      case "Store Requisition":
        return <ShoppingCart className="w-8 h-8 text-primary mb-2" />;
      case "Physical Count":
        return <ClipboardList className="w-8 h-8 text-primary mb-2" />;
      case "Spot Check":
        return <Search className="w-8 h-8 text-success mb-2" />;
      default:
        return <Home className="w-8 h-8 text-primary mb-2" />;
    }
  };

  return (
    <Link href={href} className="block">
      <div className={cn(
        "h-full p-4 bg-card rounded-xl shadow cursor-pointer flex flex-col items-center transition",
        "hover:bg-primary/5"
      )}>
        {getIcon()}
        <div className="font-semibold text-base mb-1 text-center text-foreground">{title}</div>
        {typeof count === "number" && count > 0 ? (
          <div className="text-xs text-muted-foreground text-center">
            {count} {count === 1 ? 'item' : 'items'} pending
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center">
            No pending items
          </div>
        )}
      </div>
    </Link>
  );
} 