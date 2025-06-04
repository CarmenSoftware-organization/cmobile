"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Filter, Calendar, MapPin, DollarSign, FileText, Clock, Package, Camera, Plus, AlertCircle, ChevronDown } from "lucide-react";
import { mockPOs, type PurchaseOrder } from "@/data/mockPOData";
import { mockGRNs } from "@/data/mockGRNData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

export default function PendingPOsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("All");
  const [deliveryDateFilter, setDeliveryDateFilter] = useState("All");
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [showFilters, setShowFilters] = useState(false);

  // Filter to show only Sent POs
  const pendingPOs = mockPOs.filter(po => po.status === "Sent");

  // Get unique business units for filter
  const businessUnits = ["All", ...Array.from(new Set(pendingPOs.map(po => po.businessUnit).filter(Boolean)))];

  // Find all draft GRNs
  const draftGRNs = mockGRNs.filter(grn => grn.status === "Draft");

  // Date filter options for delivery dates
  const deliveryDateOptions = ["All", "Today", "Tomorrow", "This Week", "Next Week", "Overdue"];

  // Check if a specific BU is selected (not "All")
  const isSpecificBUSelected = selectedBusinessUnit !== "All";

  // Helper function to check if date matches filter
  const matchesDeliveryDateFilter = (eta: string, filter: string) => {
    if (filter === "All") return true;
    
    const today = new Date();
    const poDate = new Date(eta);
    
    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);
    poDate.setHours(0, 0, 0, 0);
    
    // Handle custom date selection
    if (filter === "Custom" && selectedDateRange.from) {
      if (selectedDateRange.to) {
        // Date range selected
        return poDate >= selectedDateRange.from && poDate <= selectedDateRange.to;
      } else {
        // Only start date selected
        return poDate.getTime() === selectedDateRange.from.getTime();
      }
    }
    
    switch (filter) {
      case "Today":
        return poDate.getTime() === today.getTime();
      case "Tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return poDate.getTime() === tomorrow.getTime();
      case "This Week":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return poDate >= startOfWeek && poDate <= endOfWeek;
      case "Next Week":
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
        return poDate >= nextWeekStart && poDate <= nextWeekEnd;
      case "Overdue":
        return poDate < today;
      default:
        return true;
    }
  };

  // Apply filters
  const filteredPOs = pendingPOs.filter(po => {
    const matchesSearch = searchTerm === "" || 
      po.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBU = selectedBusinessUnit === "All" || po.businessUnit === selectedBusinessUnit;
    const matchesDate = matchesDeliveryDateFilter(po.eta, deliveryDateFilter);
    
    return matchesSearch && matchesBU && matchesDate;
  });

  const handlePOClick = (po: PurchaseOrder) => {
    // Navigate to PO detail or GRN creation
    router.push(`/receiving/select-grn-locations?po=${po.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityColor = (eta: string) => {
    const today = new Date();
    const etaDate = new Date(eta);
    const diffDays = Math.ceil((etaDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"; // Overdue
    if (diffDays <= 1) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"; // Due today/tomorrow
    if (diffDays <= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"; // Due soon
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"; // On time
  };

  const getPriorityText = (eta: string) => {
    const today = new Date();
    const etaDate = new Date(eta);
    const diffDays = Math.ceil((etaDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays <= 3) return "Due Soon";
    return "On Time";
  };

  // Check if any filters are active
  const hasActiveFilters = selectedBusinessUnit !== "All" || deliveryDateFilter !== "All" || searchTerm !== "";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Pending POs</h1>
              <p className="text-sm text-muted-foreground">
                {isSpecificBUSelected 
                  ? `Purchase Orders awaiting delivery • ${selectedBusinessUnit}`
                  : "Select a Business Unit to create GRNs"}
              </p>
            </div>
          </div>
          {/* Create New GRN Button - Top Right */}
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            disabled={!isSpecificBUSelected}
            title={!isSpecificBUSelected ? "Please select a Business Unit to create a new GRN" : "Create a new Good Receive Note"}
            onClick={() => {
              if (isSpecificBUSelected) {
                // Store selected BU in sessionStorage for the new GRN flow
                const selectedBU = {
                  id: 1, // Mock ID - you can enhance this later with actual BU mapping
                  name: selectedBusinessUnit,
                  code: selectedBusinessUnit.substring(0, 3).toUpperCase(),
                  location: "Auto-selected",
                  type: "Business Unit",
                  active: true,
                  description: `Selected from Pending POs: ${selectedBusinessUnit}`
                };
                sessionStorage.setItem('selectedBusinessUnit', JSON.stringify(selectedBU));
                
                // Route directly to vendor selection, bypassing BU selection
                router.push(`/receiving/new?bu=${encodeURIComponent(selectedBusinessUnit)}`);
              }
            }}
          >
            <Plus className="w-4 h-4" />
            New GRN
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search PO number, vendor, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-2 border rounded-lg bg-background"
            />
            {/* Scan PO Icon Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2"
              onClick={() => router.push("/receiving/scan-po")}
              aria-label="Scan PO"
            >
              <Camera className="w-5 h-5 text-primary" />
            </Button>
          </div>

          {/* Filter Buttons Row */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Business Unit Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  {selectedBusinessUnit === "All" ? "All Business Units" : selectedBusinessUnit}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {businessUnits.map(bu => (
                  <DropdownMenuItem
                    key={bu}
                    onClick={() => setSelectedBusinessUnit(bu || "All")}
                  >
                    {bu}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Delivery Date Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDateRange.from && selectedDateRange.to
                    ? `${format(selectedDateRange.from, "MMM dd")} - ${format(selectedDateRange.to, "MMM dd, yyyy")}`
                    : selectedDateRange.from
                    ? `From ${format(selectedDateRange.from, "MMM dd, yyyy")}`
                    : deliveryDateFilter === "All"
                    ? "All Dates"
                    : deliveryDateFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px]">
                {deliveryDateOptions.map(option => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => {
                      setDeliveryDateFilter(option);
                      if (option === "All") setSelectedDateRange({ from: undefined, to: undefined });
                    }}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="p-2">
                  <div className="text-sm font-medium mb-2">Select Custom Date Range:</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDateRange.from && selectedDateRange.to ? (
                          `${format(selectedDateRange.from, "MMM dd, yyyy")} - ${format(selectedDateRange.to, "MMM dd, yyyy")}`
                        ) : selectedDateRange.from ? (
                          `From ${format(selectedDateRange.from, "MMM dd, yyyy")} - Select end date`
                        ) : "Select start and end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3">
                        <div className="text-xs text-muted-foreground mb-2">
                          Click to select start date, then click again to select end date
                        </div>
                        <CalendarComponent
                          mode="range"
                          selected={selectedDateRange}
                          onSelect={(dateRange: DateRange | undefined) => {
                            if (dateRange) {
                              setSelectedDateRange(dateRange);
                              setDeliveryDateFilter("Custom");
                            } else {
                              setSelectedDateRange({ from: undefined, to: undefined });
                            }
                          }}
                          initialFocus
                        />
                        {(selectedDateRange.from || selectedDateRange.to) && (
                          <div className="border-t pt-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                setSelectedDateRange({ from: undefined, to: undefined });
                                setDeliveryDateFilter("All");
                              }}
                            >
                              Clear Date Range
                            </Button>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedBusinessUnit("All");
                  setDeliveryDateFilter("All");
                  setSelectedDateRange({ from: undefined, to: undefined });
                }}
                className="text-xs text-muted-foreground"
              >
                Clear All
              </Button>
            )}

            {/* Legacy Filters Toggle - Keep for additional options if needed */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 ml-auto"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex gap-2 flex-wrap">
              {searchTerm && (
                <span className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-full px-2 py-1 text-xs flex items-center gap-1">
                  Search: {searchTerm}
                  <button className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5" onClick={() => setSearchTerm("")}>×</button>
                </span>
              )}
              {selectedBusinessUnit !== "All" && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full px-2 py-1 text-xs flex items-center gap-1">
                  BU: {selectedBusinessUnit}
                  <button className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5" onClick={() => setSelectedBusinessUnit("All")}>×</button>
                </span>
              )}
              {deliveryDateFilter !== "All" && (
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full px-2 py-1 text-xs flex items-center gap-1">
                  Date: {deliveryDateFilter === "Custom" 
                    ? (selectedDateRange.from && selectedDateRange.to 
                      ? `${format(selectedDateRange.from, "MMM dd")} - ${format(selectedDateRange.to, "MMM dd")}` 
                      : selectedDateRange.from 
                      ? `From ${format(selectedDateRange.from, "MMM dd")}` 
                      : "Custom")
                    : deliveryDateFilter}
                  <button className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5" onClick={() => {
                    setDeliveryDateFilter("All");
                    setSelectedDateRange({ from: undefined, to: undefined });
                  }}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Legacy Expanded Filters - Keep as fallback */}
          {showFilters && (
            <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
              <div className="text-sm font-medium">Additional Filters</div>
              <div className="text-xs text-muted-foreground">
                Use the filter buttons above for quick access to common filters.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="px-4 py-2 bg-muted/30">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPOs.length} of {pendingPOs.length} pending purchase orders
          {hasActiveFilters && (
            <span className="ml-2 text-primary font-medium">
              (filtered)
            </span>
          )}
        </p>
      </div>

      {/* PO List */}
      <div className="p-4 space-y-3">
        {filteredPOs.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Pending POs Found</h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters 
                ? "Try adjusting your search or filter criteria."
                : "All purchase orders have been received or there are no pending orders."}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedBusinessUnit("All");
                  setDeliveryDateFilter("All");
                  setSelectedDateRange({ from: undefined, to: undefined });
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          filteredPOs.map((po) => (
            <div key={po.id} className="cursor-pointer" onClick={() => handlePOClick(po)}>
              <Card className="p-4 hover:bg-muted transition-colors">
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">{po.number}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                        {po.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(po.eta)}`}>
                        {getPriorityText(po.eta)}
                      </span>
                    </div>
                  </div>

                  {/* Vendor and Business Unit */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{po.vendor}</span>
                    </div>
                    {po.businessUnit && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{po.businessUnit}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial and Item Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{po.totalValue}</span>
                        <span className="text-muted-foreground">({po.currency})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{po.itemCount} items</span>
                      </div>
                    </div>
                  </div>

                  {/* ETA and Description */}
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Expected: {new Date(po.eta).toLocaleDateString('en-GB')}</span>
                    </div>
                    <p className="text-muted-foreground text-xs line-clamp-2">{po.description}</p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 border-t">
                    <Button size="sm" className="w-full">
                      Create GRN
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Draft GRN Banner Section - Moved to Bottom */}
      {draftGRNs.length > 0 && (
        <div className="p-4">
          <Card className="p-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                {draftGRNs.length} Draft GRN{draftGRNs.length > 1 ? 's' : ''} in Progress
              </h4>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              You have unfinished goods receipt notes. Resume working on them to complete your receiving process.
            </p>
            <div className="space-y-3">
              {draftGRNs.map((grn) => (
                <div key={grn.id} className="flex items-center justify-between bg-yellow-100 dark:bg-yellow-900 p-3 rounded">
                  <div className="text-sm">
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100">{grn.grnNumber}</div>
                    <div className="text-yellow-700 dark:text-yellow-300">
                      POs: {grn.linkedPOs.join(', ')} • Created: {grn.createdDate}
                    </div>
                    <div className="text-yellow-600 dark:text-yellow-400 text-xs">
                      {grn.itemCount} items • {grn.vendorName}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="ml-4"
                    onClick={() => router.push(`/receiving/grn-detail?grn=${grn.id}`)}
                  >
                    Resume
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Help Section */}
      {filteredPOs.length > 0 && (
        <div className="p-4">
          <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Pending Purchase Orders
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  These purchase orders are awaiting delivery. Click on any PO to create a Good Receive Note (GRN) when the delivery arrives.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 