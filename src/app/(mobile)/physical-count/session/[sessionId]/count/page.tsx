"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { mockPhysicalCountItems } from "@/mock/physicalCountData";
import { FileAttachments, FileAttachment } from "@/components/ui/file-attachments";
import { Save, Pause, CheckCircle, Clock, MapPin, Calendar, Plus, Minus, ChevronDown, Calculator, X, Trash2 } from "lucide-react";

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
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date(sessionInfo.lastSaved));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Calculator dialog state
  const [showCalculatorDialog, setShowCalculatorDialog] = useState(false);
  const [currentCalculatorItemIndex, setCurrentCalculatorItemIndex] = useState<number | null>(null);
  const [calculatorItems, setCalculatorItems] = useState<CalculatorItem[]>([]);
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [activeCalculatorItemId, setActiveCalculatorItemId] = useState<string | null>(null);
  const [numberPadValue, setNumberPadValue] = useState("");

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
          ? { ...item, actual: value, counted: true }
          : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleUnitChange = (idx: number, unit: string) => {
    setItems((prev) =>
      prev.map((item, i) => 
        i === idx ? { ...item, unit } : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const incrementCount = (idx: number) => {
    const item = items[idx];
    const newValue = (item.actual || 0) + 1;
    handleCountChange(idx, newValue);
  };

  const decrementCount = (idx: number) => {
    const item = items[idx];
    const newValue = Math.max(0, (item.actual || 0) - 1);
    handleCountChange(idx, newValue);
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

  const handleSave = async (showFeedback = true) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    setIsSaving(false);
    
    if (showFeedback) {
      // Could show a toast notification here
    }
  };

  const handlePause = async () => {
    if (hasUnsavedChanges) {
      await handleSave();
    }
    router.push('/physical-count/sessions');
  };

  const handleProceed = async () => {
    if (hasUnsavedChanges) {
      await handleSave();
    }
    router.push(`/physical-count/session/${sessionId}/review`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Enhanced Header */}
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">Physical Count Entry</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{sessionInfo.name}</p>
          </div>
          <div className="text-right">
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
            Last saved: {lastSaved.toLocaleTimeString()}
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
        <div className="flex gap-2">
          {hasUnsavedChanges && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded text-xs font-medium">
              Unsaved Changes
            </span>
          )}
          <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded text-xs font-medium">
            {sessionInfo.status}
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4">
        {/* Items List */}
        <div className="flex flex-col gap-4">
          {items.map((item, idx) => (
            <div key={item.sku} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{item.sku}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Unit: {item.unit}</div>
                </div>
              </div>

              {/* Count Input */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-0">
                  Actual Count:
                </label>
                
                {/* Input Group with attached +/- buttons */}
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                  <button
                    className="px-3 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-r border-gray-300 dark:border-gray-600"
                    onClick={() => decrementCount(idx)}
                    type="button"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    className="px-3 py-2 w-24 bg-transparent text-gray-900 dark:text-gray-100 border-0 focus:outline-none focus:ring-0"
                    value={item.actual ?? ""}
                    onChange={e => handleCountChange(idx, Number(e.target.value))}
                    min={0}
                    step="0.01"
                  />
                  <button
                    className="px-3 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-l border-gray-300 dark:border-gray-600"
                    onClick={() => incrementCount(idx)}
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    className="px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border-l border-gray-300 dark:border-gray-600"
                    onClick={() => openCalculatorDialog(idx)}
                    type="button"
                    title="Detailed entry"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Unit Dropdown */}
                <div className="relative">
                  <select
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none pr-8"
                    value={item.unit}
                    onChange={e => handleUnitChange(idx, e.target.value)}
                  >
                    {(item.availableUnits || ["pcs", "kg", "g", "L", "mL", "box", "case", "bottle", "pack"]).map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                
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

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-4 -mx-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => handleSave(true)}
              disabled={isSaving || !hasUnsavedChanges}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
            
            <button
              className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              onClick={handlePause}
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
            
            <button
              className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              onClick={handleProceed}
            >
              <CheckCircle className="w-4 h-4" />
              Review
            </button>
          </div>
          
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
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeCalculatorDialog();
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Calculator
                </h3>
                {currentCalculatorItemIndex !== null && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {items[currentCalculatorItemIndex].name}
                  </p>
                )}
              </div>
              <button
                onClick={closeCalculatorDialog}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {calculatorItems.map((calcItem) => (
                <div key={calcItem.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
                      <button
                        onClick={() => updateCalculatorItem(calcItem.id, 'quantity', Math.max(0, calcItem.quantity - 1))}
                        className="px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-r border-gray-300 dark:border-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => openNumberPad(calcItem.id, calcItem.quantity)}
                        className="px-3 py-1 min-w-[60px] text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm"
                      >
                        {calcItem.quantity}
                      </button>
                      <button
                        onClick={() => updateCalculatorItem(calcItem.id, 'quantity', calcItem.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-l border-gray-300 dark:border-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <select
                      value={calcItem.unit}
                      onChange={(e) => updateCalculatorItem(calcItem.id, 'unit', e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    >
                      {Object.keys(UNIT_CONVERSIONS).map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>

                    {calculatorItems.length > 1 && (
                      <button
                        onClick={() => removeCalculatorItem(calcItem.id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Item Button */}
              <button
                onClick={addCalculatorItem}
                className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Unit
              </button>
            </div>



            {/* Footer with Base Total */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Total (grams):</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {baseTotalGrams.toFixed(2)}g
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={closeCalculatorDialog}
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCalculatorTotal}
                  className="flex-1 py-2 bg-blue-600 text-white rounded font-semibold text-sm"
                >
                  Select Total
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
    </div>
  );
}
// ...rest of file
