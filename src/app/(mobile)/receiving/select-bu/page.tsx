"use client";

import { useState, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Building2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

// Mock business units data
const businessUnits = [
  {
    id: 1,
    name: "Grand Hotel Singapore",
    code: "GHS",
    location: "Singapore",
    type: "Luxury Hotel",
    active: true,
    description: "5-star luxury hotel in downtown Singapore"
  },
  {
    id: 2,
    name: "Business Hotel Jakarta",
    code: "BHJ",
    location: "Jakarta, Indonesia",
    type: "Business Hotel",
    active: true,
    description: "Modern business hotel in Jakarta CBD"
  },
  {
    id: 3,
    name: "Boutique Hotel Bangkok",
    code: "BHB",
    location: "Bangkok, Thailand",
    type: "Boutique Hotel",
    active: true,
    description: "Boutique hotel in historic Bangkok district"
  },
  {
    id: 4,
    name: "Resort Bali",
    code: "RB",
    location: "Bali, Indonesia",
    type: "Resort",
    active: true,
    description: "Beachfront resort in Nusa Dua, Bali"
  },
  {
    id: 5,
    name: "City Hotel Manila",
    code: "CHM",
    location: "Manila, Philippines",
    type: "City Hotel",
    active: true,
    description: "Metropolitan hotel in Makati business district"
  },
  {
    id: 6,
    name: "Grand Hotel Kuala Lumpur",
    code: "GHKL",
    location: "Kuala Lumpur, Malaysia",
    type: "Luxury Hotel",
    active: false,
    description: "Premium hotel in KLCC area (Currently under renovation)"
  }
];

function SelectBusinessUnitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get scanned PO from URL parameters
  const scannedPO = searchParams.get('scannedPO');
  
  const filteredBusinessUnits = businessUnits.filter(bu => 
    bu.active && (
      bu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bu.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bu.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSelectBU = (businessUnit: typeof businessUnits[0]) => {
    // Store selected BU in sessionStorage or pass as URL parameter
    sessionStorage.setItem('selectedBusinessUnit', JSON.stringify(businessUnit));
    
    // If we have a scanned PO, pass it along to the new page
    const newUrl = scannedPO 
      ? `/receiving/new?scannedPO=${scannedPO}&bu=${encodeURIComponent(businessUnit.name)}`
      : '/receiving/new';
    
    router.push(newUrl);
  };

  return (
    <div className="p-4 pb-32 space-y-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" /> Back
        </Button>
        <h1 className="text-xl font-bold ml-2">Select Business Unit</h1>
      </div>

      {/* Description */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Please select the business unit for which you want to create a Good Receive Note. 
          This will filter available purchase orders and vendors.
        </p>
      </div>

      {/* Scanned PO Context */}
      {scannedPO && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1">Scanned PO Context</h4>
          <p className="text-sm text-green-600 dark:text-green-400">
            PO {scannedPO} was scanned. Select the appropriate business unit to continue with GRN creation.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by name, code, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800"
        />
        <Building2 className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
      </div>

      {/* Business Units List */}
      <div className="space-y-3">
        {filteredBusinessUnits.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No business units found matching your search.
            </p>
          </div>
        ) : (
          filteredBusinessUnits.map((bu) => (
            <button
              key={bu.id}
              className="w-full text-left bg-transparent border-none p-0 m-0"
              onClick={() => handleSelectBU(bu)}
            >
              <Card className="p-4 hover:bg-muted transition-colors cursor-pointer border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{bu.name}</h3>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                          {bu.code}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {bu.location} • {bu.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {bu.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            </button>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="text-2xl font-bold text-primary">{filteredBusinessUnits.length}</div>
            <div className="text-xs text-muted-foreground">Active Business Units</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-500">{businessUnits.filter(bu => !bu.active).length}</div>
            <div className="text-xs text-muted-foreground">Under Maintenance</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SelectBusinessUnitPageWithSuspense() {
  return (
    <Suspense fallback={<div className="p-4">Loading business units...</div>}>
      <SelectBusinessUnitPage />
    </Suspense>
  );
}