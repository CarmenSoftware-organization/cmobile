"use client";

import { useRouter, useParams } from "next/navigation";
import { Camera, ChevronLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { mockPhysicalCountItems } from "@/mock/physicalCountData";

const mockReview = {
  session: "Main Store - June 2024",
  location: "Main Store",
  total: 3,
  counted: 3,
  // Get variances directly from the mock data
  variances: mockPhysicalCountItems.filter(item => item.variance !== 0 && item.counted),
};

export default function PhysicalCountReviewPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId;

  const handleSubmit = () => {
    router.push(`/physical-count/session/${sessionId}/success`);
  };

  const handleBack = () => {
    router.back();
  };

  // Calculate stats for metrics
  const totalItems = mockPhysicalCountItems.length;
  const countedItems = mockPhysicalCountItems.filter(item => item.counted).length;
  const varianceItems = mockPhysicalCountItems.filter(item => item.variance !== 0 && item.counted).length;
  const accurateItems = countedItems - varianceItems;
  const positiveVariances = mockPhysicalCountItems.filter(item => item.variance > 0 && item.counted).length;
  const negativeVariances = mockPhysicalCountItems.filter(item => item.variance < 0 && item.counted).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-blue-700">Review & Submit</h1>
        </div>
      </header>
      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* Session Summary Card */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-semibold text-lg mb-2">Session: {mockReview.session}</div>
          <div className="text-sm text-gray-600 mb-1">Location: {mockReview.location}</div>
          <div className="text-xs text-gray-500 mb-2">Items Counted: {mockReview.counted} / {mockReview.total}</div>
        </div>

        {/* Stat Metrics Section */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Count Summary</h3>
          
          {/* Top Row - Main Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{countedItems}</div>
              <div className="text-sm text-gray-600">Items Counted</div>
            </div>
          </div>

          {/* Second Row - Accuracy Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                <span className="text-lg font-bold text-green-600">{accurateItems}</span>
              </div>
              <div className="text-xs text-gray-600">Accurate</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-1" />
                <span className="text-lg font-bold text-blue-600">{positiveVariances}</span>
              </div>
              <div className="text-xs text-gray-600">Over Count</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingDown className="w-5 h-5 text-red-600 mr-1" />
                <span className="text-lg font-bold text-red-600">{negativeVariances}</span>
              </div>
              <div className="text-xs text-gray-600">Under Count</div>
            </div>
          </div>

          {/* Bottom Row - Variance Summary */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">Total Variances</span>
              </div>
              <span className="text-lg font-bold text-amber-600">{varianceItems}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Accuracy Rate: {totalItems > 0 ? Math.round((accurateItems / countedItems) * 100) : 0}%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Flagged Variances</div>
          {mockReview.variances.length === 0 ? (
            <div className="text-sm text-gray-500">No variances found.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {mockReview.variances.map((item) => (
                <div key={item.sku} className="border-b pb-3 last:border-b-0">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                  <div className="text-xs text-gray-500">System: {item.systemQty} | Actual: {item.actual} | 
                    <span className={item.variance < 0 ? "text-red-600" : "text-green-700"}> Variance: {item.variance}</span>
                  </div>
                  {item.notes && (
                    <div className="text-xs text-gray-600 mt-1">Note: {item.notes}</div>
                  )}
                  
                  {item.photo ? (
                    <div className="mt-2 flex flex-col">
                      <div className="text-xs flex items-center text-primary font-medium">
                        <Camera size={12} className="mr-1" /> Photo evidence attached
                      </div>
                      <div className="mt-1 border rounded p-1 bg-gray-50">
                        {/* In a real app, you'd store and retrieve image URLs from the server */}
                        {/* This is just a placeholder for UI design */}
                        <div className="bg-gray-200 h-24 w-full flex items-center justify-center text-xs text-gray-500">
                          Photo evidence
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 mt-1">No photo evidence</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="w-full py-3 bg-blue-700 text-white rounded-lg font-semibold mt-6"
          onClick={handleSubmit}
        >
          Submit Physical Count
        </button>
      </main>
    </div>
  );
}
// ...rest of file
