"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessUnitLabel } from "@/components/ui/business-unit-label";
import { CheckCircle } from "lucide-react";
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

      {/* Navigation Actions */}
      <div className="flex gap-3 pt-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => router.push('/receiving/scan-po')}
        >
          Back to Scan PO
        </Button>
        <Button 
          variant="default" 
          className="flex-1"
          onClick={() => router.push('/dashboard')}
        >
          Dashboard
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