"use client";

import { Card } from "@/components/ui/card";
import { Plus, List, ChevronRight, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockGRNs } from "@/data/mockGRNData";
import { mockPOs } from "@/data/mockPOData";

export default function ReceivingPage() {
  const router = useRouter();

  // Calculate actual counts from mock data
  const draftGRNsCount = mockGRNs.filter(grn => grn.status === "Draft").length;
  const pendingPOsCount = mockPOs.filter(po => po.status === "Open").length;

  return (
    <div className="p-4 pb-32 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Good Receive Note</h1>
      
      <div className="space-y-4">
        {/* Scan PO Card - New Enhanced Option */}
        <button 
          className="w-full text-left"
          onClick={() => router.push('/receiving/scan-po')}
        >
          <Card className="p-6 cursor-pointer hover:bg-muted transition-colors border-green-200 bg-green-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <QrCode className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-700">Scan PO</h3>
                  <p className="text-sm text-green-600">
                    Quick scan to create GRN instantly
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-green-500" />
            </div>
          </Card>
        </button>

        {/* New Good Receive Note Card */}
        <button 
          className="w-full text-left"
          onClick={() => router.push('/receiving/select-bu')}
        >
          <Card className="p-6 cursor-pointer hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">New Good Receive Note</h3>
                  <p className="text-sm text-muted-foreground">
                    Create GRN from existing purchase orders
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </button>

        {/* Manage Good Receive Note Card */}
        <button 
          className="w-full text-left"
          onClick={() => router.push('/receiving/grn-list')}
        >
          <Card className="p-6 cursor-pointer hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <List className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Manage Good Receive Note</h3>
                  <p className="text-sm text-muted-foreground">
                    View, edit, and manage existing GRNs
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </button>
      </div>

      {/* Quick Stats Section */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            className="text-left"
            onClick={() => router.push('/receiving/pending-pos')}
          >
            <Card className="p-4 cursor-pointer hover:bg-muted transition-colors">
              <div className="text-2xl font-bold text-blue-500">{pendingPOsCount}</div>
              <div className="text-xs text-muted-foreground">Pending POs</div>
            </Card>
          </button>
          <button 
            className="text-left"
            onClick={() => router.push('/receiving/draft-grns')}
          >
            <Card className="p-4 cursor-pointer hover:bg-muted transition-colors">
              <div className="text-2xl font-bold text-orange-500">{draftGRNsCount}</div>
              <div className="text-xs text-muted-foreground">Draft GRNs</div>
            </Card>
          </button>
        </div>
      </div>
    </div>
  );
} 