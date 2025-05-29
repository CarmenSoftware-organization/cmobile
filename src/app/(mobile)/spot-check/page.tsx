"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Users, Search, Play, Eye } from "lucide-react";

const mockLocations = [
  { 
    id: 1, 
    name: "Main Store", 
    bu: "Grand Hotel Singapore",
    itemCount: 245,
    lastSpotCheck: "2024-06-10",
    riskLevel: "Medium",
    description: "Primary inventory storage and distribution center"
  },
  { 
    id: 2, 
    name: "Bar", 
    bu: "Grand Hotel Singapore",
    itemCount: 89,
    lastSpotCheck: "2024-06-08",
    riskLevel: "High",
    description: "Beverage inventory and bar supplies"
  },
  { 
    id: 3, 
    name: "Mini Bar", 
    bu: "Business Hotel Jakarta",
    itemCount: 156,
    lastSpotCheck: "2024-06-05",
    riskLevel: "Low",
    description: "In-room minibar inventory"
  },
  { 
    id: 4, 
    name: "Kitchen Storage", 
    bu: "Grand Hotel Singapore",
    itemCount: 312,
    lastSpotCheck: "2024-06-12",
    riskLevel: "Medium",
    description: "Food and beverage storage area"
  },
  { 
    id: 5, 
    name: "Housekeeping Storage", 
    bu: "Business Hotel Jakarta",
    itemCount: 78,
    lastSpotCheck: "2024-06-07",
    riskLevel: "Low",
    description: "Cleaning supplies and linens"
  },
];

const mockExistingSessions = [
  {
    id: 201,
    name: "Main Store - Random Check",
    location: "Main Store",
    method: "Random",
    itemCount: 20,
    status: "In Progress",
    progress: 65,
    startedAt: "2024-06-15T09:00:00Z",
    lastActivity: "2024-06-15T14:30:00Z"
  },
  {
    id: 202,
    name: "Bar - High Value Check",
    location: "Bar",
    method: "High Value",
    itemCount: 10,
    status: "Review",
    progress: 100,
    startedAt: "2024-06-14T10:00:00Z",
    lastActivity: "2024-06-14T16:45:00Z"
  }
];

const selectionMethods = [
  {
    id: "random",
    name: "Random Selection",
    description: "System randomly selects items for checking",
    icon: "🎲",
    recommended: true
  },
  {
    id: "highvalue",
    name: "High Value Items",
    description: "Focus on items with highest monetary value",
    icon: "💎",
    recommended: false
  },
  {
    id: "manual",
    name: "Manual Selection",
    description: "Manually choose specific items to check",
    icon: "✋",
    recommended: false
  }
];

export default function SpotCheckPage() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [method, setMethod] = useState("random");
  const [itemCount, setItemCount] = useState(20);
  const [showExistingSessions, setShowExistingSessions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const selectedLocationData = mockLocations.find(l => l.id === selectedLocation);

  const filteredLocations = mockLocations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.bu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "Medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "Low": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "Review": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "Completed": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300";
    }
  };

  const handleStartSpotCheck = () => {
    if (selectedLocation !== null) {
      const locationName = selectedLocationData?.name || "";
      router.push(`/spot-check/session/${selectedLocation}?method=${method}&count=${itemCount}&location=${encodeURIComponent(locationName)}`);
    }
  };

  const handleResumeSession = (sessionId: number) => {
    router.push(`/spot-check/session/${sessionId}/count`);
  };

  const handleReviewSession = (sessionId: number) => {
    router.push(`/spot-check/session/${sessionId}/review`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">Spot Check Setup</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Configure and start inventory spot check session
        </p>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* Existing Sessions */}
        {mockExistingSessions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Active Sessions</h2>
              <button
                className="text-blue-600 dark:text-blue-400 text-sm"
                onClick={() => setShowExistingSessions(!showExistingSessions)}
              >
                {showExistingSessions ? "Hide" : "Show"} ({mockExistingSessions.length})
              </button>
            </div>
            
            {showExistingSessions && (
              <div className="space-y-3">
                {mockExistingSessions.map(session => (
                  <div key={session.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{session.name}</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {session.method} • {session.itemCount} items
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{session.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            session.status === "Review" ? "bg-yellow-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${session.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {session.status === "In Progress" && (
                        <button
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                          onClick={() => handleResumeSession(session.id)}
                        >
                          <Play className="w-3 h-3" />
                          Resume
                        </button>
                      )}
                      {session.status === "Review" && (
                        <button
                          className="flex-1 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                          onClick={() => handleReviewSession(session.id)}
                        >
                          <Eye className="w-3 h-3" />
                          Review
                        </button>
                      )}
                      <button className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Location Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <label className="font-medium mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Select Location
          </label>
          
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
            {filteredLocations.map(location => (
              <div
                key={location.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedLocation === location.id 
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400" 
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
                onClick={() => setSelectedLocation(location.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{location.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{location.bu}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{location.description}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(location.riskLevel)}`}>
                    {location.riskLevel} Risk
                  </span>
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
            ))}
          </div>
        </div>

        {/* Selection Method */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <label className="block font-medium mb-3 text-gray-900 dark:text-gray-100">
            Item Selection Method
          </label>
          
          <div className="space-y-3">
            {selectionMethods.map(methodOption => (
              <div
                key={methodOption.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  method === methodOption.id 
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400" 
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
                onClick={() => setMethod(methodOption.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{methodOption.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{methodOption.name}</div>
                      {methodOption.recommended && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded text-xs font-medium">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{methodOption.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Number of Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <label className="block font-medium mb-3 text-gray-900 dark:text-gray-100">
            Number of Items to Check
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            {[10, 20, 50].map(n => (
              <button
                key={n}
                className={`py-3 rounded-lg border font-medium transition-all ${
                  itemCount === n 
                    ? "border-blue-600 bg-blue-600 text-white" 
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400"
                }`}
                onClick={() => setItemCount(n)}
              >
                {n} Items
              </button>
            ))}
          </div>
          
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Recommendation:</strong> Start with 20 items for balanced coverage and efficiency.
              Use 10 for quick checks or 50 for comprehensive audits.
            </div>
          </div>
        </div>

        {/* Session Preview */}
        {selectedLocation && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Spot Check Preview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Location:</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{selectedLocationData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Method:</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  {selectionMethods.find(m => m.id === method)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Items to Check:</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 dark:text-blue-300">Estimated Time:</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{Math.ceil(itemCount * 1.5)} minutes</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          className="w-full py-4 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed text-lg"
          disabled={selectedLocation === null}
          onClick={handleStartSpotCheck}
        >
          Start Spot Check Session
        </button>

        {/* Help Information */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Important Notes</h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div>• Once started, the item list will be locked for compliance</div>
            <div>• All counts and variances are automatically logged</div>
            <div>• Sessions can be paused and resumed later</div>
            <div>• Photo evidence is recommended for significant variances</div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ...rest of file
