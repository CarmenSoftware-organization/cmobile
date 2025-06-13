"use client";

import { useState, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Location {
  id: number;
  name: string;
  code: string;
  type: string;
  description: string;
  active: boolean;
}

function SelectLocationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  // Get context from URL parameters
  const po = searchParams.get('po');
  const bu = searchParams.get('bu');
  const vendor = searchParams.get('vendor');
  const currency = searchParams.get('currency');
  const poDataParam = searchParams.get('poData');

  // Parse scanned PO data if available
  let scannedPO = null;
  if (poDataParam) {
    try {
      // First decode URL encoding, then try base64
      const urlDecoded = decodeURIComponent(poDataParam);
      
      // Check if the URL-decoded string looks like base64
      const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(urlDecoded);
      
      if (isBase64) {
        // Try base64 decoding
        const decodedData = atob(urlDecoded);
        scannedPO = JSON.parse(decodedData);
      } else {
        // Try parsing the URL-decoded data directly as JSON
        scannedPO = JSON.parse(urlDecoded);
      }
    } catch (error) {
      console.error("Error parsing PO data (primary method):", error);
      // Fallback: try direct base64 decoding without URL decoding first
      try {
        const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(poDataParam);
        if (isBase64) {
          const decodedData = atob(poDataParam);
          scannedPO = JSON.parse(decodedData);
        } else {
          // Last resort: try parsing directly
          scannedPO = JSON.parse(poDataParam);
        }
      } catch (secondError) {
        console.error("Error parsing PO data (fallback method):", secondError);
      }
    }
  }

  const locations: Location[] = [
    {
      id: 1,
      name: "Main Receiving Dock",
      code: "DOCK-01",
      type: "Receiving",
      description: "Primary receiving area for deliveries",
      active: true
    },
    {
      id: 2,
      name: "Kitchen Receiving",
      code: "KITCHEN-REC",
      type: "Kitchen",
      description: "Direct receiving to kitchen storage",
      active: true
    },
    {
      id: 3,
      name: "Bar Storage Entrance",
      code: "BAR-ENT",
      type: "Bar",
      description: "Beverage receiving area",
      active: true
    },
    {
      id: 4,
      name: "Housekeeping Storage",
      code: "HK-STORE",
      type: "Housekeeping",
      description: "Housekeeping supplies receiving",
      active: true
    },
    {
      id: 5,
      name: "Maintenance Workshop",
      code: "MAINT-WS",
      type: "Maintenance",
      description: "Maintenance supplies and equipment",
      active: true
    }
  ];

  const handleLocationSelect = (locationId: number) => {
    setSelectedLocation(locationId);
  };

  const handleContinue = () => {
    if (!selectedLocation) return;

    const selectedLoc = locations.find(l => l.id === selectedLocation);
    
    if (scannedPO) {
      // For scanned PO flow - navigate with poData parameter using base64 encoding
      const poData = btoa(JSON.stringify(scannedPO));
      const encodedPoData = encodeURIComponent(poData);
      const locationsParam = encodeURIComponent(selectedLoc?.name || '');
      router.push(`/receiving/grn-detail?poData=${encodedPoData}&locations=${locationsParam}&fromScan=true`);
    } else if (po) {
      // For traditional flow - navigate with po parameter
      if (vendor && currency) {
        // We have basic context, construct URL with parameters
        router.push(`/receiving/grn-detail?po=${po}&bu=${encodeURIComponent(bu || '')}&vendor=${encodeURIComponent(vendor || '')}&currency=${currency}&location=${encodeURIComponent(selectedLoc?.name || '')}`);
      } else {
        // We might have complete PO data from scan, try to reconstruct it
        router.push(`/receiving/grn-detail?po=${po}&location=${encodeURIComponent(selectedLoc?.name || '')}`);
      }
    }
  };

  // Determine display context
  const displayPO = scannedPO?.number || po;
  const displayBU = scannedPO?.businessUnit || bu;
  const displayVendor = scannedPO?.vendor || vendor;
  const displayCurrency = scannedPO?.currency || currency;

  return (
    <div className="p-4 pb-32 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Select Location</h1>
          <p className="text-sm text-muted-foreground">Choose receiving location for {displayPO}</p>
        </div>
      </div>

      {/* Context Information */}
      {(displayBU || displayVendor) && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-700 mb-2">Delivery Context</h3>
          <div className="space-y-1 text-sm text-blue-600">
            {displayBU && <div><strong>Business Unit:</strong> {displayBU}</div>}
            {displayVendor && <div><strong>Vendor:</strong> {displayVendor}</div>}
            {displayCurrency && <div><strong>Currency:</strong> {displayCurrency}</div>}
          </div>
        </Card>
      )}

      {/* Location Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Available Locations</h3>
        
        {locations.filter(loc => loc.active).map((location) => (
          <button
            key={location.id}
            className="w-full text-left"
            onClick={() => handleLocationSelect(location.id)}
          >
            <Card className={`p-4 cursor-pointer transition-colors ${
              selectedLocation === location.id 
                ? 'border-primary bg-primary/5' 
                : 'hover:bg-muted'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedLocation === location.id 
                      ? 'bg-primary/10' 
                      : 'bg-muted'
                  }`}>
                    <MapPin className={`w-5 h-5 ${
                      selectedLocation === location.id 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{location.name}</h4>
                    <p className="text-sm text-muted-foreground">{location.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {location.code}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {location.type}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedLocation === location.id && (
                  <CheckCircle className="w-5 h-5 text-primary" />
                )}
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <Button 
          className="w-full" 
          onClick={handleContinue}
          disabled={!selectedLocation}
        >
          Continue to GRN Creation
        </Button>
      </div>
    </div>
  );
}

export default function SelectLocationPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <SelectLocationContent />
    </Suspense>
  );
} 