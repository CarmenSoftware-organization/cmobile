"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Search, Filter } from "lucide-react";
import { mockPOs, type PurchaseOrder } from "@/data/mockPOData";

export default function AdvancedSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBusinessUnit = searchParams.get('bu') || "";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique vendors and statuses for filter options
  const vendors = Array.from(new Set(mockPOs.map(po => po.vendor))).sort();
  const statuses = Array.from(new Set(mockPOs.map(po => po.status))).sort();

  // Filter POs based on search criteria and business unit
  const filteredPOs = mockPOs.filter(po => {
    // Business unit filter - only show POs for selected BU
    const matchesBusinessUnit = !selectedBusinessUnit || po.businessUnit === selectedBusinessUnit;
    
    const matchesSearch = !searchQuery || 
      po.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.items.some(item => 
        item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesVendor = !selectedVendor || po.vendor === selectedVendor;
    const matchesStatus = !selectedStatus || po.status === selectedStatus;
    
    const matchesDateFrom = !dateFrom || po.eta >= dateFrom;
    const matchesDateTo = !dateTo || po.eta <= dateTo;

    return matchesBusinessUnit && matchesSearch && matchesVendor && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedVendor("");
    setSelectedStatus("");
    setDateFrom("");
    setDateTo("");
  };

  const handlePOSelect = (po: PurchaseOrder) => {
    router.push(`/receiving/grn-detail?po=${po.number.replace('PO-', '')}&vendor=${po.vendor}&bu=${selectedBusinessUnit}`);
  };

  const activeFiltersCount = [selectedVendor, selectedStatus, dateFrom, dateTo].filter(Boolean).length;

  return (
    <div className="p-4 pb-32 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Advanced Search</h1>
            <p className="text-sm text-muted-foreground">
              {selectedBusinessUnit ? `Searching in: ${selectedBusinessUnit}` : "Search purchase orders"}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search PO number, vendor, product, or SKU..."
              className="pl-12 pr-4 py-3 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter Toggle */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2"
            >
              <Filter className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vendor Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Vendor</label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                >
                  <option value="">All Vendors</option>
                  {vendors.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium mb-2">ETA From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ETA To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <Badge variant="secondary">
            {filteredPOs.length} PO{filteredPOs.length !== 1 ? 's' : ''} found
          </Badge>
        </div>

        {filteredPOs.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No POs found</p>
              <p className="text-sm">
                {selectedBusinessUnit 
                  ? `No purchase orders found for ${selectedBusinessUnit} matching your criteria`
                  : "Try adjusting your search criteria or filters"
                }
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPOs.map((po) => (
              <button
                key={po.id}
                className="w-full text-left"
                onClick={() => handlePOSelect(po)}
              >
                <Card className="p-4 cursor-pointer hover:bg-muted transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{po.number}</h3>
                        <p className="text-sm text-muted-foreground">{po.vendor}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={po.status === 'Sent' ? 'default' : 'secondary'}
                          className="mb-1 text-sm"
                        >
                          {po.status}
                        </Badge>
                        <p className="text-sm font-medium">{po.totalValue}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Items:</span>
                        <span className="ml-1 font-medium">{po.itemCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ETA:</span>
                        <span className="ml-1 font-medium">{po.eta}</span>
                      </div>
                    </div>



                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {po.description}
                    </p>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}