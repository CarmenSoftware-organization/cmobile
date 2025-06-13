"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, Users, Play, RotateCcw, CheckCircle, ChevronDown } from "lucide-react";

const mockLocations = [
  { id: 1, name: "Main Store", type: "Count", bu: "Grand Hotel Singapore", itemCount: 150, startDate: "2024-06-01", status: "In-progress", progress: 65, countedItems: 98 },
  { id: 2, name: "Bar", type: "Count", bu: "Grand Hotel Singapore", itemCount: 89, startDate: "2024-06-02", status: "In-progress", progress: 30, countedItems: 27 },
  { id: 3, name: "Kitchen", type: "Count", bu: "Grand Hotel Singapore", itemCount: 200, startDate: "2024-06-01", status: "In-progress", progress: 85, countedItems: 170 },
  { id: 4, name: "Housekeeping", type: "Not Count", bu: "Business Hotel Jakarta", itemCount: 95, startDate: null, status: "Not Started", progress: 0, countedItems: 0 },
  { id: 5, name: "Housekeeping Storage", type: "Count", bu: "Business Hotel Jakarta", itemCount: 78, startDate: "2024-06-03", status: "In-progress", progress: 12, countedItems: 9 },
  { id: 6, name: "Conference Room Storage", type: "Not Count", bu: "Business Hotel Jakarta", itemCount: 45, startDate: null, status: "Not Started", progress: 0, countedItems: 0 },
  { id: 7, name: "Spa Storage", type: "Count", bu: "Grand Hotel Singapore", itemCount: 35, startDate: "2024-06-02", status: "Complete", progress: 100, countedItems: 35 },
  { id: 8, name: "Maintenance Workshop", type: "Not Count", bu: "Grand Hotel Singapore", itemCount: 0, startDate: null, status: "Not Started", progress: 0, countedItems: 0 },
];

const mockPeriods = [
  { id: "2024-06", name: "June 2024", status: "Current", endDate: "2024-06-30", isOpen: true },
  { id: "2024-05", name: "May 2024", status: "Closed", endDate: "2024-05-31", isOpen: false },
  { id: "2024-04", name: "April 2024", status: "Closed", endDate: "2024-04-30", isOpen: false },
];

export default function PhysicalCountPage() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [includeNotCount, setIncludeNotCount] = useState(false);
  const [selectedBU, setSelectedBU] = useState("All");
  const router = useRouter();

  // Get unique business units for the selector
  const businessUnits = ["All", ...Array.from(new Set(mockLocations.map(loc => loc.bu)))];

  const selectedPeriodData = mockPeriods.find(p => p.id === "2024-06");
  
  // Show count locations and optionally not count locations
  const filteredLocations = mockLocations.filter(location => {
    if (includeNotCount) {
      return true; // Show all locations
    }
    return location.type === "Count"; // Only show count locations
  });
  


  const handleStartCount = () => {
    if (selectedLocation) {
      const sessionId = `${selectedLocation}-2024-06`;
      router.push(`/physical-count/session/${sessionId}/count`);
    }
  };

  const getButtonContent = (location: typeof mockLocations[0]) => {
    if (location.status === "Not Started") {
      return (
        <>
          <Play className="w-4 h-4 mr-2" />
          Start
        </>
      );
    }
    if (location.status === "In-progress") {
      return (
        <>
          <RotateCcw className="w-4 h-4 mr-2" />
          Resume
        </>
      );
    }
    if (location.status === "Complete") {
      return (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Done
        </>
      );
    }
    return (
      <>
        <Play className="w-4 h-4 mr-2" />
        Start
      </>
    );
  };

  const getButtonColor = (location: typeof mockLocations[0]) => {
    if (location.status === "Not Started") return "bg-blue-600 hover:bg-blue-700";
    if (location.status === "In-progress") return "bg-orange-600 hover:bg-orange-700";
    if (location.status === "Complete") return "bg-green-600 hover:bg-green-700";
    return "bg-blue-600 hover:bg-blue-700";
  };



  return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col pt-4 flex-1 p-2 gap-4">
        {/* Business Unit Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="relative">
            <select
              value={selectedBU}
              onChange={(e) => setSelectedBU(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {businessUnits.map((bu) => (
                <option key={bu} value={bu}>
                  {bu}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Period Display (Read-only) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <label className="font-medium mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Counting Period
          </label>
          
          <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {selectedPeriodData?.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Ends: {selectedPeriodData?.endDate} • {selectedPeriodData?.status}
            </div>
          </div>

          {selectedPeriodData && !selectedPeriodData.isOpen && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Period Closed</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                This period is closed. Counts can be viewed but not modified.
              </p>
            </div>
          )}
        </div>

        {/* Location Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Current Period Count Locations
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
          

          
          <div className="space-y-3">
            {filteredLocations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No locations available for physical count.</p>
              </div>
            ) : (
              filteredLocations.map(location => (
                <div
                  key={location.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{location.name}</div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          location.type === "Count" 
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                        }`}>
                          {location.type === "Count" ? "Count" : "Not Count"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{location.bu}</div>
                      
                      {/* Progress Information */}
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {location.countedItems} / {location.itemCount} ({location.progress}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              location.status === "Complete" 
                                ? "bg-green-500" 
                                : location.status === "In-progress"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                            }`}
                            style={{ width: `${location.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors text-white ${getButtonColor(location)} ${
                          location.status === "Complete" ? "cursor-default opacity-75" : ""
                        }`}
                        onClick={() => {
                          setSelectedLocation(location.id);
                          if (location.status !== "Complete") {
                            handleStartCount();
                          }
                        }}
                        disabled={location.status === "Complete"}
                      >
                        {getButtonContent(location)}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {location.itemCount} items
                    </span>
                    {location.startDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Started: {location.startDate}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


        {/* Help Text */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Current Period Count Status</h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div><strong>Not Started:</strong> Click &quot;Start&quot; to begin counting this location</div>
            <div><strong>In-progress:</strong> Click &quot;Resume&quot; to continue counting where you left off</div>
            <div><strong>Complete:</strong> Counting is finished for this location</div>
          </div>
        </div>
      </main>
  );
}

// ...rest of file
