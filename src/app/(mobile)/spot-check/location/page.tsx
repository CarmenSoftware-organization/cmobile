"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Users, Search, Play, Eye, CheckCircle, ChevronDown } from "lucide-react";

type CountStatus = "not_started" | "in_progress" | "completed";

interface LocationWithStatus {
  id: number;
  name: string;
  bu: string;
  itemCount: number;
  lastSpotCheck: string;
  riskLevel: string;
  description: string;
  countStatus: CountStatus;
  lastSessionId?: number;
  type: "Count" | "Not Count";
}

const mockLocations: LocationWithStatus[] = [
  { 
    id: 1, 
    name: "Main Store", 
    bu: "Grand Hotel Singapore",
    itemCount: 245,
    lastSpotCheck: "2024-06-10",
    riskLevel: "Medium",
    description: "Primary inventory storage and distribution center",
    countStatus: "in_progress",
    lastSessionId: 201,
    type: "Count"
  },
  { 
    id: 2, 
    name: "Bar Storage", 
    bu: "Grand Hotel Singapore",
    itemCount: 89,
    lastSpotCheck: "2024-06-08",
    riskLevel: "High",
    description: "Beverage inventory and bar supplies",
    countStatus: "completed",
    lastSessionId: 202,
    type: "Count"
  },
  { 
    id: 3, 
    name: "Kitchen Storage", 
    bu: "Business Hotel Jakarta",
    itemCount: 156,
    lastSpotCheck: "2024-06-05",
    riskLevel: "Low",
    description: "Food and beverage storage area",
    countStatus: "not_started",
    type: "Count"
  },
  { 
    id: 4, 
    name: "Housekeeping Storage", 
    bu: "Grand Hotel Singapore",
    itemCount: 312,
    lastSpotCheck: "2024-06-12",
    riskLevel: "Medium",
    description: "Cleaning supplies and linens",
    countStatus: "not_started",
    type: "Not Count"
  },
  { 
    id: 5, 
    name: "Pool Equipment Room", 
    bu: "Business Hotel Jakarta",
    itemCount: 78,
    lastSpotCheck: "2024-06-07",
    riskLevel: "Low",
    description: "Pool maintenance and chemical storage",
    countStatus: "not_started",
    type: "Not Count"
  },
];

export default function SpotCheckLocationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [includeNotCount, setIncludeNotCount] = useState(false);
  const [selectedBU, setSelectedBU] = useState("All");
  const [statusFilter, setStatusFilter] = useState<CountStatus | "all">("all");
  
  const router = useRouter();

  // Get unique business units
  const businessUnits = ["All", ...Array.from(new Set(mockLocations.map(loc => loc.bu)))];

  const filteredLocations = mockLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.bu.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBU = selectedBU === "All" || location.bu === selectedBU;
    const matchesStatus = statusFilter === "all" || location.countStatus === statusFilter;
    
    if (!includeNotCount) {
      // Only show locations with type "Count"
      return matchesSearch && matchesBU && matchesStatus && location.type === "Count";
    }
    
    // Include all locations when "Include Not Count" is checked
    return matchesSearch && matchesBU && matchesStatus;
  });

  // Group locations by status for better organization
  const locationsByStatus = {
    in_progress: filteredLocations.filter(l => l.countStatus === "in_progress"),
    not_started: filteredLocations.filter(l => l.countStatus === "not_started"),
    completed: filteredLocations.filter(l => l.countStatus === "completed")
  };



  const getTypeColor = (type: "Count" | "Not Count") => {
    switch (type) {
      case "Count": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Not Count": return "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300";
    }
  };

  const getActionButton = (location: LocationWithStatus) => {
    switch (location.countStatus) {
      case "not_started":
        return {
          text: "Start",
          icon: Play,
          className: "bg-blue-600 hover:bg-blue-700 text-white",
          action: () => router.push(`/spot-check/method?location=${encodeURIComponent(location.name)}&locationId=${location.id}`)
        };
      case "in_progress":
        return {
          text: "Resume",
          icon: Play,
          className: "bg-orange-600 hover:bg-orange-700 text-white",
          action: () => location.lastSessionId ? router.push(`/spot-check/session/${location.lastSessionId}/count`) : router.push(`/spot-check/method?location=${encodeURIComponent(location.name)}&locationId=${location.id}`)
        };
      case "completed":
        return {
          text: "Review",
          icon: Eye,
          className: "bg-green-600 hover:bg-green-700 text-white",
          action: () => location.lastSessionId ? router.push(`/spot-check/session/${location.lastSessionId}/review`) : router.push(`/spot-check/method?location=${encodeURIComponent(location.name)}&locationId=${location.id}`)
        };
      default:
        return {
          text: "Start",
          icon: Play,
          className: "bg-blue-600 hover:bg-blue-700 text-white",
          action: () => router.push(`/spot-check/method?location=${encodeURIComponent(location.name)}&locationId=${location.id}`)
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        {/* Business Unit Selector */}
        <div className="mb-4">
          <div className="relative">
            <select 
              value={selectedBU}
              onChange={(e) => setSelectedBU(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
            >
              {businessUnits.map(bu => (
                <option key={bu} value={bu}>{bu}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-600 dark:text-blue-400 font-medium">Step 1: Location</span>
            <span className="text-gray-500 dark:text-gray-400">Step 2: Method & Items</span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1 mt-2">
            <div className="bg-blue-600 h-1 rounded-full" style={{ width: "50%" }}></div>
          </div>
        </div>


      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* Status Filter Summary */}
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg p-3 text-center border transition-colors ${
              statusFilter === "all"
                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            }`}
          >
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {filteredLocations.length + (statusFilter !== "all" ? mockLocations.filter(l => (includeNotCount ? true : l.type === "Count") && (selectedBU === "All" || l.bu === selectedBU)).length - filteredLocations.length : 0)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">All</div>
          </button>
          
          <button
            onClick={() => setStatusFilter("in_progress")}
            className={`rounded-lg p-3 text-center border transition-colors ${
              statusFilter === "in_progress"
                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            }`}
          >
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{locationsByStatus.in_progress.length}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">In Progress</div>
          </button>
          
          <button
            onClick={() => setStatusFilter("not_started")}
            className={`rounded-lg p-3 text-center border transition-colors ${
              statusFilter === "not_started"
                ? "bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            }`}
          >
            <div className="text-lg font-bold text-gray-700 dark:text-gray-300">{locationsByStatus.not_started.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Not Started</div>
          </button>
          
          <button
            onClick={() => setStatusFilter("completed")}
            className={`rounded-lg p-3 text-center border transition-colors ${
              statusFilter === "completed"
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            }`}
          >
            <div className="text-lg font-bold text-green-700 dark:text-green-300">{locationsByStatus.completed.length}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Completed</div>
          </button>
        </div>

        {/* Location Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Select Location to Count
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeNotCount"
                checked={includeNotCount}
                onChange={(e) => setIncludeNotCount(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="includeNotCount" className="text-sm text-gray-700 dark:text-gray-300">
                Include Not Count
              </label>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search locations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            {filteredLocations.map(location => {
              const actionButton = getActionButton(location);
              const ActionIcon = actionButton.icon;
              
              return (
                <div
                  key={location.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{location.name}</div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(location.type)}`}>
                          {location.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{location.bu}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{location.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${actionButton.className}`}
                        onClick={actionButton.action}
                      >
                        <ActionIcon className="w-4 h-4" />
                        {actionButton.text}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {location.itemCount} items
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last check: {location.lastSpotCheck}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Quick Guide
          </h4>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <div>• <strong>Start:</strong> Begin a new spot check for this location</div>
            <div>• <strong>Resume:</strong> Continue an existing spot check session</div>
            <div>• <strong>Review:</strong> View completed spot check results</div>
          </div>
        </div>


      </main>
    </div>
  );
}