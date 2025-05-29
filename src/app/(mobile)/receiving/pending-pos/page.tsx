"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Filter, Calendar, MapPin, DollarSign, FileText, Clock, Package } from "lucide-react";
import { mockPOs, type PurchaseOrder } from "@/data/mockPOData";

export default function PendingPOsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Filter to show only Open POs
  const pendingPOs = mockPOs.filter(po => po.status === "Open");

  // Get unique business units for filter
  const businessUnits = ["All", ...Array.from(new Set(pendingPOs.map(po => po.businessUnit).filter(Boolean)))];

  // Apply filters
  const filteredPOs = pendingPOs.filter(po => {
    const matchesSearch = searchTerm === "" || 
      po.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBU = selectedBusinessUnit === "All" || po.businessUnit === selectedBusinessUnit;
    
    return matchesSearch && matchesBU;
  });

  const handlePOClick = (po: PurchaseOrder) => {
    // Navigate to PO detail or GRN creation
    router.push(`/receiving/select-grn-locations?po=${po.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
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
                Purchase Orders awaiting delivery
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search PO number, vendor, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            {selectedBusinessUnit !== "All" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBusinessUnit("All")}
                className="text-xs"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
              <div>
                <label className="text-sm font-medium mb-2 block">Business Unit</label>
                <select
                  value={selectedBusinessUnit}
                  onChange={(e) => setSelectedBusinessUnit(e.target.value)}
                  className="w-full p-2 border rounded bg-background"
                >
                  {businessUnits.map(bu => (
                    <option key={bu} value={bu}>{bu}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="px-4 py-2 bg-muted/30">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPOs.length} of {pendingPOs.length} pending purchase orders
        </p>
      </div>

      {/* PO List */}
      <div className="p-4 space-y-3">
        {filteredPOs.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Pending POs Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedBusinessUnit !== "All" 
                ? "Try adjusting your search or filter criteria."
                : "All purchase orders have been received or there are no pending orders."}
            </p>
            {(searchTerm || selectedBusinessUnit !== "All") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedBusinessUnit("All");
                }}
              >
                Clear Filters
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
                      <span className="text-muted-foreground">Expected: {new Date(po.eta).toLocaleDateString()}</span>
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