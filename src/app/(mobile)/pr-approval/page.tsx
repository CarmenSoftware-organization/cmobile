"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BusinessUnitLabel } from "@/components/ui/business-unit-label";

const statusColors: Record<string, string> = {
  Pending: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
  Approved: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
  Rejected: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
  Returned: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
  Overdue: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
};

const prApprovals = [
  {
    id: 1,
    number: "PR-2001",
    status: "Pending",
    requestor: "Alice Lee",
    department: "F&B",
    date: "2024-06-01",
    value: "$1,200.00",
    business_unit: "Grand Hotel Singapore",
    role: "HOD",
  },
  {
    id: 2,
    number: "PR-2002",
    status: "Approved",
    requestor: "Bob Tan",
    department: "Housekeeping",
    date: "2024-06-02",
    value: "$800.00",
    business_unit: "Business Hotel Jakarta",
    role: "Finance",
  },
  {
    id: 3,
    number: "PR-2003",
    status: "Pending",
    requestor: "Charlie Lim",
    department: "Engineering",
    date: "2024-06-03",
    value: "$600.00",
    business_unit: "Boutique Hotel Bangkok",
    role: "HOD",
  },
  {
    id: 4,
    number: "PR-2004",
    status: "Returned",
    requestor: "Diana Ong",
    department: "F&B",
    date: "2024-06-04",
    value: "$900.00",
    business_unit: "Grand Hotel Singapore",
    role: "Finance",
  },
  {
    id: 5,
    number: "PR-2005",
    status: "Overdue",
    requestor: "Eddie Goh",
    department: "Front Office",
    date: "2024-06-05",
    value: "$450.00",
    business_unit: "Business Hotel Jakarta",
    role: "HOD",
  },
  {
    id: 6,
    number: "PR-2006",
    status: "Rejected",
    requestor: "Fiona Chua",
    department: "Housekeeping",
    date: "2024-06-06",
    value: "$1,100.00",
    business_unit: "Boutique Hotel Bangkok",
    role: "Finance",
  },
  {
    id: 7,
    number: "PR-2007",
    status: "Pending",
    requestor: "George Tan",
    department: "F&B",
    date: "2024-06-07",
    value: "$2,000.00",
    business_unit: "Grand Hotel Singapore",
    role: "HOD",
  },
  {
    id: 8,
    number: "PR-2008",
    status: "Pending",
    requestor: "Helen Lee",
    department: "Engineering",
    date: "2024-06-08",
    value: "$700.00",
    business_unit: "Business Hotel Jakarta",
    role: "Finance",
  },
];

const allStatuses = [
  ...Array.from(new Set(prApprovals.map(pr => pr.status)))
];
const allBUs = [
  ...Array.from(new Set(prApprovals.map(pr => pr.business_unit)))
];

// Add mock workflow steps for each PR
const workflowSteps = [
  { key: "Requestor", label: "Requestor" },
  { key: "HOD", label: "HOD" },
  { key: "Finance", label: "Finance" },
];

type PR = {
  id: number;
  number: string;
  status: string;
  requestor: string;
  department: string;
  date: string;
  value: string;
  business_unit: string;
  role: string;
};

function getCurrentStep(pr: PR) {
  if (pr.status === "Pending" && pr.role === "HOD") return 1;
  if (pr.status === "Pending" && pr.role === "Finance") return 2;
  if (pr.status === "Approved") return 3;
  if (pr.status === "Rejected" || pr.status === "Returned") return 2;
  if (pr.status === "Overdue") return 1;
  return 0;
}

function getPresetRange(preset: string) {
  const today = new Date();
  let from: string | undefined, to: string | undefined;
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
  return { from: from || "", to: to || "" };
}

export default function PrApprovalListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [buFilter, setBuFilter] = useState<string | null>(null);
  const [sort, setSort] = useState("date-desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [datePreset, setDatePreset] = useState("");
  const [showOnlyActionable, setShowOnlyActionable] = useState(true);

  // Mock users for testing - in real app, this would come from auth/context
  const mockUsers = [
    {
      id: "user-hod",
      name: "Alice Manager (HOD)",
      role: "HOD",
      businessUnits: ["Grand Hotel Singapore", "Business Hotel Jakarta"],
      department: "F&B"
    },
    {
      id: "user-finance",
      name: "Bob Finance (Finance)",
      role: "Finance", 
      businessUnits: ["Grand Hotel Singapore", "Boutique Hotel Bangkok"],
      department: "Finance"
    },
    {
      id: "user-requestor",
      name: "Charlie Staff (Requestor)",
      role: "Requestor",
      businessUnits: ["Business Hotel Jakarta"],
      department: "Operations"
    }
  ];

  const [currentUserId, setCurrentUserId] = useState("user-hod");
  const currentUser = mockUsers.find(user => user.id === currentUserId) || mockUsers[0];

  let filtered = prApprovals.filter(pr => {
    const matchesSearch =
      pr.number.toLowerCase().includes(search.toLowerCase()) ||
      pr.requestor.toLowerCase().includes(search.toLowerCase());
    
    // Basic filters
    const matchesStatus = !statusFilter || pr.status === statusFilter;
    const matchesBU = !buFilter || pr.business_unit === buFilter;
    let matchesDate = true;
    if (dateFrom) matchesDate = pr.date >= dateFrom;
    if (matchesDate && dateTo) matchesDate = pr.date <= dateTo;

    // Workflow-based filtering for pending documents
    let matchesWorkflow = true;
    const hasBusinessUnitAccess = currentUser.businessUnits.includes(pr.business_unit);
    const isActionableByUser = pr.status === "Pending" && pr.role === currentUser.role && hasBusinessUnitAccess;
    
    if (showOnlyActionable) {
      // Show only documents that require user's action OR completed documents from user's BUs
      matchesWorkflow = isActionableByUser || (pr.status !== "Pending" && hasBusinessUnitAccess);
    } else {
      // Show all documents user has access to
      matchesWorkflow = hasBusinessUnitAccess;
    }

    return matchesSearch && matchesStatus && matchesBU && matchesDate && matchesWorkflow;
  });
  if (sort === "date-desc") filtered = filtered.sort((a, b) => b.date.localeCompare(a.date));
  if (sort === "date-asc") filtered = filtered.sort((a, b) => a.date.localeCompare(b.date));
  if (sort === "status") filtered = filtered.sort((a, b) => a.status.localeCompare(b.status));
  if (sort === "bu") filtered = filtered.sort((a, b) => a.business_unit.localeCompare(b.business_unit));

  return (
    <div className="p-0">
      {/* Sticky search/filter bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Search PR number or requestor"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <div className="flex gap-1 items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Status:</span>
            <select
              className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={statusFilter || ""}
              onChange={e => setStatusFilter(e.target.value === "" ? null : e.target.value)}
            >
              <option value="">All</option>
              {allStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">BU:</span>
            <select
              className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={buFilter || ""}
              onChange={e => setBuFilter(e.target.value === "" ? null : e.target.value)}
            >
              <option value="">All</option>
              {allBUs.map(bu => (
                <option key={bu} value={bu}>{bu}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Date:</span>
            <select
              className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={datePreset}
              onChange={e => {
                setDatePreset(e.target.value);
                if (e.target.value) {
                  const { from, to } = getPresetRange(e.target.value);
                  setDateFrom(from);
                  setDateTo(to);
                } else {
                  setDateFrom("");
                  setDateTo("");
                }
              }}
            >
              <option value="">All</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
            <input
              type="date"
              className="text-xs border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={dateFrom}
              onChange={e => {
                setDateFrom(e.target.value);
                setDatePreset("");
              }}
              max={dateTo}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">-</span>
            <input
              type="date"
              className="text-xs border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={dateTo}
              onChange={e => {
                setDateTo(e.target.value);
                setDatePreset("");
              }}
              min={dateFrom}
            />
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Sort:</span>
            <select
              className="text-xs border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="date-desc">Date ↓</option>
              <option value="date-asc">Date ↑</option>
              <option value="status">Status</option>
              <option value="bu">BU</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {/* User Context Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          {/* User Switcher for Testing */}
          <div className="mb-3 pb-3 border-b border-blue-200 dark:border-blue-700">
            <label className="block text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
              🧪 Test User Switcher (Development Only)
            </label>
            <select
              value={currentUserId}
              onChange={(e) => setCurrentUserId(e.target.value)}
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

        {filtered.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            No Purchase Requisitions found for your approval workflow stage.
          </div>
        ) : (
          filtered.map((pr) => {
            const isActionable = pr.status === "Pending" && pr.role === currentUser.role;
            return (
              <Link key={pr.id} href={`/pr-approval/${pr.id}`}>
                <Card className={`p-3 flex flex-col gap-1 mb-2 cursor-pointer active:scale-[0.98] transition-transform bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${isActionable ? 'ring-2 ring-blue-500 dark:ring-blue-400 ring-opacity-50' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-gray-900 dark:text-gray-100">{pr.number}</span>
                      {isActionable && (
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs px-2 py-0.5 rounded-full font-medium">
                          Action Required
                        </span>
                      )}
                    </div>
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusColors[pr.status] || "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>{pr.status}</span>
                  </div>
                {/* Approval Workflow Stepper */}
                <div className="flex items-center gap-1 mb-1">
                  {workflowSteps.map((step, idx) => {
                    const current = getCurrentStep(pr);
                    const isActive = idx === current;
                    const isDone = idx < current;
                    return (
                      <div key={step.key} className="flex items-center">
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 ${isActive ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500" : isDone ? "bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600" : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-500"}`}>{idx+1}</div>
                        <span className={`ml-1 mr-2 text-xs ${isActive ? "font-semibold text-blue-700 dark:text-blue-400" : isDone ? "text-green-700 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}>{step.label}</span>
                        {idx < workflowSteps.length - 1 && <span className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1" />}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{pr.requestor}</span>
                  <span className="text-gray-600 dark:text-gray-400">{pr.department}</span>
                  <span className="text-gray-600 dark:text-gray-400">{pr.date}</span>
                  <span className="text-gray-600 dark:text-gray-400">{pr.value}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <BusinessUnitLabel assignedBusinessUnits={[{ id: 1, name: pr.business_unit }]} />
                  <span className="text-gray-600 dark:text-gray-400">Role: {pr.role}</span>
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