"use client";

import { BusinessUnitLabel } from "@/components/ui/business-unit-label";
import { FeatureCard } from "@/components/ui/feature-card";

export default function DashboardPage() {
  // Placeholder business units and summary data
  const assignedBusinessUnits = [
    { id: 1, name: "Grand Hotel Singapore" },
    { id: 2, name: "Business Hotel Jakarta" },
  ];
  const summaryData = {
    pendingReceipts: 3,
    pendingApprovals: 2,
    pendingSRs: 4,
    physicalCount: 1,
    activeSpotChecks: 0,
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Business Unit Selector */}
      <div className="p-4 pb-0">
        <BusinessUnitLabel assignedBusinessUnits={assignedBusinessUnits} />
      </div>
      {/* Module Cards */}
      <main className="flex-1 p-4">
        <div className="w-full grid grid-cols-2 gap-4 pt-4">
          <FeatureCard title="Good Receive Note" href="/receiving" count={summaryData.pendingReceipts} />
          <FeatureCard title="PR Approval" href="/pr-approval" count={summaryData.pendingApprovals} />
          <FeatureCard title="SR Approval" href="/store-requisition" count={summaryData.pendingSRs} />
          <FeatureCard title="Physical Count" href="/physical-count" count={summaryData.physicalCount} />
          <FeatureCard title="Spot Check" href="/spot-check" count={summaryData.activeSpotChecks} />
        </div>
      </main>
    </div>
  );
} 