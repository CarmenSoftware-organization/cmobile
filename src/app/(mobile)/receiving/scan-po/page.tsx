"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Camera, AlertCircle, CheckCircle, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { simulatePOScan, getLocationsFromPOs, type PurchaseOrder, type ScannedPOResult } from "@/data/mockPOData";

export default function ScanPOPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedPOResult | null>(null);
  const [scannedPO, setScannedPO] = useState<PurchaseOrder | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setScannedPO(null);

    // Simulate scanning delay
    setTimeout(() => {
      // Simulate scanning PO-1001 (which has business unit)
      const result = simulatePOScan("PO-1001");
      setScanResult(result);
      setScannedPO(result.po || null);
      setIsScanning(false);
    }, 2000);
  };

  const handleCreateGRN = () => {
    if (!scannedPO) return;

    // Get locations from the scanned PO
    const locations = getLocationsFromPOs([scannedPO]);
    const locationNames = locations.map(loc => loc.name);

    // Navigate to GRN detail using the same pattern as New GRN flow for consistency
    const locationsParam = encodeURIComponent(locationNames.join(','));
    const totalItems = scannedPO.items.length;
    router.push(`/receiving/grn-detail?po=${scannedPO.id}&locations=${locationsParam}&bu=${encodeURIComponent(scannedPO.businessUnit || '')}&vendor=${encodeURIComponent(scannedPO.vendor)}&itemCount=${totalItems}&fromScan=true`);
  };

  const handleSelectLocations = () => {
    if (!scannedPO) return;

    // Get locations from the scanned PO
    const locations = getLocationsFromPOs([scannedPO]);
    
    if (locations.length <= 1) {
      // If only one location, go directly to GRN creation
      handleCreateGRN();
      return;
    }

    // Navigate to the same location selection page as New GRN flow for consistency
    // Use po parameter with ID instead of poData for unified experience
    router.push(`/receiving/select-grn-locations?po=${scannedPO.id}&bu=${encodeURIComponent(scannedPO.businessUnit || '')}&vendor=${encodeURIComponent(scannedPO.vendor)}&fromScan=true`);
  };

  const handleManualEntry = () => {
    router.push("/receiving/select-bu");
  };

  const renderScanResult = () => {
    if (!scanResult) return null;

    if (!scanResult.found) {
      return (
        <Card className="p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">PO Not Found</p>
              <p className="text-sm text-red-700 dark:text-red-300">
                {scanResult.error || "The scanned code doesn't match any purchase order."}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setScanResult(null)}
            >
              Scan Again
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleManualEntry}
            >
              Manual Entry
            </Button>
          </div>
        </Card>
      );
    }

    if (scanResult.found && scannedPO) {
      const locations = getLocationsFromPOs([scannedPO]);
      
      return (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">PO Found!</p>
              <p className="text-sm text-green-700">
                {scannedPO.number} • {scannedPO.vendor}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Business Unit:</span>
                <p className="font-medium">{scannedPO.businessUnit}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Value:</span>
                <p className="font-medium">{scannedPO.totalValue}</p>
              </div>
            </div>

            <div>
              <span className="text-gray-600 text-sm">Description:</span>
              <p className="font-medium text-sm">{scannedPO.description}</p>
            </div>

            {locations.length > 0 && (
              <div>
                <span className="text-gray-600 text-sm">Store Locations ({locations.length}):</span>
                <div className="mt-2 space-y-1">
                  {locations.map((location, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="font-medium">{location.name}</span>
                      <span className="text-gray-500">({location.itemCount} items)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {locations.length > 1 ? (
              <>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleCreateGRN}
                >
                  Create GRN (All Locations)
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleSelectLocations}
                >
                  Select Locations
                </Button>
              </>
            ) : (
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleCreateGRN}
              >
                Create GRN
              </Button>
            )}
          </div>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Scan Purchase Order</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Scan to add PO to the Good Receive Note</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Camera Section */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Camera className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {isScanning ? "Scanning..." : "Ready to Scan"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isScanning 
                  ? "Processing barcode..." 
                  : "Position the PO barcode within the camera frame"
                }
              </p>
            </div>

            <Button 
              onClick={handleScan}
              disabled={isScanning}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isScanning ? "Scanning..." : "Start Scan"}
            </Button>
          </div>
        </Card>

        {/* Scan Result */}
        {renderScanResult()}

        {/* Manual Entry Option */}
        <Card className="p-4">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Can&apos;t scan the barcode?
            </p>
            <Button 
              variant="outline" 
              onClick={handleManualEntry}
              className="w-full"
            >
              Manual Entry
            </Button>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Scanning Tips</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Ensure good lighting</li>
            <li>• Hold device steady</li>
            <li>• Keep barcode within frame</li>
            <li>• Clean camera lens if needed</li>
          </ul>
        </Card>
      </div>
    </div>
  );
} 