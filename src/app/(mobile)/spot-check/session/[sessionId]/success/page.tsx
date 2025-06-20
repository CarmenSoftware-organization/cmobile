"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, MapPin, Calendar, BarChart3, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

export default function SpotCheckSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId;
  const location = searchParams.get('location') || 'Selected Location';
  const startedAt = searchParams.get('startedAt') || '';
  const completedAt = searchParams.get('completedAt') || '';

  // Mock session results for demonstration
  const sessionResults = {
    totalItems: 20,
    matchingItems: 17,
    varianceItems: 3,
    positiveVariances: 1,
    negativeVariances: 2,
    accuracyRate: 85,
    totalValue: 2450,
    varianceValue: 180,
    duration: startedAt && completedAt 
      ? Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / (1000 * 60))
      : 25
  };

  const getSessionRating = (accuracyRate: number) => {
    if (accuracyRate >= 95) return { rating: "Excellent", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/20" };
    if (accuracyRate >= 85) return { rating: "Good", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/20" };
    if (accuracyRate >= 70) return { rating: "Fair", color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/20" };
    return { rating: "Needs Attention", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/20" };
  };

  const sessionRating = getSessionRating(sessionResults.accuracyRate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1">Spot Check Complete!</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Session #{sessionId} has been successfully submitted</p>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* Session Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Session Summary
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Location
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{location}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Items Checked
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{sessionResults.totalItems}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Duration
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{sessionResults.duration} minutes</span>
            </div>
            
            {startedAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Started</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{new Date(startedAt).toLocaleString()}</span>
              </div>
            )}
            
            {completedAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{new Date(completedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Accuracy Rating */}
        <div className={`rounded-xl shadow p-4 ${sessionRating.bgColor}`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${sessionRating.color} mb-1`}>
              {sessionResults.accuracyRate}%
            </div>
            <div className={`text-lg font-semibold ${sessionRating.color} mb-2`}>
              {sessionRating.rating}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Inventory Accuracy Rate
            </div>
          </div>
        </div>

        {/* Results Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Matches</h3>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{sessionResults.matchingItems}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Perfect matches</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Variances</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{sessionResults.varianceItems}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Items with differences</div>
          </div>
        </div>

        {/* Variance Details */}
        {sessionResults.varianceItems > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Overages</h3>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{sessionResults.positiveVariances}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Items over count</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Shortages</h3>
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{sessionResults.negativeVariances}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Items under count</div>
            </div>
          </div>
        )}

        {/* Financial Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Financial Impact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">${sessionResults.totalValue.toLocaleString()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Value Audited</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">${sessionResults.varianceValue.toLocaleString()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Variance Value</div>
            </div>
          </div>
        </div>



        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            onClick={() => router.push("/spot-check")}
          >
            <BarChart3 className="w-4 h-4" />
            Start New Spot Check
          </button>
          
          <button
            className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>

        {/* Session ID Reference */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Session Reference</div>
          <div className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">#{sessionId}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use this reference for audit trail and reporting
          </div>
        </div>
      </main>
    </div>
  );
}
