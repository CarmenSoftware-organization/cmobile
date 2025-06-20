"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { mockPhysicalCountItems } from "@/mock/physicalCountData";
import { FileAttachments, FileAttachment } from "@/components/ui/file-attachments";
import { CheckCircle, Clock, MapPin, Calendar, Plus, Minus, Calculator, X, Trash2, ChevronLeft, Search, Filter, ScanLine } from "lucide-react";

interface PhysicalCountItem {
  sku: string;
  name: string;
  actual: number | null;
  unit: string;
  availableUnits?: string[];
  notes: string;
  attachments: FileAttachment[];
  counted: boolean;
}

interface SessionInfo {
  id: string;
  name: string;
  location: string;
  period: string;
  startedAt: string;
  lastSaved: string;
  totalItems: number;
  countedItems: number;
  status: "In Progress" | "Paused" | "Review";
}

interface CalculatorItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

const UNIT_CONVERSIONS: Record<string, number> = {
  'g': 1,
  'kg': 1000,
  'mg': 0.001,
  'L': 1000, // assuming 1L = 1kg for liquids
  'mL': 1,
  'pcs': 1, // assume 1 piece = 1 gram (default)
  'box': 100, // assume 1 box = 100g (adjustable)
  'case': 1000, // assume 1 case = 1kg (adjustable)
  'bottle': 500, // assume 1 bottle = 500g (adjustable)
  'pack': 50, // assume 1 pack = 50g (adjustable)
};

export default function PhysicalCountEntryPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  // Mock session info
  const [sessionInfo] = useState<SessionInfo>({
    id: sessionId,
    name: "Main Store - June 2024",
    location: "Main Store",
    period: "June 2024",
    startedAt: "2024-06-15T09:00:00Z",
    lastSaved: "2024-06-15T14:30:00Z",
    totalItems: mockPhysicalCountItems.length,
    countedItems: mockPhysicalCountItems.filter(item => item.counted).length,
    status: "In Progress"
  });
  
  // Convert mock data to new structure without system quantity and variance
  const initialItems = mockPhysicalCountItems.map(item => ({
    sku: item.sku,
    name: item.name,
    actual: item.actual,
    unit: item.unit,
    availableUnits: ["pcs", "kg", "g", "L", "mL", "box", "case", "bottle", "pack"],
    notes: item.notes || "",
    attachments: [],
    counted: item.counted || false
  }));
  
  const [items, setItems] = useState<PhysicalCountItem[]>(initialItems);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize lastSaved on client side only to prevent hydration mismatch
  useEffect(() => {
    setLastSaved(new Date(sessionInfo.lastSaved));
  }, [sessionInfo.lastSaved]);

  // Calculator dialog state
  const [showCalculatorDialog, setShowCalculatorDialog] = useState(false);
  const [currentCalculatorItemIndex, setCurrentCalculatorItemIndex] = useState<number | null>(null);
  const [calculatorItems, setCalculatorItems] = useState<CalculatorItem[]>([]);
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [activeCalculatorItemId, setActiveCalculatorItemId] = useState<string | null>(null);
  const [numberPadValue, setNumberPadValue] = useState("");

  // Scan dialog state
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [scannedItem, setScannedItem] = useState<PhysicalCountItem | null>(null);

  // Filter panel state
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    status: "all", // all, counted, uncounted
    category: "all", // all, food, beverages, supplies, equipment
    subCategory: "all", // all, dairy, meat, produce, etc.
    itemGroup: "all", // all, perishable, non-perishable, etc.
    unit: "all", // all, bottle, kg, case, etc.
    hasNotes: false,
    hasAttachments: false
  });

  // Calculate progress
  const countedItems = items.filter(item => item.counted).length;
  const totalItems = items.length;
  const progress = Math.round((countedItems / totalItems) * 100);

  // Calculate base total in grams
  const baseTotalGrams = calculatorItems.reduce((total, item) => {
    const conversionFactor = UNIT_CONVERSIONS[item.unit] || 1;
    return total + (item.quantity * conversionFactor);
  }, 0);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleSave(false); // Silent save
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasUnsavedChanges]);

  const handleCountChange = (idx: number, value: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? { ...item, actual: value, counted: value !== null && !isNaN(value) && value >= 0 }
          : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleNotesChange = (idx: number, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => 
        i === idx ? { ...item, notes: value } : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleAddFile = (idx: number, file: File) => {
    setItems((prev) =>
      prev.map((item, i) => 
        i === idx 
          ? { 
              ...item, 
              attachments: [
                ...item.attachments,
                {
                  id: `file-${Date.now()}`,
                  name: file.name,
                  type: "file",
                  url: URL.createObjectURL(file),
                  file
                }
              ]
            } 
          : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleAddPhoto = (idx: number, photo: File) => {
    setItems((prev) =>
      prev.map((item, i) => 
        i === idx 
          ? { 
              ...item, 
              attachments: [
                ...item.attachments,
                {
                  id: `photo-${Date.now()}`,
                  name: photo.name,
                  type: "photo",
                  url: URL.createObjectURL(photo),
                  file: photo
                }
              ]
            } 
          : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleRemoveAttachment = (idx: number, attachmentId: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => 
        i === idx 
          ? { 
              ...item, 
              attachments: item.attachments.filter(a => a.id !== attachmentId)
            } 
          : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const toggleItemExpand = (sku: string) => {
    setExpandedItem(expandedItem === sku ? null : sku);
  };

  // Calculator dialog functions
  const openCalculatorDialog = (itemIndex: number) => {
    setCurrentCalculatorItemIndex(itemIndex);
    const item = items[itemIndex];
    setCalculatorItems([{
      id: `calc-${Date.now()}`,
      name: `${item.name} (${item.unit})`,
      quantity: item.actual || 0,
      unit: item.unit
    }]);
    setShowCalculatorDialog(true);
  };

  const closeCalculatorDialog = () => {
    setShowCalculatorDialog(false);
    setCurrentCalculatorItemIndex(null);
    setCalculatorItems([]);
    setShowNumberPad(false);
    setActiveCalculatorItemId(null);
    setNumberPadValue("");
  };

  const addCalculatorItem = () => {
    if (currentCalculatorItemIndex !== null) {
      const mainItem = items[currentCalculatorItemIndex];
      setCalculatorItems(prev => [...prev, {
        id: `calc-${Date.now()}`,
        name: `${mainItem.name} (additional unit)`,
        quantity: 0,
        unit: 'pcs'
      }]);
    }
  };

  const removeCalculatorItem = (id: string) => {
    setCalculatorItems(prev => prev.filter(item => item.id !== id));
  };

  const updateCalculatorItem = (id: string, field: keyof CalculatorItem, value: string | number) => {
    setCalculatorItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const openNumberPad = (itemId: string, currentValue: number) => {
    setActiveCalculatorItemId(itemId);
    setNumberPadValue(currentValue.toString());
    setShowNumberPad(true);
  };

  const numberPadInput = (digit: string) => {
    if (digit === 'clear') {
      setNumberPadValue('');
    } else if (digit === 'backspace') {
      setNumberPadValue(prev => prev.slice(0, -1));
    } else if (digit === '.') {
      if (!numberPadValue.includes('.')) {
        setNumberPadValue(prev => prev + '.');
      }
    } else {
      setNumberPadValue(prev => prev + digit);
    }
  };

  const confirmNumberPad = () => {
    if (activeCalculatorItemId) {
      const value = parseFloat(numberPadValue) || 0;
      updateCalculatorItem(activeCalculatorItemId, 'quantity', Math.max(0, value));
    }
    setShowNumberPad(false);
    setActiveCalculatorItemId(null);
    setNumberPadValue('');
  };

  const confirmCalculatorTotal = () => {
    if (currentCalculatorItemIndex !== null) {
      const totalQuantity = calculatorItems.reduce((sum, item) => {
        const conversionFactor = UNIT_CONVERSIONS[item.unit] || 1;
        const baseUnit = items[currentCalculatorItemIndex].unit;
        const targetConversion = UNIT_CONVERSIONS[baseUnit] || 1;
        return sum + (item.quantity * conversionFactor / targetConversion);
      }, 0);
      
      handleCountChange(currentCalculatorItemIndex, Math.round(totalQuantity * 100) / 100);
    }
    closeCalculatorDialog();
  };

  // Scan functions
  const openScanDialog = () => {
    setShowScanDialog(true);
    setScanResult("");
    setScannedItem(null);
  };

  const closeScanDialog = () => {
    setShowScanDialog(false);
    setScanResult("");
    setScannedItem(null);
  };

  const handleScanResult = (scannedCode: string) => {
    setScanResult(scannedCode);
    // Find item by SKU or name
    const foundItem = items.find(item => 
      item.sku.toLowerCase() === scannedCode.toLowerCase() ||
      item.name.toLowerCase().includes(scannedCode.toLowerCase())
    );
    setScannedItem(foundItem || null);
  };

  const confirmScanCount = (count: number) => {
    if (scannedItem) {
      const itemIndex = items.findIndex(item => item.sku === scannedItem.sku);
      if (itemIndex !== -1) {
        handleCountChange(itemIndex, count);
        closeScanDialog();
      }
    }
  };

  // Filter functions
  const openFilterPanel = () => {
    setShowFilterPanel(true);
  };

  const closeFilterPanel = () => {
    setShowFilterPanel(false);
  };

  const updateFilter = (key: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      category: "all",
      subCategory: "all",
      itemGroup: "all", 
      unit: "all",
      hasNotes: false,
      hasAttachments: false
    });
  };

  // Apply filters to items
  const filteredItems = items.filter(item => {
    if (filters.status !== "all") {
      if (filters.status === "counted" && !item.counted) return false;
      if (filters.status === "uncounted" && item.counted) return false;
    }
    
    if (filters.unit !== "all" && item.unit !== filters.unit) return false;
    
    if (filters.hasNotes && !item.notes.trim()) return false;
    
    if (filters.hasAttachments && item.attachments.length === 0) return false;
    
    return true;
  });

  // Count active filters
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'hasNotes' || key === 'hasAttachments') return value;
    return value !== "all";
  }).length;

  const handleSave = async (showFeedback = true) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    
    if (showFeedback) {
      // Could show a toast notification here
    }
  };

  const handleSaveAndSubmit = async () => {
    console.log('Save and Submit clicked');
    console.log('Current countedItems:', countedItems, 'totalItems:', totalItems);
    
    try {
      if (hasUnsavedChanges) {
        console.log('Saving changes...');
        await handleSave();
      }
      
      const reviewUrl = `/physical-count/session/${sessionId}/review`;
      console.log('Navigating to:', reviewUrl);
      
      // Use replace instead of push to ensure navigation
      router.replace(reviewUrl);
    } catch (error) {
      console.error('Error in handleSaveAndSubmit:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Enhanced Header */}
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">Physical Count Entry</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sessionInfo.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded text-xs font-medium">
                {sessionInfo.status}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {countedItems} / {totalItems}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {progress}% Complete
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {sessionInfo.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {sessionInfo.period}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last saved: {lastSaved ? lastSaved.toLocaleTimeString() : '--:--:--'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status Indicators */}
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded text-xs font-medium">
              Unsaved Changes
            </span>
          </div>
        )}
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Scan item"
            onClick={openScanDialog}
          >
            <ScanLine className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
            title="Filter items"
            onClick={openFilterPanel}
          >
            <Filter className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Items List */}
        <div className="flex flex-col gap-4">
          {filteredItems.map((item, idx) => (
            <div key={item.sku} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">SKU: {item.sku}</div>
                </div>

              </div>

              {/* Count Input */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-0">
                  Actual Count:
                </label>
                
                {/* Small Input with Calculator button */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="px-2 py-1 w-24 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.actual ?? ""}
                    onChange={e => handleCountChange(idx, Number(e.target.value))}
                    min={0}
                    step="0.01"
                  />
                  <button
                    className="px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                    onClick={() => openCalculatorDialog(idx)}
                    type="button"
                    title="Detailed entry"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Unit Display */}
                <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.unit}
                </span>
                
                {item.counted && (
                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                )}
              </div>
              
              {/* Expand Button */}
              <button 
                className="text-sm text-blue-600 dark:text-blue-400 underline self-start"
                onClick={() => toggleItemExpand(item.sku)}
              >
                {expandedItem === item.sku ? "Hide details" : "Add notes & evidence"}
              </button>
              
              {/* Expanded Details */}
              {expandedItem === item.sku && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={3}
                      placeholder="Add notes about any discrepancies, damage, or special conditions..."
                      value={item.notes}
                      onChange={e => handleNotesChange(idx, e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Evidence & Documentation
                    </label>
                    <FileAttachments
                      attachments={item.attachments}
                      onAddFile={(file) => handleAddFile(idx, file)}
                      onAddPhoto={(photo) => handleAddPhoto(idx, photo)} 
                      onRemove={(attachmentId) => handleRemoveAttachment(idx, attachmentId)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-4 -mx-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className={`w-full py-3 ${countedItems >= totalItems 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-700 hover:bg-blue-800'
            } text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors`}
            onClick={handleSaveAndSubmit}
          >
            <CheckCircle className="w-4 h-4" />
            {countedItems >= totalItems ? "Save and Submit" : "Save for Resume"}
          </button>
          
          {hasUnsavedChanges && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 text-center mt-2">
              You have unsaved changes. They will be saved automatically or when you take an action.
            </p>
          )}
        </div>
      </main>

      {/* Calculator Dialog */}
      {showCalculatorDialog && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeCalculatorDialog();
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-t-xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Calculator
                </h3>
                {currentCalculatorItemIndex !== null && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {items[currentCalculatorItemIndex].name}
                  </p>
                )}
              </div>
              <button
                onClick={closeCalculatorDialog}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {calculatorItems.map((calcItem) => (
                <div key={calcItem.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-750">
                  <div className="flex items-center gap-3">
                    <div className="flex-[3] flex items-center border border-gray-300 dark:border-gray-500 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                      <button
                        onClick={() => updateCalculatorItem(calcItem.id, 'quantity', Math.max(0, calcItem.quantity - 1))}
                        className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-blue-600 dark:text-blue-400"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openNumberPad(calcItem.id, calcItem.quantity)}
                        className="flex-1 py-2 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 text-base font-medium border-x border-gray-300 dark:border-gray-500"
                      >
                        {calcItem.quantity}
                      </button>
                      <button
                        onClick={() => updateCalculatorItem(calcItem.id, 'quantity', calcItem.quantity + 1)}
                        className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-blue-600 dark:text-blue-400"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <select
                      value={calcItem.unit}
                      onChange={(e) => updateCalculatorItem(calcItem.id, 'unit', e.target.value)}
                      className="flex-1 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.keys(UNIT_CONVERSIONS).map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>

                    {calculatorItems.length > 1 && (
                      <button
                        onClick={() => removeCalculatorItem(calcItem.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Show converted value */}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
                    = {(calcItem.quantity * (UNIT_CONVERSIONS[calcItem.unit] || 1)).toFixed(2)}g
                  </div>
                </div>
              ))}

              {/* Add Item Button */}
              <button
                onClick={addCalculatorItem}
                className="w-full py-3 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl text-blue-600 dark:text-blue-400 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Another Unit
              </button>
            </div>

            {/* Footer with Base Total */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-750 rounded-b-xl">
              <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Weight:</span>
                <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {baseTotalGrams.toFixed(2)}g
                </span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={closeCalculatorDialog}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCalculatorTotal}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
                >
                  Use This Total
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Number Pad Dialog */}
      {showNumberPad && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowNumberPad(false);
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">Enter Quantity</h4>
              <button
                onClick={() => setShowNumberPad(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col">
              <div className="text-center mb-4">
                <input
                  type="text"
                  value={numberPadValue}
                  readOnly
                  className="text-xl font-mono text-center border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[1,2,3,4,5,6,7,8,9].map(num => (
                  <button
                    key={num}
                    onClick={() => numberPadInput(num.toString())}
                    className="h-14 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-lg font-semibold"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => numberPadInput('.')}
                  className="h-14 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-lg font-semibold"
                >
                  .
                </button>
                <button
                  onClick={() => numberPadInput('0')}
                  className="h-14 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-lg font-semibold"
                >
                  0
                </button>
                <button
                  onClick={() => numberPadInput('backspace')}
                  className="h-14 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-lg font-semibold"
                >
                  ⌫
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => numberPadInput('clear')}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold"
                >
                  Clear
                </button>
                <button
                  onClick={confirmNumberPad}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan Dialog */}
      {showScanDialog && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeScanDialog();
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Scan Item
              </h3>
              <button
                onClick={closeScanDialog}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Mock Scanner Interface */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <ScanLine className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">Point camera at barcode or QR code</p>
                
                {/* Mock Manual Input */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Or enter SKU manually..."
                    value={scanResult}
                    onChange={(e) => handleScanResult(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  
                  {/* Quick SKU Buttons for Testing */}
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleScanResult('SKU001')}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm"
                    >
                      SKU001
                    </button>
                    <button
                      onClick={() => handleScanResult('SKU002')}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm"
                    >
                      SKU002
                    </button>
                  </div>
                </div>
              </div>

              {/* Scan Result */}
              {scanResult && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Scan Result:</h4>
                                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">&ldquo;{scanResult}&rdquo;</p>
                  
                  {scannedItem ? (
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-200">Item Found!</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{scannedItem.name}</p>
                        <p className="text-gray-600 dark:text-gray-400">{scannedItem.sku}</p>
                        <p className="text-gray-600 dark:text-gray-400">Unit: {scannedItem.unit}</p>
                      </div>
                      
                      {/* Count Input */}
                      <div className="mt-3 space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Enter Count:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const value = Number((e.target as HTMLInputElement).value);
                                if (value >= 0) confirmScanCount(value);
                              }
                            }}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{scannedItem.unit}</span>
                        </div>
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                            const value = Number(input?.value || 0);
                            if (value >= 0) confirmScanCount(value);
                          }}
                          className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold"
                        >
                          Confirm Count
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <X className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800 dark:text-red-200">Item Not Found</span>
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        No item matches this SKU. Try scanning again or check the code.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
                     </div>
         </div>
       )}

       {/* Filter Panel */}
       {showFilterPanel && (
         <div 
           className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
           onClick={(e) => {
             if (e.target === e.currentTarget) {
               closeFilterPanel();
             }
           }}
         >
           <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[85vh] flex flex-col">
             {/* Header */}
             <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                 Filter Items
               </h3>
               <div className="flex items-center gap-2">
                 {activeFilterCount > 0 && (
                   <button
                     onClick={clearFilters}
                     className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                   >
                     Clear All
                   </button>
                 )}
                 <button
                   onClick={closeFilterPanel}
                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                 >
                   <X className="w-5 h-5" />
                 </button>
               </div>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto p-4 space-y-6">
               {/* Status Filter */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                   Count Status
                 </label>
                 <div className="space-y-2">
                   {[
                     { value: "all", label: "All Items" },
                     { value: "counted", label: "Counted" },
                     { value: "uncounted", label: "Not Counted" }
                   ].map((option) => (
                     <label key={option.value} className="flex items-center gap-3">
                       <input
                         type="radio"
                         name="status"
                         value={option.value}
                         checked={filters.status === option.value}
                         onChange={(e) => updateFilter("status", e.target.value)}
                         className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                       />
                       <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                     </label>
                   ))}
                 </div>
               </div>

               {/* Category Filter */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                   Category
                 </label>
                 <select
                   value={filters.category}
                   onChange={(e) => updateFilter("category", e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                 >
                   <option value="all">All Categories</option>
                   <option value="food">Food & Beverages</option>
                   <option value="supplies">Supplies</option>
                   <option value="equipment">Equipment</option>
                   <option value="cleaning">Cleaning</option>
                   <option value="maintenance">Maintenance</option>
                 </select>
               </div>

               {/* Sub Category Filter */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                   Sub Category
                 </label>
                 <select
                   value={filters.subCategory}
                   onChange={(e) => updateFilter("subCategory", e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                 >
                   <option value="all">All Sub Categories</option>
                   <option value="dairy">Dairy</option>
                   <option value="meat">Meat & Poultry</option>
                   <option value="produce">Produce</option>
                   <option value="beverages">Beverages</option>
                   <option value="condiments">Condiments & Sauces</option>
                   <option value="kitchen">Kitchen Supplies</option>
                   <option value="housekeeping">Housekeeping</option>
                 </select>
               </div>

               {/* Item Group Filter */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                   Item Group
                 </label>
                 <select
                   value={filters.itemGroup}
                   onChange={(e) => updateFilter("itemGroup", e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                 >
                   <option value="all">All Item Groups</option>
                   <option value="perishable">Perishable</option>
                   <option value="non-perishable">Non-Perishable</option>
                   <option value="frozen">Frozen</option>
                   <option value="dry-goods">Dry Goods</option>
                   <option value="liquids">Liquids</option>
                   <option value="disposables">Disposables</option>
                 </select>
               </div>



               {/* Additional Filters */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                   Additional Filters
                 </label>
                 <div className="space-y-3">
                   <label className="flex items-center gap-3">
                     <input
                       type="checkbox"
                       checked={filters.hasNotes}
                       onChange={(e) => updateFilter("hasNotes", e.target.checked)}
                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                     />
                     <span className="text-sm text-gray-700 dark:text-gray-300">Has Notes</span>
                   </label>
                   <label className="flex items-center gap-3">
                     <input
                       type="checkbox"
                       checked={filters.hasAttachments}
                       onChange={(e) => updateFilter("hasAttachments", e.target.checked)}
                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                     />
                     <span className="text-sm text-gray-700 dark:text-gray-300">Has Attachments</span>
                   </label>
                 </div>
               </div>
             </div>

             {/* Footer */}
             <div className="border-t border-gray-200 dark:border-gray-700 p-4">
               <div className="flex gap-3">
                 <button
                   onClick={closeFilterPanel}
                   className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={closeFilterPanel}
                   className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                 >
                   Apply Filters ({filteredItems.length})
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}
// ...rest of file
