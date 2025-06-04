"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, Users, ChevronDown, Settings } from "lucide-react";

const mockLocations = [
  { id: 1, name: "Main Store", type: "Count", bu: "Grand Hotel Singapore", itemCount: 150, lastCount: "2024-05-15" },
  { id: 2, name: "Bar", type: "Issue Balance", bu: "Grand Hotel Singapore", itemCount: 89, lastCount: "2024-05-20" },
  { id: 3, name: "Kitchen", type: "Count", bu: "Grand Hotel Singapore", itemCount: 200, lastCount: "2024-05-18" },
  { id: 4, name: "Housekeeping", type: "Count", bu: "Business Hotel Jakarta", itemCount: 95, lastCount: "2024-05-19" },
  { id: 5, name: "Housekeeping Storage", type: "Issue Balance", bu: "Business Hotel Jakarta", itemCount: 78, lastCount: "2024-05-22" },
  { id: 6, name: "Conference Room Storage", type: "Count", bu: "Business Hotel Jakarta", itemCount: 45, lastCount: "2024-05-21" },
  { id: 7, name: "Spa Storage", type: "Direct", bu: "Grand Hotel Singapore", itemCount: 35, lastCount: "2024-05-17" },
];

const mockPeriods = [
  { id: "2024-06", name: "June 2024", status: "Current", endDate: "2024-06-30", isOpen: true },
  { id: "2024-05", name: "May 2024", status: "Closed", endDate: "2024-05-31", isOpen: false },
  { id: "2024-04", name: "April 2024", status: "Closed", endDate: "2024-04-30", isOpen: false },
];

export default function PhysicalCountPage() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2024-06");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [includeSystemDefault, setIncludeSystemDefault] = useState(false);
  const router = useRouter();

  const selectedPeriodData = mockPeriods.find(p => p.id === selectedPeriod);
  
  // Filter locations based on type - only "Count" by default, optionally include "Issue Balance"
  const filteredLocations = mockLocations.filter(location => {
    if (location.type === "Count") return true;
    if (location.type === "Issue Balance" && includeSystemDefault) return true;
    return false; // Exclude "Direct" and other types
  });
  
  const selectedLocationData = filteredLocations.find(l => l.id === selectedLocation);

  const handleStartCount = () => {
    if (selectedLocation && selectedPeriod) {
      // Check if there's an existing session for this location and period
      const sessionId = `${selectedLocation}-${selectedPeriod}`;
      router.push(`/physical-count/session/${sessionId}/count`);
    }
  };

  // Reset selected location if it's no longer in filtered list
  const handleIncludeSystemDefaultChange = (checked: boolean) => {
    setIncludeSystemDefault(checked);
    // If unchecking and currently selected location is Issue Balance, clear selection
    if (!checked && selectedLocationData?.type === "Issue Balance") {
      setSelectedLocation(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">Physical Count Setup</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Select counting period and location to begin inventory count
        </p>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* Period Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <label className="font-medium mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Counting Period
          </label>
          
          <div className="relative">
            <button
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left flex justify-between items-center"
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedPeriodData?.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Ends: {selectedPeriodData?.endDate} • {selectedPeriodData?.status}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showPeriodDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                {mockPeriods.map(period => (
                  <button
                    key={period.id}
                    className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                    onClick={() => {
                      setSelectedPeriod(period.id);
                      setShowPeriodDropdown(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{period.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Ends: {period.endDate}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        period.isOpen 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {period.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
              Select Location
            </label>
            
            {/* Location Type Filter */}
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={includeSystemDefault}
                  onChange={(e) => handleIncludeSystemDefaultChange(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                Include Issue Balance
              </label>
            </div>
          </div>
          
          {/* Location Type Info */}
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <div className="font-medium mb-1">Location Types for Physical Count:</div>
              <div className="space-y-1">
                <div><strong>Count:</strong> Manual entry required for all items (recommended for physical counts)</div>
                {includeSystemDefault && (
                  <div><strong>Issue Balance:</strong> Uses system quantities as starting point</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredLocations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No locations available for physical count.</p>
                <p className="text-sm mt-1">
                  {!includeSystemDefault ? "Try enabling 'Include Issue Balance' locations." : "Contact your administrator to set up count locations."}
                </p>
              </div>
            ) : (
              filteredLocations.map(location => (
                <div
                  key={location.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedLocation === location.id 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400" 
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedLocation(location.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{location.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{location.bu}</div>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {location.itemCount} items
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last: {location.lastCount}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <span className={`text-xs px-2 py-1 rounded border font-medium ${
                        location.type === "Count" 
                          ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
                          : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800"
                      }`}>
                        {location.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Session Information */}
        {selectedLocation && selectedPeriod && selectedLocationData && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Count Session Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Location:</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{selectedLocationData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Period:</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{selectedPeriodData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Items to Count:</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{selectedLocationData.itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Count Type:</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{selectedLocationData.type}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          <button
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
            disabled={!selectedLocation || !selectedPeriod || !selectedPeriodData?.isOpen}
            onClick={handleStartCount}
          >
            {selectedPeriodData?.isOpen ? 'Start Physical Count' : 'View Count (Read Only)'}
          </button>
          
          <button
            className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors"
            onClick={() => router.push('/physical-count/sessions')}
          >
            View Existing Sessions
          </button>
        </div>

        {/* Help Text */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Physical Count Guidelines</h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div><strong>Count Locations:</strong> Require manual entry of actual quantities found (recommended for physical counts)</div>
            <div><strong>Issue Balance Locations:</strong> Use system quantities as starting point (optional for physical counts)</div>
            <div><strong>Note:</strong> Direct locations are not suitable for physical counts and are excluded from this list</div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ...rest of file
