import { useState } from "react";
import { Building, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessUnit {
  id: number;
  name: string;
}

interface BusinessUnitLabelProps {
  assignedBusinessUnits: BusinessUnit[];
}

export function BusinessUnitLabel({ assignedBusinessUnits }: BusinessUnitLabelProps) {
  const [selectedBU, setSelectedBU] = useState<BusinessUnit | null>(
    assignedBusinessUnits.length > 0 ? assignedBusinessUnits[0] : null
  );
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const selectBusinessUnit = (bu: BusinessUnit) => {
    setSelectedBU(bu);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      {/* Selected Business Unit - Touch Friendly Display */}
      <div 
        onClick={toggleDropdown}
        className={cn(
          "flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-700",
          "bg-white dark:bg-gray-800 cursor-pointer touch-manipulation",
          "active:bg-gray-50 dark:active:bg-gray-700 transition-colors"
        )}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
            <Building className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {selectedBU?.name || "Select Business Unit"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {assignedBusinessUnits.length} {assignedBusinessUnits.length === 1 ? 'unit' : 'units'} assigned
            </div>
          </div>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-gray-500 transition-transform",
          isOpen && "transform rotate-180"
        )} />
      </div>
      
      {/* Dropdown - Only visible when open */}
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto">
          {assignedBusinessUnits.map((bu) => (
            <div 
              key={bu.id} 
              onClick={() => selectBusinessUnit(bu)}
              className={cn(
                "px-3 py-2 cursor-pointer touch-manipulation",
                "hover:bg-gray-50 dark:hover:bg-gray-700",
                "active:bg-gray-100 dark:active:bg-gray-600",
                selectedBU?.id === bu.id && "bg-primary/5 dark:bg-primary/10"
              )}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {bu.name}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Backdrop for closing dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 