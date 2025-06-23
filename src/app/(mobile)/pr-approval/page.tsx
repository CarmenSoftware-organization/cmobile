"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

import { Eye, EyeOff, Filter } from "lucide-react";

// Import shared workflow configuration
import {
  getCurrentWorkflowStage,
  canUserActOnPR,
  canUserViewPR,
  mockUsers,
  type PR
} from '@/lib/workflow';

const prApprovals: PR[] = [
  {
    id: 1,
    number: "PR-2001",
    status: "In-progress",
    workflowStage: 1,
    requestor: "Alice Lee",
    department: "F&B",
    date: "2024-06-01",
    value: "S$1,200.00",
    business_unit: "Grand Hotel Singapore",
    role: "HOD", // Stage 1 requires HOD approval
    lastAction: "Submitted for HOD Review (2024-06-01)",
    prType: "General",
    currency: "SGD",
    exchangeRate: 0.74,
    baseCurrency: "USD",
    baseValue: "$888.00"
  },
  {
    id: 2,
    number: "PR-2002",
    status: "Converted",
    workflowStage: 4,
    requestor: "Bob Tan",
    department: "Housekeeping",
    date: "2024-06-02",
    value: "Rp 12,000,000",
    business_unit: "Business Hotel Jakarta",
    role: "Purchasing", // Stage 4 completed by Purchasing (last approver)
    prType: "Market List",
    currency: "IDR",
    exchangeRate: 0.000067,
    baseCurrency: "USD",
    baseValue: "$800.00"
  },
  {
    id: 3,
    number: "PR-2003",
    status: "In-progress",
    workflowStage: 2,
    requestor: "Charlie Lim",
    department: "Engineering",
    date: "2024-06-03",
    value: "฿21,000.00",
    business_unit: "Boutique Hotel Bangkok",
    role: "Finance", // Stage 2 requires Finance approval
    lastAction: "Approved by HOD, submitted for Finance Review (2024-06-03)",
    prType: "General",
    currency: "THB",
    exchangeRate: 0.029,
    baseCurrency: "USD",
    baseValue: "$600.00"
  },
  {
    id: 9,
    number: "PR-2009",
    status: "In-progress",
    workflowStage: 3,
    requestor: "Ivy Chen",
    department: "IT",
    date: "2024-06-09",
    value: "S$3,375.00",
    business_unit: "Grand Hotel Singapore",
    role: "Purchasing", // Stage 3 requires Purchasing approval
    prType: "Market List",
    currency: "SGD",
    exchangeRate: 0.74,
    baseCurrency: "USD",
    baseValue: "$2,500.00"
  },
  {
    id: 4,
    number: "PR-2004",
    status: "Cancelled",
    workflowStage: -3,
    requestor: "Diana Ong",
    department: "F&B",
    date: "2024-06-04",
    value: "$900.00",
    business_unit: "Grand Hotel Singapore",
    role: "HOD", // Last role that handled before cancellation
    prType: "General",
    currency: "USD",
    exchangeRate: 1.0,
    baseCurrency: "USD",
    baseValue: "$900.00"
  },
  {
    id: 5,
    number: "PR-2005",
    status: "Draft",
    workflowStage: 0,
    requestor: "Eddie Goh",
    department: "Front Office",
    date: "2024-06-05",
    value: "Rp 6,750,000",
    business_unit: "Business Hotel Jakarta",
    role: "Requestor", // Stage 0 is owned by Requestor
    prType: "Market List",
    currency: "IDR",
    exchangeRate: 0.000067,
    baseCurrency: "USD",
    baseValue: "$450.00"
  },
  {
    id: 6,
    number: "PR-2006",
    status: "Rejected",
    workflowStage: -1,
    requestor: "Fiona Chua",
    department: "Housekeeping",
    date: "2024-06-06",
    value: "฿38,500.00",
    business_unit: "Boutique Hotel Bangkok",
    role: "Finance", // Rejected by Finance
    prType: "General",
    currency: "THB",
    exchangeRate: 0.029,
    baseCurrency: "USD",
    baseValue: "$1,100.00"
  },
  {
    id: 7,
    number: "PR-2007",
    status: "In-progress",
    workflowStage: 1,
    requestor: "George Tan",
    department: "F&B",
    date: "2024-06-07",
    value: "S$2,700.00",
    business_unit: "Grand Hotel Singapore",
    role: "HOD", // Stage 1 requires HOD approval
    prType: "Market List",
    currency: "SGD",
    exchangeRate: 0.74,
    baseCurrency: "USD",
    baseValue: "$2,000.00"
  },
  {
    id: 8,
    number: "PR-2008",
    status: "Converted",
    workflowStage: 4,
    requestor: "Helen Lee",
    department: "Engineering",
    date: "2024-06-08",
    value: "Rp 10,500,000",
    business_unit: "Business Hotel Jakarta",
    role: "Purchasing", // Stage 4 completed by Purchasing (last approver)
    prType: "General",
    currency: "IDR",
    exchangeRate: 0.000067,
    baseCurrency: "USD",
    baseValue: "$700.00"
  },
  // Additional PRs for better testing coverage
  {
    id: 10,
    number: "PR-2010",
    status: "Returned",
    workflowStage: 1,
    requestor: "John Smith",
    department: "Kitchen",
    date: "2024-06-10",
    value: "$350.00",
    business_unit: "Grand Hotel Singapore", 
    role: "HOD", // Returned to HOD for changes
    lastAction: "Returned by Finance for additional information (2024-06-10)",
    prType: "General",
    currency: "USD",
    exchangeRate: 1.0,
    baseCurrency: "USD",
    baseValue: "$350.00"
  },
  {
    id: 11,
    number: "PR-2011",
    status: "In-progress",
    workflowStage: 2,
    requestor: "Sarah Wilson",
    department: "Housekeeping",
    date: "2024-06-11",
    value: "Rp 11,250,000",
    business_unit: "Business Hotel Jakarta",
    role: "Finance", // Stage 2 requires Finance approval
    prType: "Market List",
    currency: "IDR",
    exchangeRate: 0.000067,
    baseCurrency: "USD",
    baseValue: "$750.00"
  },
  {
    id: 12,
    number: "PR-2012",
    status: "Completed",
    workflowStage: 4,
    requestor: "Mike Johnson",
    department: "Maintenance",
    date: "2024-06-12",
    value: "฿33,250.00",
    business_unit: "Boutique Hotel Bangkok",
    role: "Purchasing", // Completed by Purchasing
    prType: "General",
    currency: "THB",
    exchangeRate: 0.029,
    baseCurrency: "USD",
    baseValue: "$950.00"
  }
];

const allBUs = [
  ...Array.from(new Set(prApprovals.map(pr => pr.business_unit)))
];

interface WorkflowStageDisplay {
  id: number;
  name: string;
  label: string;
}

const fullWorkflowStagesForDisplay: WorkflowStageDisplay[] = [
  { id: 0, name: "Draft", label: "Draft" },
  { id: 1, name: "HOD Review", label: "HOD" },
  { id: 2, name: "Finance Review", label: "Finance" },
  { id: 3, name: "Vendor Allocation", label: "Vendor Alloc." },
  { id: 4, name: "Approved", label: "Approved" }
];

export default function PrApprovalListPage() {
  const [search, setSearch] = useState("");
  const [buFilter, setBuFilter] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<number | null>(null);
  const [prTypeFilter, setPrTypeFilter] = useState<string | null>(null);
  const [sort, setSort] = useState("date-desc");
  const [showOnlyActionable, setShowOnlyActionable] = useState(true);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showFilters, setShowFilters] = useState(false);



  const [currentUserId, setCurrentUserId] = useState("user-hod");
  const currentUser = mockUsers.find(user => user.id === currentUserId) || mockUsers[0];

  // Set default stage filter based on user role after page load and when user changes
  useEffect(() => {
    if (currentUser && currentUser.role) {
      if (currentUser.role === "HOD") setStageFilter(1);
      else if (currentUser.role === "Finance") setStageFilter(2);
      else if (currentUser.role === "Purchasing") setStageFilter(3);
      else setStageFilter(0); // Requestor gets Draft stage (0)
      
      setShowOnlyActionable(true); // Default to actionable items
    }
  }, [currentUser, currentUserId]); // Trigger when user changes

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (buFilter) count++;
    if (stageFilter !== null) count++;
    if (prTypeFilter) count++;
    if (sort !== "date-desc") count++; // Count non-default sort as filter
    return count;
  };

  let filtered = prApprovals.filter(pr => {
    const matchesSearch =
      pr.number.toLowerCase().includes(search.toLowerCase()) ||
      pr.requestor.toLowerCase().includes(search.toLowerCase());
    
    const matchesBU = !buFilter || pr.business_unit === buFilter;
    const matchesStage = stageFilter === null || getCurrentWorkflowStage(pr) === stageFilter;
    const matchesPrType = !prTypeFilter || pr.prType === prTypeFilter;

    let matchesWorkflow = true;
    const hasBusinessUnitAccess = currentUser.businessUnits.includes(pr.business_unit);
    const canUserAct = canUserActOnPR(pr, currentUser.role);
    const canUserView = canUserViewPR(pr, currentUser.role);
    
    // Special filtering for Requestor role - only show Draft PRs waiting for submission
    if (currentUser.role === "Requestor") {
      matchesWorkflow = hasBusinessUnitAccess && 
                       pr.status === "Draft" && 
                       getCurrentWorkflowStage(pr) === 0;
    } else if (showOnlyActionable) {
      // Only show PRs that the user can actually act on (approve/reject)
      matchesWorkflow = canUserAct && hasBusinessUnitAccess;
    } else {
      matchesWorkflow = canUserView && hasBusinessUnitAccess;
    }

    return matchesSearch && matchesBU && matchesStage && matchesPrType && matchesWorkflow;
  });
  if (sort === "date-desc") filtered = filtered.sort((a, b) => b.date.localeCompare(a.date));
  if (sort === "date-asc") filtered = filtered.sort((a, b) => a.date.localeCompare(b.date));
  if (sort === "status") filtered = filtered.sort((a, b) => a.status.localeCompare(b.status));
  if (sort === "bu") filtered = filtered.sort((a, b) => a.business_unit.localeCompare(b.business_unit));

  return (
    <div className="p-0">
      {/* Sticky search/filter bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        {/* Business Unit Selector */}
        <div className="mb-3">
          <select
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={buFilter || ""}
            onChange={e => setBuFilter(e.target.value === "" ? null : e.target.value)}
          >
            <option value="">All Business Units</option>
            {allBUs.map(bu => (
              <option key={bu} value={bu}>{bu}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2 mb-2 items-center">
          <input
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Search PR number or requestor"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-2 text-sm border rounded ${showFilters ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
          >
            <Filter size={16} />
            {getActiveFilterCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>

        {/* Filter Popup Panel */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter Options</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                  >
                    <option value="date-desc">Date ↓</option>
                    <option value="date-asc">Date ↑</option>
                    <option value="status">Stage</option>
                    <option value="bu">Business Unit</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workflow Stage</label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    value={stageFilter === null ? "" : stageFilter.toString()}
                    onChange={e => setStageFilter(e.target.value === "" ? null : parseInt(e.target.value))}
                  >
                    <option value="">All Stages</option>
                    {fullWorkflowStagesForDisplay.map(stage => (
                      <option key={stage.id} value={stage.id.toString()}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PR Type</label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    value={prTypeFilter || ""}
                    onChange={e => setPrTypeFilter(e.target.value === "" ? null : e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="General">General</option>
                    <option value="Market List">Market List</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    setBuFilter(null);
                    setStageFilter(null);
                    setPrTypeFilter(null);
                    setSort("date-desc");
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
      <div className="p-4 space-y-3">
        {/* User Context Info with Toggle */}
        {showUserPanel && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <div className="mb-3 pb-3 border-b border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
                  🧪 Test User Switcher (Development Only)
                </label>
                <button
                  onClick={() => setShowUserPanel(false)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
              <select
                value={currentUserId}
                onChange={(e) => {
                  setCurrentUserId(e.target.value);
                  // Auto-filter to show only In-progress documents for the user's role
                  const newUser = mockUsers.find(user => user.id === e.target.value);
                  if (newUser) {
                    // Set stage filter based on user role
                    if (newUser.role === "HOD") setStageFilter(1);
                    else if (newUser.role === "Finance") setStageFilter(2);
                    else if (newUser.role === "Purchasing") setStageFilter(3);
                    else setStageFilter(0); // Requestor gets Draft stage (0)
                    
                    // Show only actionable items
                    setShowOnlyActionable(true);
                  }
                }}
                className="w-full text-xs border border-blue-300 dark:border-blue-600 rounded px-2 py-1 bg-white dark:bg-blue-800 text-blue-900 dark:text-blue-100"
              >
                {mockUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.businessUnits.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <span className="font-medium">Current Role:</span> {currentUser.role}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  <span className="font-medium">Business Units:</span> {currentUser.businessUnits.join(', ')}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {showOnlyActionable 
                    ? "Showing documents requiring your approval" 
                    : "Showing all documents you have access to"
                  }
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-100">
                <input
                  type="checkbox"
                  checked={showOnlyActionable}
                  onChange={(e) => setShowOnlyActionable(e.target.checked)}
                  className="rounded"
                />
                Action Required Only
              </label>
            </div>
          </div>
        )}

        {/* Show Panel Button when hidden */}
        {!showUserPanel && (
          <button
            onClick={() => setShowUserPanel(true)}
            className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
          >
            <Eye className="w-4 h-4" />
            Show Test User Panel
          </button>
        )}

        {filtered.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            No Purchase Requisitions found for your approval workflow stage.
          </div>
        ) : (
          filtered.map((pr) => {
            const currentPrStageId = getCurrentWorkflowStage(pr);

            // Enhanced stage display logic: show previous, current, and next stages
            let stagesToDisplayInStepper: WorkflowStageDisplay[] = [];
            if (currentPrStageId >= 0 && currentPrStageId < fullWorkflowStagesForDisplay.length) {
              // For normal workflow stages (0-4), show previous, current, next
              const previousStage = currentPrStageId - 1;
              const nextStage = currentPrStageId + 1;
              
              stagesToDisplayInStepper = fullWorkflowStagesForDisplay.filter(stage => {
                // Always include current stage
                if (stage.id === currentPrStageId) return true;
                // Include previous stage if it exists and is >= 0
                if (stage.id === previousStage && previousStage >= 0) return true;
                // Include next stage if it exists and is <= 4 (max normal stage)
                if (stage.id === nextStage && nextStage <= 4) return true;
                return false;
              }).sort((a, b) => a.id - b.id); // Ensure proper order
            } else if (currentPrStageId < 0) {
              // For terminal stages (rejected/cancelled), show the last normal stage they were in
              const lastNormalStage = Math.max(0, Math.min(4, Math.abs(currentPrStageId) - 1));
              stagesToDisplayInStepper = fullWorkflowStagesForDisplay.filter(stage => 
                stage.id >= Math.max(0, lastNormalStage - 1) && stage.id <= Math.min(4, lastNormalStage + 1)
              ).sort((a, b) => a.id - b.id);
            }

            return (
              <Link key={pr.id} href={`/pr-approval/${pr.id}`}>
                <Card className="p-3 flex flex-col gap-1 mb-2 cursor-pointer active:scale-[0.98] transition-transform bg-white dark:bg-gray-800 border-0 shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-gray-900 dark:text-gray-100">{pr.number}</span>
                      {pr.prType && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pr.prType === 'Market List' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'}`}>
                          {pr.prType}
                        </span>
                      )}

                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{pr.business_unit}</span>
                  </div>
                  
                  {stagesToDisplayInStepper.length > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1">
                        {stagesToDisplayInStepper.map((step, displayIdx) => {
                          const isActive = step.id === currentPrStageId;
                          const isDone = step.id < currentPrStageId;
                          const isNext = step.id > currentPrStageId;
                          
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
                                  step.id < currentPrStageId 
                                    ? "bg-green-400 dark:bg-green-500" 
                                    : step.id === currentPrStageId
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

                  <div className="text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">{pr.requestor}</span>
                      <span className="text-gray-600 dark:text-gray-400">{pr.department}</span>
                      <span className="text-gray-600 dark:text-gray-400">{pr.date}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{pr.value}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div></div>
                    {pr.lastAction && pr.lastAction.toLowerCase().includes('return') && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700 rounded">
                        Return for review
                      </span>
                    )}
                  </div>



                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}