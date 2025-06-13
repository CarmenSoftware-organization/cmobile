"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Filter, Calendar, MapPin, DollarSign, FileText, Clock } from "lucide-react";
import { mockGRNs, type MockGRN } from "@/data/mockGRNData";

function DraftGRNsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBusinessUnitFromUrl = searchParams.get('bu');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(selectedBusinessUnitFromUrl || "All");
  const [showFilters, setShowFilters] = useState(false);

  // Update selected business unit when URL parameter changes
  useEffect(() => {
    if (selectedBusinessUnitFromUrl) {
      setSelectedBusinessUnit(selectedBusinessUnitFromUrl);
    }
  }, [selectedBusinessUnitFromUrl]);

  // Filter to show only Draft GRNs
  const draftGRNs = mockGRNs.filter(grn => grn.status === "Draft");

  // Apply additional filters
  const filteredGRNs = draftGRNs.filter(grn => {
    const matchesSearch = 
      grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.linkedPOs.some(po => po.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // If BU is passed via URL, filter by that BU; otherwise use the selected filter
    const effectiveBusinessUnit = selectedBusinessUnitFromUrl || selectedBusinessUnit;
    const matchesBusinessUnit = effectiveBusinessUnit === "All" || grn.businessUnit === effectiveBusinessUnit;
    
    return matchesSearch && matchesBusinessUnit;
  });

  // Get unique business units for filter
  const businessUnits = Array.from(new Set(draftGRNs.map(grn => grn.businessUnit)));

  const handleGRNClick = (grn: MockGRN) => {
    // Navigate to GRN detail for editing
    const poParams = grn.linkedPOs.map(po => `po=${po.replace('PO-', '')}`).join('&');
    const buParam = selectedBusinessUnitFromUrl ? `&bu=${encodeURIComponent(selectedBusinessUnitFromUrl)}` : '';
    router.push(`/receiving/grn-detail?${poParams}&grn=${grn.grnNumber}${buParam}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300";
    }
  };



  return (
    <div className="p-4 pb-32 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Draft GRNs</h1>
            <p className="text-sm text-muted-foreground">
              {selectedBusinessUnitFromUrl || "Incomplete Good Receive Notes requiring attention"}
            </p>
          </div>
        </div>
      </div>



      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search GRN number, vendor, or PO..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="px-3"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {showFilters && (
          <Card className="p-4 space-y-3">
            {/* Only show BU filter if not pre-selected via URL */}
            {!selectedBusinessUnitFromUrl && (
              <div>
                <label className="text-sm font-medium mb-1 block">Business Unit</label>
                <select
                  className="w-full p-2 border border-input rounded bg-background text-foreground"
                  value={selectedBusinessUnit}
                  onChange={(e) => setSelectedBusinessUnit(e.target.value)}
                >
                  <option value="All">All Business Units</option>
                  {businessUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedBusinessUnitFromUrl && (
              <div className="text-sm text-muted-foreground">
                Showing drafts for: <span className="font-medium">{selectedBusinessUnitFromUrl}</span>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!selectedBusinessUnitFromUrl) {
                    setSelectedBusinessUnit("All");
                  }
                  setSearchTerm("");
                }}
              >
                Clear {selectedBusinessUnitFromUrl ? 'Search' : 'Filters'}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredGRNs.length} of {draftGRNs.length} draft GRNs
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-xs text-muted-foreground">Requires completion</span>
        </div>
      </div>

      {/* Draft GRN List */}
      <div className="space-y-3">
        {filteredGRNs.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg font-medium text-muted-foreground mb-2">No Draft GRNs Found</div>
            <div className="text-sm text-muted-foreground">
              {searchTerm || (selectedBusinessUnit !== "All" && !selectedBusinessUnitFromUrl) 
                ? "Try adjusting your search criteria or filters."
                : selectedBusinessUnitFromUrl
                  ? `No draft GRNs found for ${selectedBusinessUnitFromUrl}.`
                  : "All GRNs have been completed. Great work!"
              }
            </div>
          </Card>
        ) : (
          filteredGRNs.map((grn) => (
            <div key={grn.id} className="cursor-pointer" onClick={() => handleGRNClick(grn)}>
              <Card className="p-4 hover:bg-muted transition-colors">
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">{grn.grnNumber}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grn.status)}`}>
                        {grn.status}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGRNClick(grn);
                      }}
                    >
                      Resume
                    </Button>
                  </div>

                  {/* Vendor and Value */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{grn.vendorName}</span>
                      <span className="text-muted-foreground">({grn.vendorCode})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      {grn.totalValue}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created: {grn.createdDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{grn.itemCount} items</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>PO: {grn.linkedPOs.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{grn.receiptLocation}</span>
                    </div>
                  </div>

                  {/* Business Unit */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Created by: {grn.createdBy}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Help Text */}
      {filteredGRNs.length > 0 && (
        <Card className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <div className="bg-orange-500/10 p-2 rounded-lg">
              <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                Complete Your Draft GRNs
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                These GRNs are incomplete and need attention. Tap &ldquo;Resume&rdquo; to continue where you left off and complete the receiving process.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function DraftGRNsPageWithSuspense() {
  return (
    <Suspense fallback={<div className="p-4">Loading draft GRNs...</div>}>
      <DraftGRNsPage />
    </Suspense>
  );
}