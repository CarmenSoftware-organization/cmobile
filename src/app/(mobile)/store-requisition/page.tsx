"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ShoppingCart, Calendar, Package, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
  "In-progress": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-600",
  Complete: "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-600",
  Issued: "bg-green-200 text-green-900 border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
  Rejected: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-600",
  Cancel: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-600",
};

const storeRequisitions = [
  {
    id: 1,
    number: "SR-001",
    status: "Draft",
    department: "F&B",
    date: "2024-06-01",
    itemCount: 5,
    business_unit: "Grand Hotel Singapore",
    requester: "Alice Lee",
    items: ["Coffee Beans", "Tea Bags", "Sugar", "Milk", "Cups"],
    jobCode: "JC-2025-001",
    marketSegment: "F&B",
    event: "Annual Gala Dinner",
    notes: "For weekend coffee service"
  },
  {
    id: 2,
    number: "SR-002",
    status: "In-progress",
    department: "Housekeeping",
    date: "2024-06-02",
    itemCount: 3,
    business_unit: "Business Hotel Jakarta",
    requester: "Bob Tan",
    items: ["Laundry Detergent", "Towels", "Soap"],
    jobCode: "JC-2025-002",
    marketSegment: "Rooms",
    event: null,
    notes: "Monthly supply replenishment"
  },
  {
    id: 3,
    number: "SR-003",
    status: "Complete",
    department: "Engineering",
    date: "2024-06-03",
    itemCount: 4,
    business_unit: "Boutique Hotel Bangkok",
    requester: "Charlie Lim",
    items: ["Light Bulbs", "Wrench", "Screws", "Tape"],
    jobCode: "JC-2025-003",
    marketSegment: "General",
    event: null,
    notes: "Maintenance supplies"
  },
  {
    id: 4,
    number: "SR-004",
    status: "Complete",
    department: "F&B",
    date: "2024-06-04",
    itemCount: 2,
    business_unit: "Grand Hotel Singapore",
    requester: "Diana Ong",
    items: ["Wine Glasses", "Plates"],
    jobCode: "JC-2025-001",
    marketSegment: "F&B",
    event: "Corporate Retreat",
    notes: "For executive dinner service"
  },
  {
    id: 5,
    number: "SR-005",
    status: "Issued",
    department: "Front Office",
    date: "2024-06-05",
    itemCount: 6,
    business_unit: "Business Hotel Jakarta",
    requester: "Eddie Goh",
    items: ["Pens", "Notepads", "Folders", "Markers", "Paper", "Stapler"],
    jobCode: "JC-2025-002",
    marketSegment: "General",
    event: null,
    notes: "Office supplies for front desk"
  },
  {
    id: 6,
    number: "SR-006",
    status: "In-progress",
    department: "Housekeeping",
    date: "2024-06-06",
    itemCount: 3,
    business_unit: "Boutique Hotel Bangkok",
    requester: "Fiona Chua",
    items: ["Pillow Cases", "Blankets", "Sheets"],
    jobCode: "JC-2025-003",
    marketSegment: "Rooms",
    event: null,
    notes: "Regular room supplies"
  },
  {
    id: 7,
    number: "SR-007",
    status: "Rejected",
    department: "F&B",
    date: "2024-06-07",
    itemCount: 1,
    business_unit: "Grand Hotel Singapore",
    requester: "George Tan",
    items: ["Champagne"],
    jobCode: "JC-2025-001",
    marketSegment: "F&B",
    event: "Wedding",
    notes: "Premium champagne for wedding reception"
  },
  {
    id: 8,
    number: "SR-008",
    status: "Cancel",
    department: "Engineering",
    date: "2024-06-08",
    itemCount: 2,
    business_unit: "Business Hotel Jakarta",
    requester: "Helen Lee",
    items: ["Hammer", "Drill"],
    jobCode: "JC-2025-002",
    marketSegment: "General",
    event: null,
    notes: "Need additional approval for power tools"
  },
  {
    id: 9,
    number: "SR-009",
    status: "Draft",
    department: "Front Office",
    date: "2024-06-09",
    itemCount: 4,
    business_unit: "Boutique Hotel Bangkok",
    requester: "Ivan Lim",
    items: ["Key Cards", "Lanyards", "Badge Holders", "Clipboards"],
    jobCode: "JC-2025-003",
    marketSegment: "General",
    event: "Conference",
    notes: "Materials for upcoming tech conference"
  },
  {
    id: 10,
    number: "SR-010",
    status: "Complete",
    department: "Housekeeping",
    date: "2024-06-10",
    itemCount: 2,
    business_unit: "Grand Hotel Singapore",
    requester: "Jane Ng",
    items: ["Vacuum Cleaner", "Mop"],
    jobCode: "JC-2025-001",
    marketSegment: "Rooms",
    event: null,
    notes: "Replacement cleaning equipment"
  },
];

const allDepartments = [
  ...Array.from(new Set(storeRequisitions.map(sr => sr.department)))
];







export default function StoreRequisitionPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string | null>(null);
  const [sort, setSort] = useState("date-desc");

  const [showFilterDialog, setShowFilterDialog] = useState(false);

  // Temporary filter states for dialog
  const [tempDeptFilter, setTempDeptFilter] = useState<string | null>(null);
  const [tempSort, setTempSort] = useState("date-desc");
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("");

  // Helper: any filter active
  const anyFilterActive = deptFilter || search || selectedBusinessUnit;
  
  // Count active filters
  const activeFilterCount = [
    deptFilter,
    selectedBusinessUnit
  ].filter(Boolean).length;

  // Open filter dialog with current values
  const openFilterDialog = () => {
    setTempDeptFilter(deptFilter);
    setTempSort(sort);
    setShowFilterDialog(true);
  };

  // Apply filters from dialog
  const applyFilters = () => {
    setDeptFilter(tempDeptFilter);
    setSort(tempSort);
    setShowFilterDialog(false);
  };

  // Cancel filter dialog
  const cancelFilters = () => {
    setShowFilterDialog(false);
  };

  let filtered = storeRequisitions.filter(sr => {
    const matchesSearch =
      sr.number.toLowerCase().includes(search.toLowerCase()) ||
      sr.items.some(item => item.toLowerCase().includes(search.toLowerCase())) ||
      (sr.notes && sr.notes.toLowerCase().includes(search.toLowerCase()));
    
    // Default to show only "In-progress" documents
    const matchesStatus = sr.status === "In-progress";
    
    const matchesDept = !deptFilter || sr.department === deptFilter;
    const matchesBusinessUnit = !selectedBusinessUnit || sr.business_unit === selectedBusinessUnit;
    return matchesSearch && matchesStatus && matchesDept && matchesBusinessUnit;
  });
  if (sort === "date-desc") filtered = filtered.sort((a, b) => b.date.localeCompare(a.date));
  if (sort === "date-asc") filtered = filtered.sort((a, b) => a.date.localeCompare(b.date));
  if (sort === "status") filtered = filtered.sort((a, b) => a.status.localeCompare(b.status));
  if (sort === "department") filtered = filtered.sort((a, b) => a.department.localeCompare(b.department));

  // Clear all filters
  const clearAllFilters = () => {
    setDeptFilter(null);
    setSearch("");
    setSelectedBusinessUnit("");
  };



  return (
    <div className="p-0 bg-background min-h-screen pb-20">
      {/* Business Unit Selector */}
      <div className="sticky top-0 z-10 bg-card dark:bg-card p-4 border-b border-border">
        <select 
          className="w-full text-sm border border-input bg-background rounded-md px-3 py-2"
          value={selectedBusinessUnit}
          onChange={e => setSelectedBusinessUnit(e.target.value)}
        >
          <option value="">All Business Units</option>
          <option value="Grand Hotel Singapore">Grand Hotel Singapore</option>
          <option value="Business Hotel Jakarta">Business Hotel Jakarta</option>
          <option value="Boutique Hotel Bangkok">Boutique Hotel Bangkok</option>
        </select>
      </div>
      
      {/* Search bar with filter icon */}
      <div className="sticky top-0 z-10 bg-card dark:bg-card p-4 pb-2 border-b border-border shadow-sm">
        <div className="flex gap-2 mb-2 items-center">
          <input
            className="flex-1 border border-input bg-background rounded-md px-3 py-2 text-sm"
            placeholder="Search SR number, item name, or notes"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            onClick={openFilterDialog}
            className="relative p-2 border border-input bg-background rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Filter size={16} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {anyFilterActive && (
            <button className="text-xs px-3 py-1 rounded bg-gray-100" onClick={clearAllFilters}>
              Clear All
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        <div className="flex gap-1 mt-1 flex-wrap">
          {deptFilter && (
            <span className="bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
              Dept: {deptFilter}
              <button className="ml-1" onClick={() => setDeptFilter(null)}>×</button>
            </span>
          )}
          {search && (
            <span className="bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
              Search: {search}
              <button className="ml-1" onClick={() => setSearch("")}>×</button>
            </span>
          )}
        </div>
        {/* Filter Dialog */}
        {showFilterDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-80 max-w-full">
              <div className="flex justify-between items-center mb-4">
                <div className="font-semibold">Filters</div>
                <button onClick={cancelFilters}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Department Filter */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Department</label>
                  <select
                    className="w-full text-sm border border-input bg-background rounded-md px-3 py-2"
                    value={tempDeptFilter || ""}
                    onChange={e => setTempDeptFilter(e.target.value === "" ? null : e.target.value)}
                  >
                    <option value="">All</option>
                    {allDepartments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Sort</label>
                  <select
                    className="w-full text-sm border border-input bg-background rounded-md px-3 py-2"
                    value={tempSort}
                    onChange={e => setTempSort(e.target.value)}
                  >
                    <option value="date-desc">Date ↓</option>
                    <option value="date-asc">Date ↑</option>
                    <option value="status">Status</option>
                    <option value="department">Department</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300" 
                  onClick={cancelFilters}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" 
                  onClick={applyFilters}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* List of SRs */}
      <div className="p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No Store Requisitions found.</div>
        ) : (
          filtered.map((sr) => {
            return (
              <Link key={sr.id} href={`/store-requisition/${sr.id}`}>
                <Card className="p-3 flex flex-col gap-1 mb-2 cursor-pointer active:scale-[0.98] transition-transform bg-card dark:bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-base">{sr.number}</span>
                      <span className="text-sm text-muted-foreground">{sr.business_unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`border text-xs ${statusColors[sr.status] || "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"}`}>{sr.status}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mb-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ShoppingCart size={12} />
                      <span>{sr.department}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar size={12} />
                      <span>{new Date(sr.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package size={12} />
                      <span>{sr.itemCount} items</span>
                    </div>
                  </div>
                  {sr.notes && (
                    <div className="text-xs text-muted-foreground mb-1 line-clamp-1">
                      <span className="font-medium">Notes:</span> {sr.notes}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
                    <span className="text-muted-foreground">Requester: {sr.requester}</span>
                  </div>
                  {/* Business Dimensions */}
                  {(sr.jobCode || sr.marketSegment || sr.event) && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sr.jobCode && (
                        <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.5 rounded-full">
                          {sr.jobCode}
                        </span>
                      )}
                      {sr.marketSegment && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.5 rounded-full">
                          {sr.marketSegment}
                        </span>
                      )}
                      {sr.event && (
                        <span className="text-xs bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 px-1.5 py-0.5 rounded-full">
                          {sr.event}
                        </span>
                      )}
                    </div>
                  )}
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
} 