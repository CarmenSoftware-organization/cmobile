"use client";

import { FeatureCard } from "@/components/ui/feature-card";
import { mockPOs } from "@/data/mockPOData";

export default function DashboardPage() {
  // Summary data
  const summaryData = {
    pendingReceipts: 3,
    pendingApprovals: 2,
    pendingSRs: 4,
    physicalCount: 1,
    activeSpotChecks: 0,
  };
  
  // Calculate pending PO count (Open or Sent)
  const pendingPOCount = mockPOs.filter(po => po.status === "Open" || po.status === "Sent").length;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Minimal Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
      </header>



      {/* Mobile-first Main Content with pull-to-refresh indicator */}
      <main className="flex-1 px-4 py-4 pb-safe overflow-y-auto">
        {/* Priority Actions with attention-grabbing design */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Priority Actions</h2>
          </div>
          
          {/* Mobile-optimized touch-friendly cards */}
          <div className="grid grid-cols-2 gap-3">
            <FeatureCard 
              title="Purchase Request Approval" 
              href="/pr-approval" 
              count={summaryData.pendingApprovals}
            />
            <FeatureCard 
              title="Store Requisition Approval" 
              href="/store-requisition" 
              count={summaryData.pendingSRs}
            />
          </div>
        </div>

        {/* Operations Section with touch-optimized spacing */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Operations</h2>
          <div className="grid grid-cols-2 gap-3">
            <FeatureCard 
              title="Receiving" 
              href="/receiving" 
              count={pendingPOCount}
            />
            <FeatureCard 
              title="Physical Count" 
              href="/physical-count" 
              count={summaryData.physicalCount}
            />
          </div>
        </div>

        {/* Quality Control Section */}
        <div className="mb-20"> {/* Extra bottom margin for fixed nav */}
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Quality Control</h2>
          <div className="grid grid-cols-2 gap-3">
            <FeatureCard 
              title="Spot Check" 
              href="/spot-check" 
              count={summaryData.activeSpotChecks}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 