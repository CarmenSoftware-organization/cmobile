"use client";

import { useRouter, useParams } from "next/navigation";
import { Camera } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 border-b bg-white">
        <h1 className="text-xl font-bold text-blue-700">Review & Submit</h1>
      </header>
      <main className="flex-1 p-4 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="font-semibold text-lg mb-2">Session: {mockReview.session}</div>
          <div className="text-sm text-gray-600 mb-1">Location: {mockReview.location}</div>
          <div className="text-xs text-gray-500 mb-2">Items Counted: {mockReview.counted} / {mockReview.total}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Flagged Variances</div>
          {mockReview.variances.length === 0 ? (
            <div className="text-sm text-gray-500">No variances found.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {mockReview.variances.map((item) => (
                <div key={item.sku} className="border-b pb-3 last:border-b-0">
                  <div className="font-medium">{item.sku} - {item.name}</div>
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
