"use client";
import Link from "next/link";
import { BusinessUnitLabel } from "@/components/ui/business-unit-label";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ShoppingCart, Calendar, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
  Submitted: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-600",
  "HOD Approved": "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-600",
  Approved: "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-600",
  Fulfilled: "bg-green-200 text-green-900 border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
  "Partially Fulfilled": "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-600",
  Rejected: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-600",
  Returned: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-600",
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
    status: "Submitted",
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
    status: "HOD Approved",
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
    status: "Approved",
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
    status: "Fulfilled",
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
    status: "Partially Fulfilled",
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
    status: "Returned",
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
    status: "Approved",
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

function getPresetRange(preset: string) {
  const today = new Date();
  let from, to;
  if (preset === "Today") {
    from = to = today.toISOString().slice(0, 10);
  } else if (preset === "This Week") {
    const first = new Date(today);
    first.setDate(today.getDate() - today.getDay());
    from = first.toISOString().slice(0, 10);
    to = today.toISOString().slice(0, 10);
  } else if (preset === "This Month") {
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    from = first.toISOString().slice(0, 10);
    to = today.toISOString().slice(0, 10);
  }
  return { from, to };
}

// Add workflow steps for SR
const workflowSteps = [
  { key: "Requestor", label: "Requestor" },
  { key: "HOD", label: "HOD" },
  { key: "Store", label: "Store" },
  { key: "Fulfilled", label: "Fulfilled" },
];

const documentStages = workflowSteps.map(step => step.label);

type SR = typeof storeRequisitions[number];

function getCurrentStep(sr: SR) {
  if (sr.status === "Draft") return 0;
  if (sr.status === "Submitted") return 1;
  if (sr.status === "HOD Approved") return 2;
  if (sr.status === "Approved" || sr.status === "Fulfilled" || sr.status === "Partially Fulfilled") return 3;
  if (sr.status === "Rejected" || sr.status === "Returned") return 1;
  return 0;
}

// Add all possible statuses for the Status filter
const allStatuses = [
  ...Array.from(new Set(storeRequisitions.map(sr => sr.status)))
];

export default function StoreRequisitionPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [deptFilter, setDeptFilter] = useState<string | null>(null);
  const [sort, setSort] = useState("date-desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);

  // Helper: any filter active
  const anyFilterActive = statusFilter || deptFilter || dateFrom || dateTo || search;

  let filtered = storeRequisitions.filter(sr => {
    const matchesSearch =
      sr.number.toLowerCase().includes(search.toLowerCase()) ||
      sr.items.some(item => item.toLowerCase().includes(search.toLowerCase())) ||
      (sr.notes && sr.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = !statusFilter || sr.status === statusFilter;
    const matchesStage = !stageFilter || documentStages[getCurrentStep(sr)] === stageFilter;
    const matchesDept = !deptFilter || sr.department === deptFilter;
    let matchesDate = true;
    if (dateFrom) matchesDate = sr.date >= dateFrom;
    if (matchesDate && dateTo) matchesDate = sr.date <= dateTo;
    return matchesSearch && matchesStatus && matchesStage && matchesDept && matchesDate;
  });
  if (sort === "date-desc") filtered = filtered.sort((a, b) => b.date.localeCompare(a.date));
  if (sort === "date-asc") filtered = filtered.sort((a, b) => a.date.localeCompare(b.date));
  if (sort === "status") filtered = filtered.sort((a, b) => a.status.localeCompare(b.status));
  if (sort === "department") filtered = filtered.sort((a, b) => a.department.localeCompare(b.department));

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter(null);
    setStageFilter(null);
    setDeptFilter(null);
    setDateFrom("");
    setDateTo("");
    setSearch("");
  };

  // Date modal logic
  const handleDatePreset = (preset: string) => {
    if (preset) {
      const { from, to } = getPresetRange(preset);
      setDateFrom(from || "");
      setDateTo(to || "");
    } else {
      setDateFrom("");
      setDateTo("");
    }
    setShowDateModal(false);
  };

  // Sort label
  const sortLabel = sort === "date-desc" ? "Date ↓" : sort === "date-asc" ? "Date ↑" : sort.charAt(0).toUpperCase() + sort.slice(1);

  return (
    <div className="p-0 bg-background min-h-screen pb-20">
      {/* Sticky filter bar */}
      <div className="sticky top-0 z-10 bg-card dark:bg-card p-4 pb-2 border-b border-border shadow-sm">
        <div className="flex gap-2 mb-2 items-center">
          <input
            className="flex-1 border border-input bg-background rounded-md px-3 py-2 text-sm"
            placeholder="Search SR number, item name, or notes"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {anyFilterActive && (
            <button className="text-xs px-3 py-1 rounded bg-gray-100" onClick={clearAllFilters}>
              Clear All
            </button>
          )}
        </div>
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          {/* Status Dropdown */}
          <div className="flex gap-1 items-center">
            <span className="text-xs text-muted-foreground">Status:</span>
            <select
              className="text-xs border border-input bg-background rounded-md px-2 py-1"
              value={statusFilter || ""}
              onChange={e => setStatusFilter(e.target.value === "" ? null : e.target.value)}
            >
              <option value="">All</option>
              {allStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          {/* Stage Dropdown */}
          <div className="flex gap-1 items-center">
            <span className="text-xs text-muted-foreground">Stage:</span>
            <select
              className="text-xs border border-input bg-background rounded-md px-2 py-1"
              value={stageFilter || ""}
              onChange={e => setStageFilter(e.target.value === "" ? null : e.target.value)}
            >
              <option value="">All</option>
              {documentStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
          {/* Department Dropdown */}
          <div className="flex gap-1 items-center">
            <span className="text-xs text-muted-foreground">Dept:</span>
            <select
              className="text-xs border border-input bg-background rounded-md px-2 py-1"
              value={deptFilter || ""}
              onChange={e => setDeptFilter(e.target.value === "" ? null : e.target.value)}
            >
              <option value="">All</option>
              {allDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          {/* Date Range Button */}
          <button
            onClick={() => setShowDateModal(true)}
            className="text-xs px-3 py-1 rounded bg-gray-100 border border-input"
          >
            Date: {dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : "All"}
          </button>
          {/* Sort Button */}
          <button
            onClick={() => setSort(sort === "date-desc" ? "date-asc" : "date-desc")}
            className="text-xs px-2 py-1 rounded bg-gray-100 border border-input"
          >
            Sort: {sortLabel}
          </button>
        </div>
        {/* Active Filter Chips */}
        <div className="flex gap-1 mt-1 flex-wrap">
          {statusFilter && (
            <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
              Status: {statusFilter}
              <button className="ml-1" onClick={() => setStatusFilter(null)}>×</button>
            </span>
          )}
          {stageFilter && (
            <span className="bg-indigo-100 text-indigo-800 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
              Stage: {stageFilter}
              <button className="ml-1" onClick={() => setStageFilter(null)}>×</button>
            </span>
          )}
          {deptFilter && (
            <span className="bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
              Dept: {deptFilter}
              <button className="ml-1" onClick={() => setDeptFilter(null)}>×</button>
            </span>
          )}
          {dateFrom && dateTo && (
            <span className="bg-gray-100 text-gray-800 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
              Date: {dateFrom} - {dateTo}
              <button className="ml-1" onClick={() => { setDateFrom(""); setDateTo(""); }}>×</button>
            </span>
          )}
          {search && (
            <span className="bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
              Search: {search}
              <button className="ml-1" onClick={() => setSearch("")}>×</button>
            </span>
          )}
        </div>
        {/* Date Modal (simple popover/modal) */}
        {showDateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-80 max-w-full">
              <div className="mb-3 font-semibold">Select Date Range</div>
              <div className="flex flex-col gap-2 mb-4">
                <button className="text-xs px-3 py-2 rounded bg-gray-100" onClick={() => handleDatePreset("Today")}>Today</button>
                <button className="text-xs px-3 py-2 rounded bg-gray-100" onClick={() => handleDatePreset("This Week")}>This Week</button>
                <button className="text-xs px-3 py-2 rounded bg-gray-100" onClick={() => handleDatePreset("This Month")}>This Month</button>
                <button className="text-xs px-3 py-2 rounded bg-gray-100" onClick={() => handleDatePreset("")}>All Dates</button>
                <div className="flex gap-2 items-center mt-2">
                  <input
                    type="date"
                    className="text-xs border border-input bg-background rounded-md px-2 py-1 flex-1"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    max={dateTo}
                  />
                  <span className="text-xs text-muted-foreground">-</span>
                  <input
                    type="date"
                    className="text-xs border border-input bg-background rounded-md px-2 py-1 flex-1"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    min={dateFrom}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button className="text-xs px-3 py-1 rounded bg-gray-200" onClick={() => setShowDateModal(false)}>Cancel</button>
                <button className="text-xs px-3 py-1 rounded bg-blue-600 text-white" onClick={() => setShowDateModal(false)}>Apply</button>
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
            const current = getCurrentStep(sr);
            return (
              <Link key={sr.id} href={`/store-requisition/${sr.id}`}>
                <Card className="p-3 flex flex-col gap-1 mb-2 cursor-pointer active:scale-[0.98] transition-transform bg-card dark:bg-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base">{sr.number}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={`border text-xs ${statusColors[sr.status] || "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"}`}>{sr.status}</Badge>
                      <Badge className="border text-xs bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700">Stage: {workflowSteps[current].label}</Badge>
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
                    <BusinessUnitLabel assignedBusinessUnits={[{ id: 1, name: sr.business_unit }]} />
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