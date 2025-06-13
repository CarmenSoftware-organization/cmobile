"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessUnitLabel } from "@/components/ui/business-unit-label";
import { CheckCircle, Package, FileText, Home } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

interface GRNConfirmationData {
  grnId: string;
  vendorName: string;
  totalValue: string;
  poNumbers: string[];
  itemCount: number;
  businessUnit: string;
}

function GRNConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [grnData, setGrnData] = useState<GRNConfirmationData | null>(null);

  useEffect(() => {
    const grnId = searchParams.get('grnId');
    const vendorName = searchParams.get('vendorName');
    const totalValue = searchParams.get('totalValue');
    const poNumbers = searchParams.get('poNumbers')?.split(',') || [];
    const itemCount = parseInt(searchParams.get('itemCount') || '0');
    const businessUnit = searchParams.get('businessUnit');

    if (grnId && vendorName && totalValue && businessUnit) {
      setGrnData({
        grnId,
        vendorName,
        totalValue,
        poNumbers,
        itemCount,
        businessUnit
      });
    }
  }, [searchParams]);

  if (!grnData) {
    return (
      <div className="p-4 pb-32 space-y-4">
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading confirmation...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-32 space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-green-100 dark:bg-green-950 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
            GRN Created Successfully!
          </h1>
          <p className="text-muted-foreground mt-2">
            Your Good Receive Note has been saved and is ready for processing.
          </p>
        </div>
      </div>

      {/* GRN Details Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-semibold">GRN Details</h2>
          <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
            Draft
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">GRN Number:</span>
            <span className="text-sm font-bold text-primary">{grnData.grnId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Vendor:</span>
            <span className="text-sm">{grnData.vendorName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Value:</span>
            <span className="text-sm font-bold">${grnData.totalValue}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Items Count:</span>
            <span className="text-sm">{grnData.itemCount} item{grnData.itemCount !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">Linked POs:</span>
            <div className="text-sm text-right">
              {grnData.poNumbers.map(po => (
                <div key={po}>{po}</div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Business Unit:</span>
            <BusinessUnitLabel assignedBusinessUnits={[{ id: 1, name: grnData.businessUnit }]} />
          </div>
        </div>
      </Card>

      {/* Action Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">What&apos;s Next?</h3>
        
        {/* Continue to GRN List */}
        <div 
          className="cursor-pointer"
          onClick={() => router.push('/receiving/grn-list')}
        >
          <Card className="p-4 hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Manage GRNs</h4>
                  <p className="text-sm text-muted-foreground">
                    View and manage all your Good Receive Notes
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Create New Receiving */}
        <div 
          className="cursor-pointer"
          onClick={() => router.push('/receiving/new')}
        >
          <Card className="p-4 hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Create New Good Receive Note</h4>
                  <p className="text-sm text-muted-foreground">
                    Create more Good Receive Notes from purchase orders
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Back to Dashboard */}
        <div 
          className="cursor-pointer"
          onClick={() => router.push('/dashboard')}
        >
          <Card className="p-4 hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <Home className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Return to Dashboard</h4>
                  <p className="text-sm text-muted-foreground">
                    Go back to the main dashboard
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 pt-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => router.push('/receiving')}
        >
          Back to Good Receive Note
        </Button>
        <Button 
          variant="default" 
          className="flex-1"
          onClick={() => router.push('/receiving/grn-list')}
        >
          View All GRNs
        </Button>
      </div>
    </div>
  );
}

export default function GRNConfirmationPageWithSuspense() {
  return (
    <Suspense fallback={<div className="p-4">Loading confirmation...</div>}>
      <GRNConfirmationPage />
    </Suspense>
  );
}