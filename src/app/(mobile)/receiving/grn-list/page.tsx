"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessUnitLabel } from "@/components/ui/business-unit-label";
import { ChevronLeft, Search, Filter, Plus } from "lucide-react";
import { mockGRNs, businessUnits, statusOptions, type MockGRN } from "@/data/mockGRNData";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Draft": return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    case "Received": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
    case "Committed": return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
    case "Void": return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200";
  }
};

export default function GRNListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Filter GRNs based on search and filters
  const filteredGRNs = mockGRNs.filter(grn => {
    const matchesSearch = 
      grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grn.linkedPOs.some(po => po.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === "All" || grn.status === selectedStatus;
    const matchesBusinessUnit = selectedBusinessUnit === "All" || grn.businessUnit === selectedBusinessUnit;
    
    return matchesSearch && matchesStatus && matchesBusinessUnit;
  });

  const handleGRNClick = (grn: MockGRN) => {
    if (grn.status === "Draft" || grn.status === "Received") {
      // Editable GRN - go to detail page
      const poParams = grn.linkedPOs.map(po => `po=${po.replace('PO-', '')}`).join('&');
      router.push(`/receiving/grn-detail?${poParams}&grn=${grn.grnNumber}`);
    } else {
      // View-only GRN - go to view page
      router.push(`/receiving/grn/${grn.grnNumber}`);
    }
  };

  const getActionText = (status: string) => {
    switch (status) {
      case "Draft": return "Resume";
      case "Received": return "Continue";
      case "Committed": return "View";
      case "Void": return "View";
      default: return "View";
    }
  };

  return (
    <div className="p-4 pb-32 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-xl font-bold ml-1">Good Receive Notes</span>
        </div>
        <Button 
          size="sm" 
          onClick={() => router.push('/receiving/new')}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          New GRN
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search by GRN#, vendor, or PO number..."
          className="w-full pl-10 pr-12 py-2 border border-input rounded-lg bg-background text-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                className="w-full p-2 border border-input rounded bg-background text-foreground"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Business Unit</label>
              <select
                className="w-full p-2 border border-input rounded bg-background text-foreground"
                value={selectedBusinessUnit}
                onChange={(e) => setSelectedBusinessUnit(e.target.value)}
              >
                <option value="All">All Units</option>
                {businessUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedStatus("All");
                setSelectedBusinessUnit("All");
                setSearchTerm("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredGRNs.length} of {mockGRNs.length} GRNs
      </div>

      {/* GRN List */}
      <div className="space-y-3">
        {filteredGRNs.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="text-muted-foreground">No GRNs found matching your criteria.</div>
          </Card>
        ) : (
          filteredGRNs.map((grn) => (
            <Card key={grn.id} className="p-4 cursor-pointer hover:bg-muted transition-colors">
              <div onClick={() => handleGRNClick(grn)} className="space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{grn.grnNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grn.status)}`}>{grn.status}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={grn.status === "Draft" || grn.status === "Received" ? "default" : "outline"}
                    onClick={e => { e.stopPropagation(); handleGRNClick(grn); }}
                  >
                    {getActionText(grn.status)}
                  </Button>
                </div>
                {/* Vendor and Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Vendor:</span>
                    <div className="font-medium">{grn.vendorName}</div>
                    <div className="text-xs text-muted-foreground">({grn.vendorCode})</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Total Value:</span>
                    <div className="font-bold">{grn.totalValue} {grn.currency}</div>
                  </div>
                </div>
                {/* PO and Items */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Linked POs:</span>
                    <div className="text-sm">{grn.linkedPOs.join(", ")}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Items:</span>
                    <div className="text-sm">{grn.itemCount} item{grn.itemCount !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                {/* Dates and Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground">Created:</span>
                    <div className="text-sm">{grn.createdDate}</div>
                    {grn.receivedDate && (
                      <>
                        <span className="text-xs text-muted-foreground">Received:</span>
                        <div className="text-sm">{grn.receivedDate}</div>
                      </>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Location:</span>
                    <div className="text-sm">{grn.receiptLocation}</div>
                  </div>
                </div>
                {/* Business Unit and Created By */}
                <div className="flex items-center justify-between">
                  <BusinessUnitLabel assignedBusinessUnits={[{ id: 1, name: grn.businessUnit }]} />
                  <div className="text-xs text-muted-foreground">
                    Created by {grn.createdBy}
                    {grn.approvedBy && (
                      <> • Approved by {grn.approvedBy}</>
                    )}
                  </div>
                </div>
                {/* Notes if any */}
                {grn.notes && (
                  <div className="border-t border-border pt-2">
                    <span className="text-xs text-muted-foreground">Notes:</span>
                    <div className="text-sm italic">{grn.notes}</div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}