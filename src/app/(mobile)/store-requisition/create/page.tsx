"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Barcode, Calendar, ChevronLeft, Plus, X } from "lucide-react";

interface Item {
  id: number;
  name: string;
  sku: string;
  requestedQty: number;
  unit: string;
  notes: string;
  purpose: "Regular" | "Special Event" | "Emergency" | "";
  businessDimensions?: {
    projectCode?: string;
    marketSegment?: string;
    event?: string;
  };
}

export default function CreateStoreRequisitionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    requestDate: new Date().toISOString().split('T')[0],
    requestingDepartment: "",
    sourceLocation: "",
    notes: "",
    businessDimensions: {
      projectCode: "",
      marketSegment: "",
      event: ""
    }
  });
  
  const [items, setItems] = useState<Item[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<Item>({
    id: 0,
    name: "",
    sku: "",
    requestedQty: 1,
    unit: "",
    notes: "",
    purpose: ""
  });
  
  // Sample data for dropdowns
  const departments = ["F&B", "Housekeeping", "Engineering", "Front Office", "Kitchen"];
  const locations = ["Main Store", "Kitchen Store", "Bar Store", "Housekeeping Store"];
  const projectCodes = ["PR-2025-001", "PR-2025-002", "PR-2025-003"];
  const marketSegments = ["Food & Beverage", "Rooms", "General", "Executive Lounge"];
  const events = ["Corporate Retreat", "Annual Gala Dinner", "Wedding", "Conference", "Daily Operations"];
  
  // Sample inventory items
  const inventoryItems = [
    { name: "Premium Coffee Beans", sku: "SKU11111", unit: "kg" },
    { name: "Organic Tea Bags", sku: "SKU22222", unit: "box" },
    { name: "Crystal Wine Glasses", sku: "SKU33333", unit: "cs" },
    { name: "Laundry Detergent", sku: "SKU44444", unit: "btl" },
    { name: "Luxury Bath Towels", sku: "SKU55555", unit: "ea" }
  ];
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBusinessDimensionChange = (dimension: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      businessDimensions: {
        ...prev.businessDimensions,
        [dimension]: value
      }
    }));
  };
  
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleItemSelect = (item: typeof inventoryItems[0]) => {
    setNewItem(prev => ({
      ...prev,
      name: item.name,
      sku: item.sku,
      unit: item.unit
    }));
  };
  
  const handleAddItem = () => {
    if (!newItem.name || newItem.requestedQty <= 0) return;
    
    setItems(prev => [
      ...prev,
      {
        ...newItem,
        id: Date.now(),
        businessDimensions: { ...formData.businessDimensions }
      }
    ]);
    
    setNewItem({
      id: 0,
      name: "",
      sku: "",
      requestedQty: 1,
      unit: "",
      notes: "",
      purpose: ""
    });
    
    setShowAddItem(false);
  };
  
  const handleRemoveItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top header bar */}
      <header className="p-3 bg-white dark:bg-gray-900 flex items-center justify-between border-b border-border sticky top-0 z-10">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => router.back()}
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="font-bold text-blue-700 dark:text-blue-400">Carmen</div>
          <div className="font-bold ml-1 text-blue-500 dark:text-blue-300 border-l border-blue-300 dark:border-blue-700 pl-1">Supply</div>
          <div className="ml-4 font-medium text-lg">Create Store Requisition</div>
        </div>
      </header>
      
      {/* Form Section */}
      <div className="flex-1 overflow-auto p-4">
        <Card className="p-4 mb-4">
          <h2 className="text-lg font-medium mb-4">Header Information</h2>
          
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="requestDate" className="block font-medium mb-1">Request Date</label>
              <div className="relative">
                <Input
                  id="requestDate"
                  name="requestDate"
                  type="date"
                  value={formData.requestDate}
                  onChange={handleFormChange}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label htmlFor="requestingDepartment" className="block font-medium mb-1">Requesting Department</label>
              <select 
                name="requestingDepartment"
                value={formData.requestingDepartment}
                onChange={(e) => setFormData(prev => ({ ...prev, requestingDepartment: e.target.value }))}
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="sourceLocation" className="block font-medium mb-1">Store Name</label>
              <select 
                name="sourceLocation"
                value={formData.sourceLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, sourceLocation: e.target.value }))}
              >
                <option value="">Select store location</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            {/* From/To Visualization */}
            {(formData.sourceLocation && formData.requestingDepartment) && (
              <div className="flex gap-4 mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Store Name:</div>
                  <div className="text-base">{formData.sourceLocation}</div>
                </div>
                <div className="w-8 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Request from:</div>
                  <div className="text-base">{formData.requestingDepartment}</div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="notes" className="block font-medium mb-1">Notes/Comments (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Add any relevant details..."
                value={formData.notes}
                onChange={handleFormChange}
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-3">Business Dimensions</h3>
          
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="projectCode" className="block font-medium mb-1">Project Code</label>
              <select 
                value={formData.businessDimensions.projectCode}
                onChange={(e) => handleBusinessDimensionChange("projectCode", e.target.value)}
              >
                <option value="">None</option>
                {projectCodes.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="marketSegment" className="block font-medium mb-1">Market Segment</label>
              <select 
                value={formData.businessDimensions.marketSegment}
                onChange={(e) => handleBusinessDimensionChange("marketSegment", e.target.value)}
              >
                <option value="">None</option>
                {marketSegments.map(segment => (
                  <option key={segment} value={segment}>{segment}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="event" className="block font-medium mb-1">Event</label>
              <select 
                value={formData.businessDimensions.event}
                onChange={(e) => handleBusinessDimensionChange("event", e.target.value)}
              >
                <option value="">None</option>
                {events.map(event => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
        
        {/* Items Section */}
        <Card className="p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Items</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddItem(true)}
              className="flex items-center gap-1"
            >
              <Plus size={16} /> Add Item
            </Button>
          </div>
          
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No items added yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddItem(true)}
                className="mt-2"
              >
                Add your first item
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div 
                  key={item.id} 
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.sku}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-8 w-8"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Quantity:</div>
                      <div className="font-medium">{item.requestedQty} {item.unit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Purpose:</div>
                      <div className="font-medium">{item.purpose || "Regular"}</div>
                    </div>
                  </div>
                  
                  {item.notes && (
                    <div className="mt-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Notes:</div>
                      <div className="text-sm">{item.notes}</div>
                    </div>
                  )}
                  
                  {/* Display Business Dimensions if any */}
                  {(item.businessDimensions?.projectCode || item.businessDimensions?.marketSegment || item.businessDimensions?.event) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.businessDimensions?.projectCode && (
                        <span className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded-md">
                          Project: {item.businessDimensions.projectCode}
                        </span>
                      )}
                      {item.businessDimensions?.marketSegment && (
                        <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-md">
                          Segment: {item.businessDimensions.marketSegment}
                        </span>
                      )}
                      {item.businessDimensions?.event && (
                        <span className="text-xs bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-md">
                          Event: {item.businessDimensions.event}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      
      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground border border-border rounded-lg max-w-sm w-full max-h-[80vh] overflow-auto m-4">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">Add Item</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setShowAddItem(false)}
              >
                <X size={16} />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Item Selection */}
              <div>
                <label htmlFor="itemSearch" className="block font-medium mb-1">Search Items</label>
                <div className="flex gap-2">
                  <Input
                    id="itemSearch"
                    placeholder="Search by name or SKU..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Barcode size={16} />
                  </Button>
                </div>
                
                <div className="mt-2 h-40 overflow-y-auto border rounded-md">
                  {inventoryItems.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-2 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleItemSelect(item)}
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">SKU: {item.sku} | Unit: {item.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Item Details */}
              {newItem.name && (
                <>
                  <div>
                    <label htmlFor="name" className="block font-medium mb-1">Item Name</label>
                    <input
                      id="name"
                      name="name"
                      value={newItem.name}
                      onChange={handleItemChange}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sku" className="block font-medium mb-1">SKU</label>
                    <input
                      id="sku"
                      name="sku"
                      value={newItem.sku}
                      onChange={handleItemChange}
                      readOnly
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="requestedQty" className="block font-medium mb-1">Quantity</label>
                      <div className="flex items-center mt-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-r-none border-r-0"
                          onClick={() => {
                            const currentValue = parseFloat(String(newItem.requestedQty)) || 0;
                            const newValue = Math.max(1, currentValue - 1); // Min quantity is 1 for SR
                            setNewItem(prev => ({ ...prev, requestedQty: newValue }));
                          }}
                          aria-label="Decrease quantity"
                        >
                          -
                        </Button>
                        <input
                          id="requestedQty"
                          name="requestedQty"
                          type="number"
                          min="1"
                          step="1"
                          value={newItem.requestedQty}
                          onChange={(e) => {
                            const val = e.target.value;
                            // Allow empty string for clearing, or parse to number
                            setNewItem(prev => ({ ...prev, requestedQty: val === '' ? 1 : parseFloat(val) || 1 }));
                          }}
                          className="w-full h-9 px-2 py-1.5 border-t border-b border-input text-center text-sm focus:ring-0 focus:outline-none"
                          placeholder="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-l-none border-l-0"
                          onClick={() => {
                            const currentValue = parseFloat(String(newItem.requestedQty)) || 0;
                            setNewItem(prev => ({ ...prev, requestedQty: currentValue + 1 }));
                          }}
                          aria-label="Increase quantity"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="unit" className="block font-medium mb-1">Unit</label>
                      <input
                        id="unit"
                        name="unit"
                        value={newItem.unit}
                        onChange={handleItemChange}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="purpose" className="block font-medium mb-1">Purpose</label>
                    <select 
                      value={newItem.purpose}
                      onChange={(e) => setNewItem(prev => ({ ...prev, purpose: e.target.value as Item["purpose"] }))}
                    >
                      <option value="Regular">Regular</option>
                      <option value="Special Event">Special Event</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block font-medium mb-1">Notes (Optional)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      placeholder="Add any special requirements..."
                      value={newItem.notes}
                      onChange={handleItemChange}
                      className="min-h-[60px]"
                    />
                  </div>
                </>
              )}
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddItem(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default"
                  className="flex-1"
                  onClick={handleAddItem}
                  disabled={!newItem.name || newItem.requestedQty <= 0}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 