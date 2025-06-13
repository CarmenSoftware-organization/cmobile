"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { mockSpotCheckItems } from "@/mock/spotCheckData";
import { FileAttachments, FileAttachment } from "@/components/ui/file-attachments";
import { Save, Pause, CheckCircle, Clock, MapPin, Calendar, AlertTriangle, Camera, FileText, TrendingUp, TrendingDown } from "lucide-react";

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

export default function SpotCheckCountPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId;

  // Mock session info - this would come from existing session data when resuming
  const [sessionInfo] = useState<SessionInfo>({
    id: sessionId as string,
    name: `Spot Check Session ${sessionId}`,
    location: "Main Store", // This would come from existing session data
    method: "Random", // This would come from existing session data
    startedAt: "2024-06-15T09:00:00Z", // This would come from existing session data
    lastSaved: new Date().toISOString(),
    totalItems: 20, // This would come from existing session data
    checkedItems: 0,
    status: "In Progress"
  });

  // Mock items - in a real app, this would load from saved session data
  const [items, setItems] = useState<SpotCheckItem[]>(
    mockSpotCheckItems.slice(0, 20).map(item => ({
      ...item,
      actual: typeof item.actual === "number" ? item.actual : "",
      notes: item.notes ?? "",
      attachments: []
    }))
  );

  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
    router.push('/spot-check/location');
  };

  const handleProceed = async () => {
    if (hasUnsavedChanges) {
      await handleSave();
    }
    router.push(`/spot-check/session/${sessionId}/review?method=${sessionInfo.method}&count=${totalItems}&location=${encodeURIComponent(sessionInfo.location)}&startedAt=${encodeURIComponent(sessionInfo.startedAt)}`);
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
          <div>
            <h1 className="text-xl font-bold text-blue-700 dark:text-blue-400">Spot Check Session</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{sessionInfo.name}</p>
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
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{item.sku}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    System: {item.systemQty} {item.unit}
                  </div>
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
                <input
                  type="number"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={item.actual}
                  onChange={e => handleCountChange(idx, e.target.value === "" ? "" : Number(e.target.value))}
                  min={0}
                  step="0.01"
                  placeholder="Count"
                />
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
                  Save Progress
                </>
              )}
            </button>
            
            <button
              className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              onClick={handlePause}
            >
              <Pause className="w-4 h-4" />
              Pause & Exit
            </button>
            
            <button
              className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
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
    </div>
  );
}