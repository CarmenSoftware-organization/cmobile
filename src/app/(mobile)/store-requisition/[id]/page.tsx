"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define types for items and inventory data
type Item = {
  id: number;
  name: string;
  sku: string;
  requestedQty: number;
  unit: string;
  approvedQty: number | null;
  approvedUnit?: string;
  issuedQty: number | null;
  issuedUnit?: string;
  notes: string;
  status: "Pending" | "Approved" | "Rejected" | "Review";
  approvalNote?: string;
  approvedBy?: string;
  approvedAt?: string;
  price?: number;
  totalCost?: number;
  businessDimensions?: {
    projectCode?: string;
    marketSegment?: string;
    event?: string;
  };
  unitOptions?: string[];
};

interface OnHandData {
  location: string;
  qtyAvailable: number;
  min: number;
  max: number;
  lastCounted: string;
}

interface OnOrderData {
  poNumber: string;
  vendor: string;
  orderedQty: number;
  status: string;
  dueDate: string;
}

type ItemStatus = "Pending" | "Approved" | "Rejected" | "Review";

export default function StoreRequisitionDetailPage() {
  const params = useParams();
  const { id } = params;
  
  // State for On Hand and On Order modals
  const [showOnHand, setShowOnHand] = useState(false);
  const [showOnOrder, setShowOnOrder] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // New state for workflow logic
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const [selectedItems, setSelectedItems] = useState<number[]>([]); // For bulk actions
  
  // Enhanced select logic state - from PR Approval
  const [showBulkSelectDialog, setShowBulkSelectDialog] = useState(false);
  const [bulkSelectOption, setBulkSelectOption] = useState<'all' | 'pending'>('all');
  const selectAllCheckboxRef = React.useRef<HTMLInputElement>(null);
  
  // Mock data for the store requisition
  const [requisition, setRequisition] = useState({
    id: id,
    srNumber: `SR-2025-${id}`,
    status: "In-progress",
    requestDate: "2025-05-20",
    requestingDepartment: "F&B",
    requestingLocation: "Main Kitchen",
    sourceLocation: "Main Store",
    requestor: "Michelle Tan",
    businessUnit: "Grand Hotel Singapore",
    value: "$1,200.00",
    lastAction: "Return for additional justification (2024-06-06)",
    items: [
      {
        id: 1,
        name: "Premium Coffee Beans",
        sku: "SKU11111",
        requestedQty: 10,
        unit: "kg",
        approvedQty: null,
        approvedUnit: "kg",
        issuedQty: null,
        issuedUnit: "kg",
        notes: "Urgent for upcoming corporate event",
        status: "Pending",
        price: 25.50,
        totalCost: 255.00,
        businessDimensions: {
          projectCode: "PR-2025-001",
          marketSegment: "Food & Beverage",
          event: "Corporate Retreat"
        },
        unitOptions: ["kg", "g", "lb"]
      },
      {
        id: 2,
        name: "Organic Tea Bags",
        sku: "SKU22222",
        requestedQty: 5,
        unit: "box",
        approvedQty: null,
        approvedUnit: "box",
        issuedQty: null,
        issuedUnit: "box",
        notes: "For executive lounge restocking",
        status: "Pending",
        price: 18.75,
        totalCost: 93.75,
        businessDimensions: {
          projectCode: "PR-2025-002",
          marketSegment: "Executive Lounge", 
          event: "Daily Operations"
        },
        unitOptions: ["box", "pack", "piece"]
      }
    ] as Item[],
    notes: "For weekend banquet preparation",
    createdBy: "John Doe",
    createdAt: "2023-06-15T08:30:00Z"
  });
  
  // Mock data for On Hand information
  const onHandData: Record<string, OnHandData[]> = {
    "SKU11111": [
      { location: "Main Store", qtyAvailable: 25, min: 10, max: 50, lastCounted: "2023-06-10" },
      { location: "Kitchen", qtyAvailable: 5, min: 2, max: 10, lastCounted: "2023-06-12" }
    ],
    "SKU22222": [
      { location: "Main Store", qtyAvailable: 12, min: 5, max: 20, lastCounted: "2023-06-08" }
    ]
  };
  
  // Mock data for On Order information
  const onOrderData: Record<string, OnOrderData[]> = {
    "SKU11111": [
      { poNumber: "PO-2023-089", vendor: "Global Foods", orderedQty: 50, status: "Partial", dueDate: "2023-06-20" }
    ],
    "SKU22222": [
      { poNumber: "PO-2023-092", vendor: "Gourmet Supplies", orderedQty: 24, status: "Ordered", dueDate: "2023-06-25" }
    ]
  };
  
  // Open On Hand modal for a specific item
  const openOnHand = (item: Item) => {
    setSelectedItem(item);
    setShowOnHand(true);
  };
  
  // Open On Order modal for a specific item
  const openOnOrder = (item: Item) => {
    setSelectedItem(item);
    setShowOnOrder(true);
  };

  // Toggle select for a specific item
  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId]
    );
  };

  // Enhanced select logic with smart handling for pending vs all items
  const pendingItems = requisition.items.filter(item => item.status === 'Pending');
  const allSelected = selectedItems.length === requisition.items.length && requisition.items.length > 0;
  const allPendingSelected = selectedItems.length === pendingItems.length && pendingItems.length > 0 && pendingItems.every(pItem => selectedItems.includes(pItem.id));

  // Toggle select all items - shows bulk select dialog only when selecting
  const toggleSelectAll = () => {
    // If items are currently selected, deselect all without dialog
    if (selectedItems.length > 0) {
      setSelectedItems([]);
      return;
    }
    
    // If no items selected, show bulk select dialog
    setShowBulkSelectDialog(true);
  };

  // Workflow logic functions (similar to PR Approval)
  const determineWorkflowAction = () => {
    const itemStatuses = requisition.items.map(item => item.status);
    const allRejected = itemStatuses.every(status => status === 'Rejected');
    const hasReview = itemStatuses.some(status => status === 'Review');
    const hasApproved = itemStatuses.some(status => status === 'Approved');
    const hasPending = itemStatuses.some(status => status === 'Pending');
    const approvedCount = itemStatuses.filter(status => status === 'Approved').length;
    const rejectedCount = itemStatuses.filter(status => status === 'Rejected').length;

    if (allRejected) {
      return { action: 'reject', message: 'All items rejected - SR will be rejected' };
    } else if (hasReview) {
      return { action: 'return', message: 'Items marked for review - SR will be returned to previous stage' };
    } else if (hasPending) {
      return { action: 'none', message: 'Please review all items before submitting' };
    } else if (hasApproved) {
      const message = approvedCount === 1 
        ? `1 item approved, ${rejectedCount} rejected - SR will proceed with approved item`
        : `${approvedCount} items approved, ${rejectedCount} rejected - SR will proceed with approved items`;
      return { action: 'approve', message };
    } else {
      return { action: 'none', message: 'Please review all items before submitting' };
    }
  };

  const handleSubmit = async () => {
    const workflowAction = determineWorkflowAction();
    
    if (workflowAction.action === 'none') {
      alert(workflowAction.message);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would update the SR status via API
      console.log('Workflow action:', workflowAction.action);
      console.log('Item statuses:', requisition.items.map(item => ({ id: item.id, status: item.status })));
      
      // Navigate back to SR list or dashboard
      // router.push('/store-requisition');
    } catch (error) {
      console.error('Error submitting SR:', error);
      alert('Failed to submit SR. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  const getSubmitButtonText = () => {
    const workflowAction = determineWorkflowAction();
    switch (workflowAction.action) {
      case 'approve': return 'Approve';
      case 'reject': return 'Reject';
      case 'return': return 'Return';
      default: return 'Confirm';
    }
  };

  const getSubmitButtonColor = () => {
    const workflowAction = determineWorkflowAction();
    switch (workflowAction.action) {
      case 'approve': return 'bg-green-600 hover:bg-green-700';
      case 'reject': return 'bg-red-600 hover:bg-red-700';
      case 'return': return 'bg-orange-600 hover:bg-orange-700';
      default: return 'bg-gray-400';
    }
  };

  const canSubmit = () => {
    const workflowAction = determineWorkflowAction();
    return workflowAction.action !== 'none';
  };

  // UseEffect to initialize original state
  const originalItemsStateRef = useRef<Item[]>([]);
  const isInitializedRef = useRef(false);
  
  useEffect(() => {
    // Only set original state if it hasn't been initialized yet
    if (!isInitializedRef.current) {
      originalItemsStateRef.current = JSON.parse(JSON.stringify(requisition.items));
      isInitializedRef.current = true;
    }
  }, [requisition.items]); // Include requisition.items as dependency

  const router = useRouter();

  // Add workflow steps for SR
  const workflowSteps = [
    { key: "Requestor", label: "Requestor" },
    { key: "HOD", label: "HOD" },
    { key: "Store", label: "Store" },
    { key: "Fulfilled", label: "Fulfilled" },
  ];

  type SRStatus = "Draft" | "In-progress" | "Complete" | "Issued" | "Rejected" | "Cancel";

  function getCurrentStep(status: SRStatus) {
    if (status === "Draft") return 0;
    if (status === "In-progress") return 1;
    if (status === "Complete") return 2;
    if (status === "Issued") return 3;
    if (status === "Rejected" || status === "Cancel") return 1;
    return 0;
  }

  // Add state for calculator dialog
  const [showCalculatorDialog, setShowCalculatorDialog] = useState(false);
  const [calculatorItemId, setCalculatorItemId] = useState<number | null>(null);
  const [calculatorEntries, setCalculatorEntries] = useState([{ qty: '', unit: 'piece' }]);

  // Hardcoded unit conversion rates
  const UNIT_CONVERSIONS: Record<string, number> = {
    box: 10,
    pack: 5,
    piece: 1,
    kg: 1000,
    g: 1,
    lb: 453.592,
    set: 1,
    unit: 1,
  };

  // Add entry
  const addCalculatorEntry = () => {
    setCalculatorEntries([...calculatorEntries, { qty: '', unit: 'piece' }]);
  };
  // Remove entry
  const removeCalculatorEntry = (idx: number) => {
    setCalculatorEntries(calculatorEntries.filter((_, i) => i !== idx));
  };
  // Update entry
  const updateCalculatorEntry = (idx: number, field: 'qty' | 'unit', value: string) => {
    setCalculatorEntries(calculatorEntries.map((entry, i) =>
      i === idx ? { ...entry, [field]: value } : entry
    ));
  };
  // Calculate total in base unit
  const calculatorTotal = calculatorEntries.reduce((sum, entry) => {
    const qty = parseFloat(entry.qty) || 0;
    const rate = UNIT_CONVERSIONS[entry.unit] || 1;
    return sum + qty * rate;
  }, 0);

  // In openCalculatorDialog, reset calculatorEntries to one entry with current unit
  const openCalculatorDialog = (itemId: number, currentQty: number | null, unit: string = 'piece') => {
    setCalculatorItemId(itemId);
    setCalculatorEntries([{ qty: currentQty?.toString() || '', unit }]);
    setShowCalculatorDialog(true);
  };

  // In handleCalculatorConfirm, use calculatorTotal
  const handleCalculatorConfirm = () => {
    if (calculatorItemId !== null) {
      const updatedItems = requisition.items.map(item => 
        item.id === calculatorItemId 
          ? { ...item, issuedQty: parseFloat(calculatorTotal.toString()) || 0 }
          : item
      );
      setRequisition({ ...requisition, items: updatedItems });
    }
    setShowCalculatorDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* SR Header Card */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 pt-4">
        <Card className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800">
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-8 w-8" 
                  onClick={() => router.back()}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-bold text-base text-gray-900 dark:text-gray-100">{requisition.srNumber}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-blue-700 dark:text-blue-400 text-sm font-semibold">{requisition.businessUnit}</span>
              </div>
            </div>
            
            {/* Workflow Stepper */}
            <div className="flex items-center gap-1 overflow-x-auto mt-3">
              {(() => {
                const current = getCurrentStep(requisition.status as SRStatus);
                const visibleSteps = [];
                
                // Show previous, current, and next steps (3 total)
                const startIdx = Math.max(0, current - 1);
                const endIdx = Math.min(workflowSteps.length - 1, startIdx + 2);
                
                for (let idx = startIdx; idx <= endIdx; idx++) {
                  const step = workflowSteps[idx];
                  const isActive = idx === current;
                  const isDone = idx < current;
                  
                  visibleSteps.push(
                    <div key={step.key} className="flex items-center whitespace-nowrap">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 ${
                        isActive ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500" : 
                        isDone ? "bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600" : 
                        "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-500"
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`ml-1 mr-2 text-xs ${
                        isActive ? "font-semibold text-blue-700 dark:text-blue-400" : 
                        isDone ? "text-green-700 dark:text-green-400" : 
                        "text-gray-400 dark:text-gray-500"
                      }`}>
                        {step.label}
                      </span>
                      {idx < endIdx && (
                        <span className={`w-4 h-0.5 mx-1 ${
                          isDone ? "bg-green-500 dark:bg-green-600" : "bg-gray-300 dark:bg-gray-600"
                        }`} />
                      )}
                    </div>
                  );
                }
                
                return visibleSteps;
              })()}
            </div>
            <div className="flex flex-row justify-between gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
              <div><span className="font-medium">Requestor:</span> {requisition.requestor}</div>
              <div><span className="font-medium">Department:</span> {requisition.requestingDepartment}</div>
            </div>
            <div className="flex flex-row justify-between gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
              <div><span className="font-medium">Date:</span> {requisition.requestDate}</div>
              <div><span className="font-medium">Value:</span> {requisition.value}</div>
            </div>
            <div className="flex flex-row gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span><span className="font-medium">Store:</span> {requisition.sourceLocation}</span>
                <span>→</span>
                <span><span className="font-medium">Request from:</span> {requisition.requestingLocation}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs">

                {requisition.lastAction?.toLowerCase().includes('return') && (
                  <Badge className="text-xs px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700">
                    Return for review
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 px-4">
        <div>
          <div className="flex items-center mb-4 gap-2">
            <div className="flex items-center gap-2">
              <input
                ref={selectAllCheckboxRef}
                type="checkbox"
                checked={allSelected || (pendingItems.length > 0 && allPendingSelected)}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
                aria-label="Bulk select options"
              />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Select
              </h2>
            </div>
          
            {/* Selection Status Summary */}
            <div className="text-xs text-gray-700 dark:text-gray-300">
              {selectedItems.length === requisition.items.length && requisition.items.length > 0 ? (
                <span>All items selected</span>
              ) : selectedItems.length === pendingItems.length && pendingItems.length > 0 && selectedItems.every(id => pendingItems.map(i => i.id).includes(id)) ? (
                <span>Only pending items selected</span>
              ) : selectedItems.length === 0 ? (
                <span>No items selected</span>
              ) : (
                <span>{selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected</span>
              )}
            </div>
          </div>
          
          {/* Bulk Select Modal */}
          <Dialog open={showBulkSelectDialog} onOpenChange={setShowBulkSelectDialog}>
            <DialogContent className="w-[350px]">
              <DialogHeader>
                <DialogTitle>Bulk Select Items</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Choose an option to apply to all items.</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="bulk-all"
                      name="bulk-select"
                      checked={bulkSelectOption === 'all'}
                      onChange={() => setBulkSelectOption('all')}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <label htmlFor="bulk-all" className="text-sm cursor-pointer text-gray-900 dark:text-gray-100">
                      Select <b>All Items</b> <span className="text-xs text-gray-500 dark:text-gray-400">({requisition.items.length})</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="bulk-pending"
                      name="bulk-select"
                      checked={bulkSelectOption === 'pending'}
                      onChange={() => setBulkSelectOption('pending')}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <label htmlFor="bulk-pending" className="text-sm cursor-pointer text-gray-900 dark:text-gray-100">
                      Select <b>Only Pending Items</b> <span className="text-xs text-gray-500 dark:text-gray-400">({pendingItems.length})</span>
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex gap-3 justify-end">
                    <Button variant="ghost" onClick={() => setShowBulkSelectDialog(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            if (bulkSelectOption === 'all') {
                                setSelectedItems(requisition.items.map(item => item.id));
                            } else if (bulkSelectOption === 'pending') {
                                setSelectedItems(pendingItems.map(item => item.id));
                            }
                            setShowBulkSelectDialog(false);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Apply Selection
                    </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {selectedItems.length > 0 && (
            <div className="flex gap-2 mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg items-center">
              <Button size="sm" className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => {
                const updatedItems = requisition.items.map(i => selectedItems.includes(i.id) ? { ...i, status: "Approved" as ItemStatus } : i);
                setRequisition({ ...requisition, items: updatedItems });
              }}>Approve</Button>
              <Button size="sm" className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600" onClick={() => {
                const updatedItems = requisition.items.map(i => selectedItems.includes(i.id) ? { ...i, status: "Review" as ItemStatus } : i);
                setRequisition({ ...requisition, items: updatedItems });
              }}>Review</Button>
              <Button size="sm" className="bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" onClick={() => {
                const updatedItems = requisition.items.map(i => selectedItems.includes(i.id) ? { ...i, status: "Rejected" as ItemStatus } : i);
                setRequisition({ ...requisition, items: updatedItems });
              }}>Reject</Button>
            </div>
          )}

          <ScrollArea className="h-[600px] pr-2">
            {requisition.items.map((item) => (
              <Card key={item.id} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleItemSelection(item.id)} className="mr-2 w-4 h-4 accent-blue-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs px-2 py-0.5">{item.status}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Requested:</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.requestedQty} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Approved:</p>
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          className="w-16 h-8 text-xs border border-gray-300 dark:border-gray-600 rounded-md px-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          value={item.approvedQty ?? item.requestedQty}
                          onChange={(e) => {
                            const updatedItems = requisition.items.map(i =>
                              i.id === item.id
                                ? { ...i, approvedQty: parseFloat(e.target.value) || 0 }
                                : i
                            );
                            setRequisition({ ...requisition, items: updatedItems });
                          }}
                          min="0"
                          step="0.1"
                        />
                        <span className="w-12 h-8 text-xs flex items-center px-1 text-gray-900 dark:text-gray-100">
                          {item.approvedUnit || item.unit}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Issued:</p>
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          className="w-16 h-8 text-xs border border-gray-300 dark:border-gray-600 rounded-md px-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          value={item.issuedQty ?? 0}
                          onChange={(e) => {
                            const updatedItems = requisition.items.map(i =>
                              i.id === item.id
                                ? { ...i, issuedQty: parseFloat(e.target.value) || 0 }
                                : i
                            );
                            setRequisition({ ...requisition, items: updatedItems });
                          }}
                          min="0"
                          step="0.1"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400"
                          title="Calculator"
                          onClick={() => openCalculatorDialog(item.id, item.issuedQty, item.issuedUnit || item.unit)}
                        >
                          <Calculator size={16} />
                        </Button>
                        <span className="w-12 h-8 text-xs flex items-center px-1 text-gray-900 dark:text-gray-100">
                          {item.issuedUnit || item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between text-sm mt-2 mb-1">
                  <div className="flex flex-row gap-3">
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 no-underline hover:underline bg-transparent border-0 p-0" onClick={() => openOnHand(item)}>On Hand</Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 no-underline hover:underline bg-transparent border-0 p-0" onClick={() => openOnOrder(item)}>On Order</Button>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <Button size="sm" className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 !rounded-button" onClick={() => {
                      const updatedItems = requisition.items.map(i => i.id === item.id ? { ...i, status: 'Approved' as ItemStatus } : i);
                      setRequisition({ ...requisition, items: updatedItems });
                    }}>
                      Approve
                    </Button>
                    <Button size="sm" className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 !rounded-button" onClick={() => {
                      const updatedItems = requisition.items.map(i => i.id === item.id ? { ...i, status: 'Review' as ItemStatus } : i);
                      setRequisition({ ...requisition, items: updatedItems });
                    }}>
                      Review
                    </Button>
                    <Button size="sm" className="bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 !rounded-button" onClick={() => {
                      const updatedItems = requisition.items.map(i => i.id === item.id ? { ...i, status: 'Rejected' as ItemStatus } : i);
                      setRequisition({ ...requisition, items: updatedItems });
                    }}>
                      Reject
                    </Button>
                  </div>
                </div>

              </Card>
            ))}
          </ScrollArea>
        </div>
            </main>

      {/* Bottom Action Bar - PR style */}
      <div className="fixed bottom-16 left-0 right-0 bg-transparent p-3 w-full max-w-md mx-auto z-50">
        {/* Workflow Status Indicator */}
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs">
            {determineWorkflowAction().action === 'approve' && (
              <>
                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
                <span className="text-green-700 dark:text-green-300 font-medium">Items approved - SR will proceed</span>
              </>
            )}
            {determineWorkflowAction().action === 'reject' && (
              <>
                <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
                <span className="text-red-700 dark:text-red-300 font-medium">All items rejected - SR will be rejected</span>
              </>
            )}
            {determineWorkflowAction().action === 'return' && (
              <>
                <span className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
                <span className="text-orange-700 dark:text-orange-300 font-medium">Items need review - will return to previous stage</span>
              </>
            )}
            {determineWorkflowAction().action === 'none' && (
              <>
                <span className="w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
              </>
            )}
          </div>
        </div>
        {/* Conditional Button Display */}
        {canSubmit() ? (
          <button 
            className={`w-full h-12 text-white font-medium rounded-md ${getSubmitButtonColor()}`}
            onClick={() => setShowSubmitDialog(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : getSubmitButtonText()}
          </button>
        ) : (
          <button 
            className="w-full h-12 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md"
            onClick={() => setShowSubmitDialog(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : getSubmitButtonText()}
          </button>
        )}
      </div>
      
      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg max-w-sm w-full m-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Submission</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {determineWorkflowAction().message}
                </p>
                
                {/* Item Status Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 border border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Item Status Summary:</h4>
                  <div className="space-y-1 text-xs">
                    {['Approved', 'Rejected', 'Review', 'Pending'].map(status => {
                      const count = requisition.items.filter(item => item.status === status).length;
                      if (count === 0) return null;
                      return (
                        <div key={status} className="flex justify-between text-gray-700 dark:text-gray-300">
                          <span>{status}:</span>
                          <span className="font-medium">{count} item{count !== 1 ? 's' : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-md"
                  onClick={() => setShowSubmitDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className={`flex-1 text-white py-2 px-4 rounded-md ${getSubmitButtonColor()}`}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    getSubmitButtonText()
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* On Hand Modal */}
      {showOnHand && selectedItem && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full max-h-[90vh] overflow-hidden m-4 shadow-xl">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">On Hand Details</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowOnHand(false)}
              >
                <X size={16} />
              </Button>
            </div>

            {/* Product Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                {selectedItem.name}
              </h2>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  {selectedItem.sku}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Inventory Unit: {selectedItem.unit}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Inventory by Location Section */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Inventory by Location
                  </h3>
                </div>

                <div className="space-y-3">
                  {onHandData[selectedItem.sku]?.map((row, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                      {/* Location and Available Quantity */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                          {row.location}
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {row.qtyAvailable}
                        </span>
                      </div>
                      
                      {/* Min and Max */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Min Qty</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{row.min}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Max Qty</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{row.max}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Total Section */}
                  {onHandData[selectedItem.sku]?.length > 0 && (
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700 p-4 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-gray-900 dark:text-gray-100">Total</span>
                        <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          {onHandData[selectedItem.sku]?.reduce((sum, row) => sum + row.qtyAvailable, 0)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {!onHandData[selectedItem.sku]?.length && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                      <span className="text-gray-500 dark:text-gray-400">No on-hand data available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* On Order Modal */}
      {showOnOrder && selectedItem && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full max-h-[90vh] overflow-hidden m-4 shadow-xl">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">On Order Details</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowOnOrder(false)}
              >
                <X size={16} />
              </Button>
            </div>

            {/* Product Info Section */}
            <div className="bg-gray-50 dark:bg-gray-900/30 p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                {selectedItem.name}
              </h2>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {selectedItem.sku}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Purchase Orders Section */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Purchase Orders
                  </h3>
                </div>

                <div className="space-y-3">
                  {onOrderData[selectedItem.sku]?.map((row, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                      {/* PO Number, Status, and Quantity */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                            {row.poNumber}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            row.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            row.status === 'Partial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            row.status === 'Sent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            {row.status}
                          </span>
                        </div>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                          {row.orderedQty} {selectedItem.unit}
                        </span>
                      </div>
                      
                      {/* Vendor and Delivery Date */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Vendor</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{row.vendor}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Delivery Date</span>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{row.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!onOrderData[selectedItem.sku]?.length && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                      <span className="text-gray-500 dark:text-gray-400">No pending orders</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Dialog */}
      {showCalculatorDialog && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg max-w-xs w-full m-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Calculator</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowCalculatorDialog(false)}>
                <X size={16} />
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {calculatorEntries.map((entry, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <input
                    type="number"
                    className="w-20 h-9 px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base"
                    value={entry.qty}
                    onChange={e => updateCalculatorEntry(idx, 'qty', e.target.value)}
                    placeholder="Qty"
                    min="0"
                  />
                  <select
                    className="h-9 px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={entry.unit}
                    onChange={e => updateCalculatorEntry(idx, 'unit', e.target.value)}
                  >
                    {Object.keys(UNIT_CONVERSIONS).map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {calculatorEntries.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeCalculatorEntry(idx)}>
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full mb-2" onClick={addCalculatorEntry}>+ Add Entry</Button>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Total (base unit):</span>
                <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{calculatorTotal}</span>
              </div>
              <Button className="w-full mt-2" onClick={handleCalculatorConfirm}>
                Set Issued Qty
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 