"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { QrCode, Search, Archive, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockPOs, type PurchaseOrder } from "@/data/mockPOData";

export default function ReceivingPage() {
  const router = useRouter();
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    vendor: "",
    status: "",
    dateFrom: "",
    dateTo: ""
  });

  // Business Units
  const businessUnits = [
    "Grand Hotel Singapore",
    "Business Hotel Jakarta", 
    "Boutique Hotel Bangkok"
  ];

  // Get unique vendors and statuses for filter options
  const vendors = Array.from(new Set(mockPOs.map(po => po.vendor))).sort();
  const statuses = Array.from(new Set(mockPOs.map(po => po.status))).sort();

  // Filter POs based on search criteria
  const filteredPOs = mockPOs.filter(po => {
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

    return matchesSearch && matchesVendor && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedVendor("");
    setSelectedStatus("");
    setDateFrom("");
    setDateTo("");
  };

  const handlePOSelect = (po: PurchaseOrder) => {
    router.push(`/receiving/grn-detail?po=${po.number.replace('PO-', '')}&vendor=${po.vendor}`);
    setShowAdvancedSearch(false);
  };

  const openFilterDialog = () => {
    setTempFilters({
      vendor: selectedVendor,
      status: selectedStatus,
      dateFrom: dateFrom,
      dateTo: dateTo
    });
    setShowFilters(true);
  };

  const applyFilters = () => {
    setSelectedVendor(tempFilters.vendor);
    setSelectedStatus(tempFilters.status);
    setDateFrom(tempFilters.dateFrom);
    setDateTo(tempFilters.dateTo);
    setShowFilters(false);
  };

  const cancelFilters = () => {
    setShowFilters(false);
  };

  const activeFiltersCount = [selectedVendor, selectedStatus, dateFrom, dateTo].filter(Boolean).length;

  const handleQRScan = () => {
    setIsScanning(true);
    // Simulate scan
    setTimeout(() => {
      setIsScanning(false);
      router.push("/receiving/scan-po");
    }, 1000);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Business Unit Selector */}
      <div>
        <select
          value={selectedBusinessUnit}
          onChange={(e) => setSelectedBusinessUnit(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="">Select Business Unit</option>
          {businessUnits.map((bu) => (
            <option key={bu} value={bu}>
              {bu}
            </option>
          ))}
        </select>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">Scan PO, manage drafts, or search manually</p>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleQRScan}
            disabled={isScanning}
            className="w-full py-6 text-lg"
          >
            {isScanning ? (
              <>
                <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent mr-3" />
                Scanning...
              </>
            ) : (
              <>
                <QrCode className="w-6 h-6 mr-3" />
                Scan PO
              </>
            )}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>

          {/* Advanced Search */}
          <button 
            className="w-full text-left"
            onClick={() => {
              if (selectedBusinessUnit) {
                router.push(`/receiving/advanced-search?bu=${encodeURIComponent(selectedBusinessUnit)}`);
              } else {
                setShowAdvancedSearch(true);
              }
            }}
          >
            <Card className="p-4 cursor-pointer hover:bg-muted transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500/10 p-2.5 rounded-lg">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-700">Advanced Search</h3>
                    <p className="text-xs text-blue-600">Search by PO, vendor, or product</p>
                  </div>
                </div>
              </div>
            </Card>
          </button>

          {/* GRN Draft */}
          <button 
            className="w-full text-left"
            onClick={() => {
              const url = selectedBusinessUnit 
                ? `/receiving/draft-grns?bu=${encodeURIComponent(selectedBusinessUnit)}`
                : '/receiving/draft-grns';
              router.push(url);
            }}
          >
            <Card className="p-4 cursor-pointer hover:bg-muted transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500/10 p-2.5 rounded-lg">
                    <Archive className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-700">GRN Drafts</h3>
                    <p className="text-xs text-orange-600">Resume incomplete receipts</p>
                  </div>
                </div>
              </div>
            </Card>
          </button>


        </div>
      </div>

      {/* Advanced Search Dialog */}
      <Dialog open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Advanced Search</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Search Bar */}
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
                
                                 {/* Filter Toggle - Icon Only */}
                 <div className="relative">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={openFilterDialog}
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

               {/* Clear Filters Button */}
               {activeFiltersCount > 0 && (
                 <div className="flex justify-end">
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={clearFilters}
                     className="text-muted-foreground"
                   >
                     Clear all
                   </Button>
                 </div>
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
                    <p className="text-sm">Try adjusting your search criteria or filters</p>
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
                                className="mb-1"
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

                          {po.businessUnit && (
                            <Badge variant="secondary" className="text-xs">
                              {po.businessUnit}
                            </Badge>
                          )}

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
                 </DialogContent>
       </Dialog>

       {/* Filter Dialog */}
       <Dialog open={showFilters} onOpenChange={setShowFilters}>
         <DialogContent className="w-[90vw] max-w-sm">
           <DialogHeader>
             <DialogTitle>Filter Options</DialogTitle>
           </DialogHeader>
           
           <div className="space-y-4">
             {/* Vendor Filter */}
             <div>
               <label className="block text-sm font-medium mb-2">Vendor</label>
               <select
                 value={tempFilters.vendor}
                 onChange={(e) => setTempFilters(prev => ({ ...prev, vendor: e.target.value }))}
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
                 value={tempFilters.status}
                 onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
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
                 value={tempFilters.dateFrom}
                 onChange={(e) => setTempFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                 className="w-full"
               />
             </div>

             <div>
               <label className="block text-sm font-medium mb-2">ETA To</label>
               <Input
                 type="date"
                 value={tempFilters.dateTo}
                 onChange={(e) => setTempFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                 className="w-full"
               />
             </div>

             {/* Action Buttons */}
             <div className="flex space-x-2 pt-4">
               <Button variant="outline" onClick={cancelFilters} className="flex-1">
                 Cancel
               </Button>
               <Button onClick={applyFilters} className="flex-1">
                 OK
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </div>
   );
 }