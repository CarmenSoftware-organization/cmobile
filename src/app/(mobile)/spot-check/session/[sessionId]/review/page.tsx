"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { mockSpotCheckItems } from "@/mock/spotCheckData";
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Clock, MapPin, Calendar, FileText, Camera, BarChart3, ChevronLeft } from "lucide-react";

export default function SpotCheckReviewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId;
  const method = searchParams.get("method");
  const count = Number(searchParams.get("count") || 0);
  const location = searchParams.get("location");
  const startedAt = searchParams.get("startedAt");

  // For demo, just use all items (in a real app, pass state or fetch session data)
  const items = mockSpotCheckItems.slice(0, count);
  const variances = items.filter(item => item.variance !== 0 && item.checked);
  const positiveVariances = variances.filter(item => item.variance > 0);
  const negativeVariances = variances.filter(item => item.variance < 0);
  const matchingItems = items.filter(item => item.variance === 0 && item.checked);
  
  // Calculate statistics
  const totalValue = items.reduce((sum, item) => sum + (item.systemQty * 10), 0); // Mock price of $10 per unit
  const varianceValue = variances.reduce((sum, item) => sum + (Math.abs(item.variance) * 10), 0);
  const accuracyRate = Math.round(((items.length - variances.length) / items.length) * 100);

  const handleSubmit = () => {
    const completedAt = new Date().toISOString();
    router.push(`/spot-check/session/${sessionId}/success?completedAt=${encodeURIComponent(completedAt)}&location=${encodeURIComponent(location || "")}&startedAt=${encodeURIComponent(startedAt || "")}`);
  };

  const handleBack = () => {
    router.back();
  };

  const getVarianceIcon = (variance: number) => {
    if (variance === 0) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return variance > 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getVarianceBadgeColor = (variance: number) => {
    if (variance === 0) return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    return variance > 0 
      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
  };

  const isSignificantVariance = (variance: number, systemQty: number) => {
    const percentageVariance = Math.abs(variance / systemQty) * 100;
    return percentageVariance > 10 || Math.abs(variance) > 5;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">Spot Check Review</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Session #{sessionId}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {accuracyRate}% Accuracy
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {variances.length} variances found
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {method && method.charAt(0).toUpperCase() + method.slice(1)}
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            {count} items checked
          </span>
        </div>

        {startedAt && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Started: {new Date(startedAt).toLocaleString()}
            </span>
          </div>
        )}
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Matches</h3>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{matchingItems.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Items with no variance</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Variances</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{variances.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Items requiring attention</div>
          </div>
        </div>

        {/* Variance Breakdown */}
        {variances.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Overages</h3>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{positiveVariances.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Items over system count</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Shortages</h3>
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{negativeVariances.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Items under system count</div>
            </div>
          </div>
        )}

        {/* Financial Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Financial Impact Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">${totalValue.toLocaleString()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Value Checked</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">${varianceValue.toLocaleString()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Variance Value</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{accuracyRate}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy Rate</div>
            </div>
          </div>
        </div>

        {/* Detailed Variances */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            Variance Details
          </h3>
          
          {variances.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <div className="text-lg font-medium text-green-700 dark:text-green-300 mb-1">Perfect Match!</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                All counted items match the system quantities exactly.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {variances.map((item) => (
                <div key={item.sku} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">SKU: {item.sku}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getVarianceBadgeColor(item.variance)}`}>
                        {item.variance > 0 ? "+" : ""}{item.variance}
                      </span>
                      {getVarianceIcon(item.variance)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">System</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{item.systemQty}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Actual</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{item.actual}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Variance</div>
                      <div className={`font-medium ${item.variance < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                        {item.variance > 0 ? "+" : ""}{item.variance}
                      </div>
                    </div>
                  </div>

                  {/* Significance Alert */}
                  {isSignificantVariance(item.variance, item.systemQty) && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2 mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">
                          Significant Variance
                        </span>
                      </div>
                      <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                        This variance exceeds normal thresholds and requires investigation.
                      </div>
                    </div>
                  )}

                  {/* Notes and Evidence */}
                  {(item.notes || item.photo) && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      {item.notes && (
                        <div className="mb-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <FileText className="w-3 h-3" />
                            Notes
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded p-2">
                            {item.notes}
                          </div>
                        </div>
                      )}
                      {item.photo && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Camera className="w-3 h-3" />
                          Photo evidence attached
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-4 -mx-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            onClick={handleSubmit}
          >
            <CheckCircle className="w-5 h-5" />
            Submit Spot Check Results
          </button>
          
          {variances.length > 0 && (
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
              {variances.length} variance{variances.length !== 1 ? 's' : ''} will be logged for investigation
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
