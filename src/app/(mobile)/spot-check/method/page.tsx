"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

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

function SpotCheckMethodContent() {
  const [method, setMethod] = useState("random");
  const [minValue, setMinValue] = useState(50);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const location = searchParams.get("location") || "";
  const locationId = searchParams.get("locationId") || "";

  const handleBack = () => {
    router.push("/spot-check/location");
  };

  const handleContinue = () => {
    const params = new URLSearchParams({
      location,
      locationId,
      method
    });
    
    // Add minValue for high value method
    if (method === "highvalue") {
      params.append("minValue", minValue.toString());
    }
    
    router.push(`/spot-check/items?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <button 
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* Progress Indicator */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Step 1: Location ✓</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Step 2: Method</span>
              <span className="text-gray-500 dark:text-gray-400">Step 3: Items</span>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1 mt-2">
              <div className="bg-blue-600 h-1 rounded-full" style={{ width: "66%" }}></div>
            </div>
          </div>
        </div>
        
        {/* Selected Location */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Selected Location:</strong> {location}
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
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

        {/* High Value Configuration */}
        {method === "highvalue" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <label className="block font-medium mb-3 text-gray-900 dark:text-gray-100">
              Minimum Value Threshold
            </label>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 dark:text-gray-300">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={minValue}
                  onChange={(e) => setMinValue(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter minimum value"
                />
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Only items with total value (unit price × quantity) of ${minValue} or higher will be included in the selection.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Method Details */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            {selectionMethods.find(m => m.id === method)?.name} Details
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {method === "random" && (
              <div className="space-y-2">
                <div>• System automatically selects items from different categories</div>
                <div>• Ensures unbiased representation of inventory</div>
                <div>• Fastest setup time</div>
                <div>• Best for routine compliance checks</div>
              </div>
            )}
            {method === "highvalue" && (
              <div className="space-y-2">
                <div>• Prioritizes items with highest monetary value</div>
                <div>• Focuses on inventory that has greatest financial impact</div>
                <div>• Ideal for loss prevention and accuracy verification</div>
                <div>• Recommended for high-risk locations</div>
              </div>
            )}
            {method === "manual" && (
              <div className="space-y-2">
                <div>• You choose specific items to check</div>
                <div>• Best for targeted investigations</div>
                <div>• Allows focus on problem areas or specific categories</div>
                <div>• Next page will show all available items for selection</div>
              </div>
            )}
          </div>
        </div>



        {/* Session Preview */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Spot Check Configuration</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300">Location:</span>
              <span className="font-medium text-blue-900 dark:text-blue-100">{location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300">Method:</span>
              <span className="font-medium text-blue-900 dark:text-blue-100">{selectionMethods.find(m => m.id === method)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300">Estimated Time:</span>
              <span className="font-medium text-blue-900 dark:text-blue-100">
                {method === "manual" ? "To be determined" : "Will be calculated on next step"}
              </span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors text-lg"
          onClick={handleContinue}
        >
          {method === "manual" ? "Select Items" : "Preview Items"}
        </button>
      </main>
    </div>
  );
}

export default function SpotCheckMethodPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <SpotCheckMethodContent />
    </Suspense>
  );
}