"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Camera, AlertCircle, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { simulatePOScan, getLocationsFromPOs, type PurchaseOrder, type ScannedPOResult } from "@/data/mockPOData";

export default function ScanPOPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedPOResult | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualPONumber, setManualPONumber] = useState("");
  const [isValidatingManual, setIsValidatingManual] = useState(false);

  const autoCreateGRN = useCallback((po: PurchaseOrder) => {
    try {
      // Get locations from the scanned PO
      const locations = getLocationsFromPOs([po]);
      const locationNames = locations.map(loc => loc.name);

      // Navigate to GRN detail automatically
      const locationsParam = encodeURIComponent(locationNames.join(','));
      const totalItems = po.items.length;
      const url = `/receiving/grn-detail?po=${po.id}&locations=${locationsParam}&bu=${encodeURIComponent(po.businessUnit || '')}&vendor=${encodeURIComponent(po.vendor)}&itemCount=${totalItems}&fromScan=true`;
      
      router.push(url);
    } catch (error) {
      console.error('Error creating GRN:', error);
      // Fallback to showing manual entry
      setShowManualEntry(true);
    }
  }, [router]);

  const handleScan = useCallback(() => {
    setIsScanning(true);
    setScanResult(null);
    setShowManualEntry(false);

    // Simulate scanning delay
    setTimeout(() => {
      try {
        // Simulate scanning PO-1001 (which has business unit)
        const result = simulatePOScan("PO-1001");
        setScanResult(result);
        
        if (result.found && result.po) {
          // Auto-create GRN when PO is found
          autoCreateGRN(result.po);
        } else {
          // Show manual entry option when not found
          setShowManualEntry(true);
        }
      } catch (error) {
        console.error('Error during scan:', error);
        setShowManualEntry(true);
      } finally {
        setIsScanning(false);
      }
    }, 2000);
  }, [autoCreateGRN]);

  const handleManualPOValidation = useCallback(() => {
    if (!manualPONumber.trim()) return;
    
    setIsValidatingManual(true);
    
    // Simulate validation delay
    setTimeout(() => {
      try {
        const result = simulatePOScan(manualPONumber.trim());
        
        if (result.found && result.po) {
          // Auto-create GRN when manually entered PO is found
          autoCreateGRN(result.po);
        } else {
          // Show error and allow retry
          setScanResult(result);
          setShowManualEntry(true);
        }
      } catch (error) {
        console.error('Error validating manual PO:', error);
        setShowManualEntry(true);
      } finally {
        setIsValidatingManual(false);
      }
    }, 1000);
  }, [manualPONumber, autoCreateGRN]);





  const renderManualEntry = () => {
    if (!showManualEntry) return null;

    return (
      <Card className="p-4 space-y-4">
        <div className="text-center">
          <Hash className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Enter PO Number
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Type the purchase order number manually
          </p>
        </div>

        <div className="space-y-3">
          <Input
            type="text"
            placeholder="e.g., PO-1001"
            value={manualPONumber}
            onChange={(e) => setManualPONumber(e.target.value)}
            className="text-center text-lg"
            disabled={isValidatingManual}
          />

          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setShowManualEntry(false);
                setScanResult(null);
                setManualPONumber("");
              }}
              disabled={isValidatingManual}
              className="flex-1"
            >
              Back to Scan
            </Button>
            <Button 
              onClick={handleManualPOValidation}
              disabled={!manualPONumber.trim() || isValidatingManual}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isValidatingManual ? "Validating..." : "Validate PO"}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const renderScanError = () => {
    if (!scanResult || scanResult.found) return null;

    return (
      <Card className="p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">PO Not Found</p>
            <p className="text-sm text-red-700 dark:text-red-300">
              {scanResult.error || "The entered PO number doesn't match any purchase order."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setScanResult(null);
              setShowManualEntry(false);
              setManualPONumber("");
            }}
          >
            Scan Again
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setScanResult(null);
              setManualPONumber("");
            }}
          >
            Try Different PO
          </Button>
        </div>
      </Card>
    );
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

        {/* Manual Entry */}
        {renderManualEntry()}

        {/* Scan Error */}
        {renderScanError()}

        {/* Manual Entry Option - Show only when not scanning and no manual entry shown */}
        {!isScanning && !showManualEntry && !scanResult && (
          <Card className="p-4">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Can&apos;t scan the barcode?
              </p>
              <Button 
                variant="outline" 
                onClick={() => setShowManualEntry(true)}
                className="w-full"
              >
                Enter PO Number Manually
              </Button>
            </div>
          </Card>
        )}

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