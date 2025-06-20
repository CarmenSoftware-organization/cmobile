"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, MapPin, ChevronDown, ChevronUp, BarChart3, Home } from "lucide-react";
import { mockPhysicalCountItems } from "@/mock/physicalCountData";
import { useState, useEffect } from "react";

export default function PhysicalCountSuccessPage() {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [completionTime, setCompletionTime] = useState<string | null>(null);

  // Initialize completion time on client side to avoid hydration mismatch
  useEffect(() => {
    setCompletionTime(new Date().toLocaleDateString() + " at " + new Date().toLocaleTimeString());
  }, []);

  // Calculate stats for metrics
  const totalItems = mockPhysicalCountItems.length;
  const countedItems = mockPhysicalCountItems.filter(item => item.counted).length;
  const varianceItems = mockPhysicalCountItems.filter(item => item.variance !== 0 && item.counted).length;
  const accurateItems = countedItems - varianceItems;
  const positiveVariances = mockPhysicalCountItems.filter(item => item.variance > 0 && item.counted).length;
  const negativeVariances = mockPhysicalCountItems.filter(item => item.variance < 0 && item.counted).length;
  const accuracyRate = totalItems > 0 ? Math.round((accurateItems / countedItems) * 100) : 0;

  // Determine overall status
  const getOverallStatus = () => {
    if (accuracyRate >= 95) return { label: "Excellent", color: "green", bgColor: "bg-green-100", textColor: "text-green-800" };
    if (accuracyRate >= 85) return { label: "Good", color: "blue", bgColor: "bg-blue-100", textColor: "text-blue-800" };
    if (accuracyRate >= 70) return { label: "Fair", color: "amber", bgColor: "bg-amber-100", textColor: "text-amber-800" };
    return { label: "Needs Attention", color: "red", bgColor: "bg-red-100", textColor: "text-red-800" };
  };

  const status = getOverallStatus();

  // Mock session info
  const sessionInfo = {
    location: "Main Store",
    startedAt: "June 15, 2024 at 9:00 AM",
    completedAt: completionTime || "--:--:--",
    sessionId: "PC-2024-006"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Success Header */}
      <div className="bg-white border-b p-6 text-center">
        <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-green-700 mb-2">Physical Count Completed!</h1>
        <p className="text-gray-600 mb-4">Your count session has been successfully submitted for review.</p>
        
        {/* Overall Status Badge */}
        <div className={`inline-flex items-center px-4 py-2 rounded-full ${status.bgColor} ${status.textColor} font-semibold`}>
          <CheckCircle className="w-5 h-5 mr-2" />
          Overall Status: {status.label}
        </div>
      </div>

      <main className="flex-1 p-4 pb-6">
        {/* Key Metrics - Simplified */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{countedItems}</div>
              <div className="text-sm text-gray-600">Items Counted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{accuracyRate}%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
          </div>
          
          {varianceItems > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                <span className="text-lg font-bold text-amber-700">{varianceItems}</span>
              </div>
              <div className="text-sm text-amber-700">Items with Variances</div>
            </div>
          )}
        </div>

        {/* Session Information - Simplified */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Session Summary</h3>
            <span className="text-sm text-gray-500">{sessionInfo.sessionId}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 text-gray-500 mr-3" />
              <span className="font-medium text-gray-900">{sessionInfo.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-gray-500 mr-3" />
              <span className="text-gray-600">Completed: {sessionInfo.completedAt}</span>
            </div>
          </div>
        </div>

        {/* Progressive Disclosure - Detailed Stats */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-gray-600 mr-3" />
              <span className="font-semibold text-gray-900">Detailed Analytics</span>
            </div>
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {showDetails && (
            <div className="border-t p-4 space-y-4">
              {/* Detailed Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-lg font-bold text-green-600">{accurateItems}</span>
                  </div>
                  <div className="text-xs text-gray-600">Accurate</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-lg font-bold text-blue-600">{positiveVariances}</span>
                  </div>
                  <div className="text-xs text-gray-600">Over Count</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    <span className="text-lg font-bold text-red-600">{negativeVariances}</span>
                  </div>
                  <div className="text-xs text-gray-600">Under Count</div>
                </div>
              </div>

              {/* Additional Session Details */}
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Started: {sessionInfo.startedAt}</div>
                  <div>Total Items: {totalItems}</div>
                  <div>Completion Rate: {Math.round((countedItems / totalItems) * 100)}%</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Improved Hierarchy */}
        <div className="space-y-3">
          {/* Primary Action */}
          <button
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-colors shadow-sm"
            onClick={() => router.push("/physical-count")}
          >
            Back to Physical Count
          </button>
          
          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              onClick={() => router.push("/physical-count/sessions")}
            >
              View Sessions
            </button>
            <button
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
