"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Package, CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockPOs, getLocationsFromPOs } from "@/data/mockPOData";

export default function SelectGRNLocationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectAllLocations, setSelectAllLocations] = useState(false);

  // Get parameters from URL - handle multiple PO parameters
  const poIds = searchParams.getAll("po").map(Number).filter(id => !isNaN(id));
  const vendorParam = searchParams.get('vendor');
  const buParam = searchParams.get('bu');
  const vendor = vendorParam || '';
  const businessUnit = buParam || '';

  // Load selected POs based on IDs
  const selectedPOs = mockPOs.filter(po => poIds.includes(po.id));
  
  // Extract locations from selected POs
  const locations = getLocationsFromPOs(selectedPOs);

  const handleLocationToggle = (locationName: string) => {
    setSelectedLocations(prev => {
      if (prev.includes(locationName)) {
        return prev.filter(loc => loc !== locationName);
      } else {
        return [...prev, locationName];
      }
    });
  };

  const handleSelectAllToggle = () => {
    if (selectAllLocations) {
      setSelectedLocations([]);
      setSelectAllLocations(false);
    } else {
      setSelectedLocations(locations.map(loc => loc.name));
      setSelectAllLocations(true);
    }
  };

  const handleCreateGRN = () => {
    if (selectedPOs.length === 0) return;

    // Calculate total items for selected locations
    const selectedLocationItems = selectedPOs.reduce((total, po) => {
      return total + po.items.filter(item => 
        selectedLocations.length === 0 || selectedLocations.includes(item.itemDetail.storeLocation)
      ).length;
    }, 0);

    // Navigate to GRN detail with selected PO IDs and locations (consistent with scan flow)
    const poIdsParam = selectedPOs.map(po => `po=${po.id}`).join('&');
    const locationsParam = selectedLocations.length > 0 ? selectedLocations.join(',') : 'All';
    
    router.push(`/receiving/grn-detail?${poIdsParam}&locations=${encodeURIComponent(locationsParam)}&bu=${encodeURIComponent(businessUnit)}&vendor=${encodeURIComponent(vendor)}&itemCount=${selectedLocationItems}&fromLocationSelection=true`);
  };

  // Calculate total items correctly
  const totalItems = selectedPOs.reduce((sum, po) => sum + po.items.length, 0);
  
  // Calculate selected item count (number of items, not quantities)
  const selectedItemCount = selectedLocations.length > 0 
    ? selectedPOs.reduce((total, po) => {
        return total + po.items.filter(item => 
          selectedLocations.includes(item.itemDetail.storeLocation)
        ).length;
      }, 0)
    : totalItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
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
            <h1 className="text-lg font-semibold text-gray-900">Select Locations</h1>
            <p className="text-sm text-gray-600">Choose store locations for receiving</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* PO Summary */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">Purchase Orders</h2>
            </div>
            
            {selectedPOs.map((po, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{po.number}</p>
                    <p className="text-sm text-gray-600">{po.vendor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{po.totalValue}</p>
                    <p className="text-sm text-gray-600">{po.items.length} items</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="border-t pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{selectedPOs.map(po => po.number).join(', ')} • {totalItems} total items</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Location Selection */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <h2 className="font-semibold text-gray-900">Store Locations</h2>
            </div>

            {/* Select All Option */}
            <div className="border border-gray-200 rounded-lg p-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAllLocations}
                  onChange={handleSelectAllToggle}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">All Locations</div>
                  <div className="text-sm text-gray-600">Receive items across all store locations</div>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {totalItems} items
                </div>
              </label>
            </div>

            {/* Individual Location Options */}
            <div className="space-y-2">
              {locations.map((location, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location.name)}
                      onChange={() => handleLocationToggle(location.name)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-600">
                        {location.items.slice(0, 2).join(', ')}
                        {location.items.length > 2 && ` +${location.items.length - 2} more`}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {location.itemCount} items
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Floating Create Button */}
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none">
          <button
            className={`pointer-events-auto px-6 h-11 min-w-[180px] rounded-lg shadow-lg flex items-center justify-center text-white text-base font-semibold bg-green-600 hover:bg-green-700 transition-all duration-200 ${selectedLocations.length === 0 && !selectAllLocations ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleCreateGRN}
            disabled={selectedLocations.length === 0 && !selectAllLocations}
            title={`Create GRN (${selectedItemCount} items)`}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Create GRN ({selectedItemCount} items)
          </button>
        </div>

        {/* Instructions */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Location Selection</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Select specific locations to receive items for those areas only</li>
            <li>• Choose &quot;All Locations&quot; to receive all items at once</li>
            <li>• Items will be grouped by location in the GRN</li>
          </ul>
        </Card>
      </div>
    </div>
  );
} 