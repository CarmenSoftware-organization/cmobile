"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { mockSpotCheckItems } from "@/mock/spotCheckData";
import { getProductsByLocation } from "@/data/mockInventoryData";
import { FileAttachments, FileAttachment } from "@/components/ui/file-attachments";
import { Save, Pause, CheckCircle, Clock, MapPin, Calendar, AlertTriangle, Camera, FileText, TrendingUp, TrendingDown, ChevronLeft, Calculator, Plus, Minus, X, Trash2 } from "lucide-react";

// Define the type for items to allow attachments array
interface SpotCheckItem {
  sku: string;
  name: string;
  systemQty: number;
  actual: number | "";
  variance: number;
  unit: string;
  notes: string;
  attachments: FileAttachment[];
  checked: boolean;
}

interface SessionInfo {
  id: string;
  name: string;
  location: string;
  method: string;
  startedAt: string;
  lastSaved: string;
  totalItems: number;
  checkedItems: number;
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

export default function SpotCheckSessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = params.sessionId;
  const method = searchParams.get("method");
  const count = Number(searchParams.get("count") || 0);

  // Mock session info
  const [sessionInfo] = useState<SessionInfo>({
    id: sessionId as string,
    name: `Spot Check Session ${sessionId}`,
    location: searchParams.get("location") || "Selected Location",
    method: method || "Random",
    startedAt: new Date().toISOString(),
    lastSaved: new Date().toISOString(),
    totalItems: count,
    checkedItems: 0,
    status: "In Progress"
  });

  const [items, setItems] = useState<SpotCheckItem[]>(() => {
    if (method === "highvalue") {
      const minValue = Number(searchParams.get("minValue") || 50);
      const location = searchParams.get("location") || "";
      
      // Get inventory items with pricing for high value selection
      const inventoryItems = getProductsByLocation(location);
      
      // Filter items by minimum total value and convert to spot check format
      const filteredItems = inventoryItems
        .filter(item => {
          const totalValue = item.unitPrice * item.systemQty;
          return totalValue >= minValue;
        })
        .sort((a, b) => {
          const valueA = a.unitPrice * a.systemQty;
          const valueB = b.unitPrice * b.systemQty;
          return valueB - valueA; // Sort by highest value first
        })
        .slice(0, count)
        .map(item => ({
          sku: item.sku,
          name: item.product,
          systemQty: item.systemQty,
          actual: "" as number | "",
          variance: 0,
          unit: item.unit,
          notes: "",
          attachments: [] as FileAttachment[],
          checked: false
        }));
      
      return filteredItems;
    } else {
      // For random and manual methods, use the original mock data
      return mockSpotCheckItems.slice(0, count).map(item => ({
        ...item,
        actual: typeof item.actual === "number" ? item.actual : "",
        notes: item.notes ?? "",
        attachments: []
      }));
    }
  });

  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize lastSaved on client side only to prevent hydration mismatch
  useEffect(() => {
    setLastSaved(new Date());
  }, []);

  // Calculator dialog state
  const [showCalculatorDialog, setShowCalculatorDialog] = useState(false);
  const [currentCalculatorItemIndex, setCurrentCalculatorItemIndex] = useState<number | null>(null);
  const [calculatorItems, setCalculatorItems] = useState<CalculatorItem[]>([]);
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [activeCalculatorItemId, setActiveCalculatorItemId] = useState<string | null>(null);
  const [numberPadValue, setNumberPadValue] = useState("");

  // Calculate base total in grams
  const baseTotalGrams = calculatorItems.reduce((total, item) => {
    const conversionFactor = UNIT_CONVERSIONS[item.unit] || 1;
    return total + (item.quantity * conversionFactor);
  }, 0);

  // Calculator functions
  const openCalculatorDialog = (itemIndex: number) => {
    setCurrentCalculatorItemIndex(itemIndex);
    setCalculatorItems([
      {
        id: `calc-${Date.now()}`,
        name: items[itemIndex].name,
        quantity: 0,
        unit: items[itemIndex].unit
      }
    ]);
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
    const newItem: CalculatorItem = {
      id: `calc-${Date.now()}`,
      name: `Item ${calculatorItems.length + 1}`,
      quantity: 0,
      unit: "pcs"
    };
    setCalculatorItems([...calculatorItems, newItem]);
  };

  const removeCalculatorItem = (id: string) => {
    setCalculatorItems(calculatorItems.filter(item => item.id !== id));
  };

  const updateCalculatorItem = (id: string, field: keyof CalculatorItem, value: string | number) => {
    setCalculatorItems(calculatorItems.map(item => 
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
      setNumberPadValue("");
    } else if (digit === 'backspace') {
      setNumberPadValue(prev => prev.slice(0, -1));
    } else if (digit === '.') {
      if (!numberPadValue.includes('.')) {
        setNumberPadValue(prev => prev + digit);
      }
    } else {
      setNumberPadValue(prev => prev + digit);
    }
  };

  const confirmNumberPad = () => {
    if (activeCalculatorItemId) {
      updateCalculatorItem(activeCalculatorItemId, 'quantity', Number(numberPadValue) || 0);
    }
    setShowNumberPad(false);
    setActiveCalculatorItemId(null);
    setNumberPadValue("");
  };

  const confirmCalculatorTotal = () => {
    if (currentCalculatorItemIndex !== null) {
      // Convert total grams to the original unit
      const originalUnit = items[currentCalculatorItemIndex].unit;
      const conversionFactor = UNIT_CONVERSIONS[originalUnit] || 1;
      const convertedTotal = baseTotalGrams / conversionFactor;
      
      handleCountChange(currentCalculatorItemIndex, convertedTotal);
    }
    closeCalculatorDialog();
  };

  // Calculate progress and statistics
  const checkedItems = items.filter(item => item.actual !== "" && !isNaN(Number(item.actual))).length;
  const totalItems = items.length;
  const progress = Math.round((checkedItems / totalItems) * 100);
  const varianceItems = items.filter(item => item.actual !== "" && !isNaN(Number(item.actual)) && item.variance !== 0).length;
  const positiveVariances = items.filter(item => item.actual !== "" && !isNaN(Number(item.actual)) && item.variance > 0).length;
  const negativeVariances = items.filter(item => item.actual !== "" && !isNaN(Number(item.actual)) && item.variance < 0).length;

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleSave(false); // Silent save
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasUnsavedChanges]);

  const handleCountChange = (idx: number, value: number | "") => {
    setItems(items =>
      items.map((item, i) =>
        i === idx
          ? {
              ...item,
              actual: value,
              variance: value === "" ? 0 : Number(value) - item.systemQty,
              checked: value !== ""
            }
          : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleNotesChange = (idx: number, value: string) => {
    setItems(items =>
      items.map((item, i) => 
        i === idx ? { ...item, notes: value } : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleAddFile = (idx: number, file: File) => {
    setItems(items =>
      items.map((item, i) => 
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
    setItems(items =>
      items.map((item, i) => 
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
    setItems(items =>
      items.map((item, i) => 
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
    router.push('/spot-check');
  };

  const handleBack = () => {
    router.push('/spot-check/location');
  };

  const handleProceed = async () => {
    if (hasUnsavedChanges) {
      await handleSave();
    }
    router.push(`/spot-check/session/${sessionId}/review?method=${method}&count=${count}&location=${encodeURIComponent(sessionInfo.location)}&startedAt=${encodeURIComponent(sessionInfo.startedAt)}`);
  };

  const getVarianceIcon = (variance: number) => {
    if (variance === 0) return null;
    return variance > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getVarianceBadgeColor = (variance: number) => {
    if (variance === 0) return "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300";
    return variance > 0 
      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
  };

  const isSignificantVariance = (variance: number, systemQty: number) => {
    const percentageVariance = Math.abs(variance / systemQty) * 100;
    return percentageVariance > 10 || Math.abs(variance) > 5; // 10% or more than 5 units
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Enhanced Header */}
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">Spot Check Session</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sessionInfo.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {checkedItems} / {totalItems}
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
            {sessionInfo.method}
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

        {/* Statistics */}
        <div className="flex gap-2">
          {hasUnsavedChanges && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded text-xs font-medium">
              Unsaved Changes
            </span>
          )}
          {varianceItems > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded text-xs font-medium">
              {varianceItems} Variances
            </span>
          )}
          {positiveVariances > 0 && (
            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded text-xs font-medium">
              +{positiveVariances} Over
            </span>
          )}
          {negativeVariances > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded text-xs font-medium">
              -{negativeVariances} Under
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
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.sku}</div>
                </div>
                <div className="text-right">
                  {item.actual !== "" && !isNaN(Number(item.actual)) && (
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getVarianceBadgeColor(item.variance)}`}>
                        {item.variance === 0 ? "Match" : `${item.variance > 0 ? "+" : ""}${item.variance}`}
                      </span>
                      {getVarianceIcon(item.variance)}
                    </div>
                  )}
                  {item.checked && (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  )}
                </div>
              </div>

              {/* Count Input */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-0">
                  Actual Count:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 w-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    value={item.actual}
                    onChange={e => handleCountChange(idx, e.target.value === "" ? "" : Number(e.target.value))}
                    min={0}
                    step="0.01"
                    placeholder="Count"
                  />
                  <button
                    className="px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                    onClick={() => openCalculatorDialog(idx)}
                    type="button"
                    title="Multiple items calculator"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.unit}</span>
              </div>

              {/* Variance Alert */}
              {item.actual !== "" && !isNaN(Number(item.actual)) && item.variance !== 0 && (
                <div className={`p-3 rounded-lg border ${
                  isSignificantVariance(item.variance, item.systemQty)
                    ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                    : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      isSignificantVariance(item.variance, item.systemQty)
                        ? "text-red-600 dark:text-red-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`} />
                    <span className={`text-sm font-medium ${
                      isSignificantVariance(item.variance, item.systemQty)
                        ? "text-red-800 dark:text-red-200"
                        : "text-yellow-800 dark:text-yellow-200"
                    }`}>
                      {isSignificantVariance(item.variance, item.systemQty) ? "Significant Variance Detected" : "Variance Noted"}
                    </span>
                  </div>
                  <div className={`text-xs mt-1 ${
                    isSignificantVariance(item.variance, item.systemQty)
                      ? "text-red-700 dark:text-red-300"
                      : "text-yellow-700 dark:text-yellow-300"
                  }`}>
                    {isSignificantVariance(item.variance, item.systemQty) 
                      ? "Please add notes and photo evidence for this variance."
                      : "Consider adding notes to explain this difference."
                    }
                  </div>
                </div>
              )}
              
              {/* Expand Button */}
              <button 
                className="text-sm text-blue-600 dark:text-blue-400 underline self-start flex items-center gap-1"
                onClick={() => toggleItemExpand(item.sku)}
              >
                {expandedItem === item.sku ? (
                  <>
                    <FileText className="w-3 h-3" />
                    Hide details
                  </>
                ) : (
                  <>
                    <Camera className="w-3 h-3" />
                    Add notes & evidence
                  </>
                )}
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
              className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
                  Save Progress
                </>
              )}
            </button>
            
            <button
              className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              onClick={handlePause}
            >
              <Pause className="w-4 h-4" />
              Pause & Exit
            </button>
            
            <button
              className={`flex-1 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                checkedItems < totalItems
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
              disabled={checkedItems < totalItems}
              onClick={handleProceed}
            >
              <CheckCircle className="w-4 h-4" />
              Proceed to Review
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
    </div>
  );
}
