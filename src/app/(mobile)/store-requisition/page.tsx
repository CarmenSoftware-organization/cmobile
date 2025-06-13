"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ShoppingCart, Calendar, Package, Filter, X } from "lucide-react";
// Import store requisition workflow configuration
import {
  getCurrentSRWorkflowStage,
  storeRequisitionWorkflowConfig,
  type StoreRequisition
} from '@/lib/workflow';

const storeRequisitions: StoreRequisition[] = [
  {
    id: 1,
    number: "SR-001",
    status: "Draft",
    workflowStage: 0,
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
    workflowStage: 1,
    department: "Housekeeping",
    date: "2024-06-02",
    itemCount: 3,
    business_unit: "Business Hotel Jakarta",
    requester: "Bob Tan",
    items: ["Laundry Detergent", "Towels", "Soap"],
    jobCode: "JC-2025-002",
    marketSegment: "Rooms",
    event: null,
    notes: "Monthly supply replenishment",
    lastAction: "Submitted for Department Review (2024-06-02)"
  },
  {
    id: 3,
    number: "SR-003",
    status: "Issued",
    workflowStage: 4,
    department: "Engineering",
    date: "2024-06-03",
    itemCount: 4,
    business_unit: "Boutique Hotel Bangkok",
    requester: "Charlie Lim",
    items: ["Light Bulbs", "Wrench", "Screws", "Tape"],
    jobCode: "JC-2025-003",
    marketSegment: "General",
    event: null,
    notes: "Maintenance supplies",
    lastAction: "Items issued to Engineering department (2024-06-03)"
  },
  {
    id: 4,
    number: "SR-004",
    status: "In-progress",
    workflowStage: 3,
    department: "F&B",
    date: "2024-06-04",
    itemCount: 2,
    business_unit: "Grand Hotel Singapore",
    requester: "Diana Ong",
    items: ["Wine Glasses", "Plates"],
    jobCode: "JC-2025-001",
    marketSegment: "F&B",
    event: "Corporate Retreat",
    notes: "For executive dinner service",
    lastAction: "Approved by Store Manager, ready for issue (2024-06-04)"
  },
  {
    id: 5,
    number: "SR-005",
    status: "Issued",
    workflowStage: 4,
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
    workflowStage: 2,
    department: "Housekeeping",
    date: "2024-06-06",
    itemCount: 3,
    business_unit: "Boutique Hotel Bangkok",
    requester: "Fiona Chua",
    items: ["Pillow Cases", "Blankets", "Sheets"],
    jobCode: "JC-2025-003",
    marketSegment: "Rooms",
    event: null,
    notes: "Regular room supplies",
    lastAction: "Approved by Department, submitted for Store Review (2024-06-06)"
  },
  {
    id: 7,
    number: "SR-007",
    status: "Rejected",
    workflowStage: -1,
    department: "F&B",
    date: "2024-06-07",
    itemCount: 1,
    business_unit: "Grand Hotel Singapore",
    requester: "George Tan",
    items: ["Champagne"],
    jobCode: "JC-2025-001",
    marketSegment: "F&B",
    event: "Wedding",
    notes: "Premium champagne for wedding reception",
    lastAction: "Rejected by Department - Budget exceeded (2024-06-07)"
  },
  {
    id: 8,
    number: "SR-008",
    status: "Cancel",
    workflowStage: -2,
    department: "Engineering",
    date: "2024-06-08",
    itemCount: 2,
    business_unit: "Business Hotel Jakarta",
    requester: "Helen Lee",
    items: ["Hammer", "Drill"],
    jobCode: "JC-2025-002",
    marketSegment: "General",
    event: null,
    notes: "Need additional approval for power tools",
    lastAction: "Cancelled by Requestor (2024-06-08)"
  },
  {
    id: 9,
    number: "SR-009",
    status: "Draft",
    workflowStage: 0,
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
    status: "Issued",
    workflowStage: 4,
    department: "Housekeeping",
    date: "2024-06-10",
    itemCount: 2,
    business_unit: "Grand Hotel Singapore",
    requester: "Jane Ng",
    items: ["Vacuum Cleaner", "Mop"],
    jobCode: "JC-2025-001",
    marketSegment: "Rooms",
    event: null,
    notes: "Replacement cleaning equipment",
    lastAction: "Items issued to Housekeeping department (2024-06-10)"
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
            const currentSRStageId = getCurrentSRWorkflowStage(sr);
            
            // Enhanced stage display logic: show previous, current, and next stages
            let stagesToDisplayInStepper: Array<{id: number; label: string}> = [];
            if (currentSRStageId >= 0 && currentSRStageId < storeRequisitionWorkflowConfig.stages.length) {
              // For normal workflow stages (0-4), show previous, current, next
              const previousStage = currentSRStageId - 1;
              const nextStage = currentSRStageId + 1;
              
              stagesToDisplayInStepper = storeRequisitionWorkflowConfig.stages.filter(stage => {
                // Always include current stage
                if (stage.id === currentSRStageId) return true;
                // Include previous stage if it exists and is >= 0
                if (stage.id === previousStage && previousStage >= 0) return true;
                // Include next stage if it exists and is <= 4 (max normal stage)
                if (stage.id === nextStage && nextStage <= 4) return true;
                return false;
              }).sort((a, b) => a.id - b.id); // Ensure proper order
            } else if (currentSRStageId < 0) {
              // For terminal stages (rejected/cancelled), show the last normal stage they were in
              const lastNormalStage = Math.max(0, Math.min(4, Math.abs(currentSRStageId) - 1));
              stagesToDisplayInStepper = storeRequisitionWorkflowConfig.stages.filter(stage => 
                stage.id >= Math.max(0, lastNormalStage - 1) && stage.id <= Math.min(4, lastNormalStage + 1)
              ).sort((a, b) => a.id - b.id);
            }

            return (
              <Link key={sr.id} href={`/store-requisition/${sr.id}`}>
                <Card className="p-3 flex flex-col gap-1 mb-2 cursor-pointer active:scale-[0.98] transition-transform bg-card dark:bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-base">{sr.number}</span>
                      <span className="text-sm text-muted-foreground">{sr.business_unit}</span>
                    </div>
                  </div>
                  
                  {stagesToDisplayInStepper.length > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1">
                        {stagesToDisplayInStepper.map((step, displayIdx) => {
                          const isActive = step.id === currentSRStageId;
                          const isDone = step.id < currentSRStageId;
                          const isNext = step.id > currentSRStageId;
                          
                          return (
                            <div key={step.id} className="flex items-center">
                              <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 ${
                                isActive 
                                  ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500" 
                                  : isDone 
                                    ? "bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600" 
                                    : isNext
                                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-500"
                                      : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-500"
                              }`}>
                                {step.id + 1} 
                              </div>
                              <span className={`ml-1 text-xs ${
                                isActive 
                                  ? "font-semibold text-blue-700 dark:text-blue-400" 
                                  : isDone 
                                    ? "text-green-700 dark:text-green-400" 
                                    : isNext
                                      ? "text-gray-600 dark:text-gray-300"
                                      : "text-gray-400 dark:text-gray-500"
                              }`}>
                                {step.label}
                              </span>
                              {displayIdx < stagesToDisplayInStepper.length - 1 && (
                                <div className={`w-4 h-0.5 mx-2 ${
                                  step.id < currentSRStageId 
                                    ? "bg-green-400 dark:bg-green-500" 
                                    : step.id === currentSRStageId
                                      ? "bg-blue-400 dark:bg-blue-500"
                                      : "bg-gray-300 dark:bg-gray-600"
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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

                  {/* Show Last Action for any SR that has one */}
                  {sr.lastAction && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Last Action:</span> {sr.lastAction}
                      </div>
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