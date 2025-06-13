"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Define types for items and inventory data
interface Item {
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
  isEdited?: boolean;
  unitOptions?: string[];
}

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

export default function StoreRequisitionDetailPage() {
  const params = useParams();
  const { id } = params;
  
  // State for On Hand and On Order modals
  const [showOnHand, setShowOnHand] = useState(false);
  const [showOnOrder, setShowOnOrder] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // State for SR status
  const [srStatus, setSrStatus] = useState<"Draft" | "In-progress" | "Complete" | "Issued" | "Rejected" | "Cancel">("In-progress");
  
  // New state for workflow logic
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [, setUpdateTrigger] = useState(0); // Force re-render trigger
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // For bulk actions
  
  // Mock data for the store requisition
  const [requisition, setRequisition] = useState({
    id: id,
    srNumber: `SR-2025-${id}`,
    status: "In-progress",
    requestDate: "2025-05-20",
    requestingDepartment: "F&B",
    sourceLocation: "Main Store",
    requestor: "Michelle Tan",
    businessUnit: "Grand Hotel Singapore",
    value: "$1,200.00",
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
        isEdited: false,
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
        isEdited: false,
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
      { poNumber: "PO-2023-089", vendor: "Global Foods", orderedQty: 50, status: "In Transit", dueDate: "2023-06-20" }
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

  // Toggle select all items
  const toggleSelectAll = () => {
    const allSelected = selectedItems.length === requisition.items.length;
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(requisition.items.map(item => item.id));
    }
  };

  // Update SR status based on item statuses
  const updateSrStatus = (items: Item[]) => {
    const allApproved = items.every(item => item.status === "Approved");
    const anyRejected = items.some(item => item.status === "Rejected");
    
    if (allApproved) {
      setSrStatus("Complete");
    } else if (anyRejected) {
      setSrStatus("Rejected");
    } else {
      setSrStatus("In-progress");
    }
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
      case 'approve': return 'Submit & Approve';
      case 'reject': return 'Submit & Reject';
      case 'return': return 'Submit & Return';
      default: return 'Submit';
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

  // Check if any items have been edited
  const hasEditedItems = () => {
    return requisition.items.some(item => item.isEdited === true);
  };

  // Save changes - clear the edited flags
  const handleSaveChanges = () => {
    const updatedItems = requisition.items.map(item => ({
      ...item,
      isEdited: false
    }));
    setRequisition({ ...requisition, items: updatedItems });
    // Update original state to current state
    originalItemsStateRef.current = JSON.parse(JSON.stringify(updatedItems));
  };

  // Cancel changes - revert to original state
  const handleCancelChanges = () => {
    setRequisition({ ...requisition, items: JSON.parse(JSON.stringify(originalItemsStateRef.current)) });
    setSelectedItem(null); // Close any open dialogs
  };

  // Function to update approved quantity
  const updateApprovedQuantity = (itemId: number, quantity: string) => {
    const updatedItems = requisition.items.map(item => 
      item.id === itemId 
        ? {
            ...item,
            status: 'Pending' as const,
            approvedQty: parseFloat(quantity) || 0,
            isEdited: true
          }
        : item
    );
    setRequisition({ ...requisition, items: updatedItems });
    setUpdateTrigger(prev => prev + 1); // Force re-render
  };

  // Function to update approved unit
  const updateApprovedUnit = (itemId: number, unit: string) => {
    const updatedItems = requisition.items.map(item => 
      item.id === itemId 
        ? {
            ...item,
            status: 'Pending' as const,
            approvedUnit: unit,
            isEdited: true
          }
        : item
    );
    setRequisition({ ...requisition, items: updatedItems });
    setUpdateTrigger(prev => prev + 1); // Force re-render
  };

  // Function to update issued quantity
  const updateIssuedQuantity = (itemId: number, quantity: string) => {
    const updatedItems = requisition.items.map(item => 
      item.id === itemId 
        ? {
            ...item,
            status: 'Pending' as const,
            issuedQty: parseFloat(quantity) || 0,
            isEdited: true
          }
        : item
    );
    setRequisition({ ...requisition, items: updatedItems });
    setUpdateTrigger(prev => prev + 1); // Force re-render
  };

  // Function to update issued unit
  const updateIssuedUnit = (itemId: number, unit: string) => {
    const updatedItems = requisition.items.map(item => 
      item.id === itemId 
        ? {
            ...item,
            status: 'Pending' as const,
            issuedUnit: unit,
            isEdited: true
          }
        : item
    );
    setRequisition({ ...requisition, items: updatedItems });
    setUpdateTrigger(prev => prev + 1); // Force re-render
  };

  // Function to update business dimensions
  const updateBusinessDimension = (itemId: number, field: 'projectCode' | 'marketSegment' | 'event', value: string) => {
    const updatedItems = requisition.items.map(item => 
      item.id === itemId 
        ? {
            ...item,
            status: 'Pending' as const,
            businessDimensions: {
              ...item.businessDimensions,
              [field]: value
            },
            isEdited: true
          }
        : item
    );
    setRequisition({ ...requisition, items: updatedItems });
    setUpdateTrigger(prev => prev + 1); // Force re-render
  };

  // Function to set item status
  const setItemStatus = (itemId: number, status: "Approved" | "Rejected" | "Review") => {
    const updatedItems = requisition.items.map(item => 
      item.id === itemId 
        ? {
            ...item,
            status: status,
            isEdited: false // Clear edited flag when status is set
          }
        : item
    );
    setRequisition({ ...requisition, items: updatedItems });
    updateSrStatus(updatedItems);
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

  const statusColors: Record<string, string> = {
    Draft: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
    "In-progress": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-600",
    Complete: "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-600",
    Issued: "bg-green-200 text-green-900 border-green-400 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    Rejected: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-600",
    Cancel: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-600",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Workflow Stepper */}
      <div className="flex flex-col gap-1 p-4 pb-0">
        <span className="text-xs text-muted-foreground mb-1">Stage:</span>
        <div className="flex items-center gap-1">
          {workflowSteps.map((step, idx) => {
            const current = getCurrentStep(requisition.status as SRStatus);
            const isActive = idx === current;
            const isDone = idx < current;
            return (
              <div key={step.key} className="flex items-center">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 ${isActive ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500" : isDone ? "bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600" : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-500"}`}>{idx+1}</div>
                <span className={`ml-1 mr-2 text-xs ${isActive ? "font-semibold text-blue-700 dark:text-blue-400" : isDone ? "text-green-700 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}`}>{step.label}</span>
                {idx < workflowSteps.length - 1 && <span className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* PR/SR Info Section */}
      <div className="p-5 bg-white dark:bg-gray-900 border-b border-border">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="p-1 mr-1 text-blue-600 hover:text-blue-800">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">{requisition.srNumber}</h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-muted-foreground">Status:</span>
            <Badge className={`border text-xs ${statusColors[srStatus] || "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"}`}>{srStatus}</Badge>
          </div>
        </div>
        
        <div className="text-blue-600 dark:text-blue-400 text-base font-medium mt-2">
          BU: {requisition.businessUnit}
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Requestor:</div>
            <div className="text-base">{requisition.requestor}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Department:</div>
            <div className="text-base">{requisition.requestingDepartment}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Date:</div>
            <div className="text-base">{requisition.requestDate}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Value:</div>
            <div className="text-base">{requisition.value}</div>
          </div>
        </div>
        
        {/* Document Status Section */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Document Status:</span> {srStatus}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Workflow Stage:</span> {workflowSteps[getCurrentStep(srStatus as SRStatus)]?.label}
            </span>
          </div>
          {/* Last Action Field */}
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">Last Action:</span> Submitted for HOD Review by {requisition.requestor} ({requisition.requestDate})
            </div>
          </div>
        </div>
        
        {/* From/To Locations */}
        <div className="flex gap-4 mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Store Name:</div>
            <div className="text-base">{requisition.sourceLocation}</div>
          </div>
          <div className="w-8 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">Request from:</div>
            <div className="text-base">{requisition.requestingDepartment}</div>
          </div>
        </div>
      </div>

      {/* Items Section Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-blue-50 dark:bg-blue-950 border-b border-border">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-5 h-5 rounded mr-2 border-2 border-blue-400 accent-blue-600"
            onChange={toggleSelectAll}
            checked={requisition.items.length > 0 && selectedItems.length === requisition.items.length}
          />
          <span className="font-medium text-xl">Items</span>
        </div>
        <span className="text-gray-500 dark:text-gray-400 text-sm">May 20, 2025</span>
      </div>

      {/* Bulk Actions Menu */}
      {selectedItems.length > 0 && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
          <div className="flex gap-2 items-center">
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Bulk Action:</span>
            <button 
              className="py-1 px-2 text-xs bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md"
              onClick={() => {
                const updatedItems = requisition.items.map(item => 
                  selectedItems.includes(item.id) ? { ...item, status: 'Approved' as const, isEdited: false } : item
                );
                setRequisition({ ...requisition, items: updatedItems });
                setSelectedItems([]);
              }}
            >
              Approve
            </button>
            <button 
              className="py-1 px-2 text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md"
              onClick={() => {
                const updatedItems = requisition.items.map(item => 
                  selectedItems.includes(item.id) ? { ...item, status: 'Review' as const, isEdited: false } : item
                );
                setRequisition({ ...requisition, items: updatedItems });
                setSelectedItems([]);
              }}
            >
              Review
            </button>
            <button 
              className="py-1 px-2 text-xs bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
              onClick={() => {
                const updatedItems = requisition.items.map(item => 
                  selectedItems.includes(item.id) ? { ...item, status: 'Rejected' as const, isEdited: false } : item
                );
                setRequisition({ ...requisition, items: updatedItems });
                setSelectedItems([]);
              }}
            >
              Reject
            </button>
            <button 
              className="py-1 px-2 text-xs bg-white dark:bg-gray-700 text-yellow-600 dark:text-yellow-400 border border-yellow-600 dark:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-md"
              onClick={() => {
                const updatedItems = requisition.items.map(item => 
                  selectedItems.includes(item.id) ? { ...item, status: 'Pending' as const, isEdited: false } : item
                );
                setRequisition({ ...requisition, items: updatedItems });
                setSelectedItems([]);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Item List */}
      <div className="flex-1 overflow-auto pb-32">
        {requisition.items.map(item => (
          <div key={item.id} className="p-4 bg-white dark:bg-gray-900 border-b border-border">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="w-5 h-5 mt-1 rounded border-2 border-blue-400 accent-blue-600"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleItemSelection(item.id)}
              />
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.sku}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.isEdited && (
                      <div className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 rounded-full text-xs font-medium">
                        Edited
                      </div>
                    )}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      item.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                      item.status === 'Review' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Requested:</div>
                    <div className="font-medium text-base">{item.requestedQty} {item.unit}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Approved:</div>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-r-none border-r-0"
                        onClick={() => {
                          const currentValue = parseFloat(String(item.approvedQty ?? item.requestedQty)) || 0;
                          updateApprovedQuantity(item.id, Math.max(0, currentValue - 1).toString());
                        }}
                        aria-label="Decrease approved quantity"
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        className="w-full h-9 px-2 py-1.5 border-t border-b border-input text-center text-sm focus:ring-0 focus:outline-none"
                        value={item.approvedQty ?? item.requestedQty}
                        min="0"
                        onChange={(e) => updateApprovedQuantity(item.id, e.target.value)}
                        placeholder="0"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-l-none border-l-0"
                        onClick={() => {
                          const currentValue = parseFloat(String(item.approvedQty ?? item.requestedQty)) || 0;
                          updateApprovedQuantity(item.id, (currentValue + 1).toString());
                        }}
                        aria-label="Increase approved quantity"
                      >
                        +
                      </Button>
                    </div>
                    <select 
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-1 px-1 bg-white dark:bg-gray-800 text-sm mt-1 h-9"
                      value={item.approvedUnit || item.unit}
                      onChange={(e) => updateApprovedUnit(item.id, e.target.value)}
                    >
                      {item.unitOptions?.map(unitOption => (
                        <option key={unitOption} value={unitOption}>{unitOption}</option>
                      )) || <option value={item.unit}>{item.unit}</option>}
                    </select>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Issue Qty:</div>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-r-none border-r-0"
                        onClick={() => {
                          const currentValue = parseFloat(String(item.issuedQty)) || 0;
                          updateIssuedQuantity(item.id, Math.max(0, currentValue - 1).toString());
                        }}
                        aria-label="Decrease issue quantity"
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        className="w-full h-9 px-2 py-1.5 border-t border-b border-input text-center text-sm focus:ring-0 focus:outline-none"
                        value={item.issuedQty || 0}
                        min="0"
                        onChange={(e) => updateIssuedQuantity(item.id, e.target.value)}
                        placeholder="0"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-l-none border-l-0"
                        onClick={() => {
                          const currentValue = parseFloat(String(item.issuedQty)) || 0;
                          updateIssuedQuantity(item.id, (currentValue + 1).toString());
                        }}
                        aria-label="Increase issue quantity"
                      >
                        +
                      </Button>
                    </div>
                    <select 
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-1 px-1 bg-white dark:bg-gray-800 text-sm mt-1 h-9"
                      value={item.issuedUnit || item.unit}
                      onChange={(e) => updateIssuedUnit(item.id, e.target.value)}
                    >
                      {item.unitOptions?.map(unitOption => (
                        <option key={unitOption} value={unitOption}>{unitOption}</option>
                      )) || <option value={item.unit}>{item.unit}</option>}
                    </select>
                  </div>
                </div>
                
                {/* Price and Cost Totals */}
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Unit Price:</div>
                    <div className="font-medium">${item.price?.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Cost:</div>
                    <div className="font-medium">${item.totalCost?.toFixed(2)}</div>
                  </div>
                </div>
                
                {/* Business Dimensions */}
                <div className="mt-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Business Dimensions:</div>
                  <div className="grid grid-cols-1 gap-3">
                    {/* Project Code */}
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Project Code:</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm bg-white dark:bg-gray-800"
                        value={item.businessDimensions?.projectCode || ''}
                        placeholder="Enter project code"
                        onChange={(e) => updateBusinessDimension(item.id, 'projectCode', e.target.value)}
                      />
                    </div>
                    
                    {/* Market Segment */}
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Market Segment:</label>
                      <select 
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-sm"
                        value={item.businessDimensions?.marketSegment || ''}
                        onChange={(e) => updateBusinessDimension(item.id, 'marketSegment', e.target.value)}
                      >
                        <option value="">Select segment</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Executive Lounge">Executive Lounge</option>
                        <option value="Housekeeping">Housekeeping</option>
                        <option value="Front Office">Front Office</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Security">Security</option>
                        <option value="Administration">Administration</option>
                        <option value="Events & Banquets">Events & Banquets</option>
                        <option value="Spa & Wellness">Spa & Wellness</option>
                        <option value="Recreation">Recreation</option>
                      </select>
                    </div>
                    
                    {/* Event */}
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Event:</label>
                      <select 
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-sm"
                        value={item.businessDimensions?.event || ''}
                        onChange={(e) => updateBusinessDimension(item.id, 'event', e.target.value)}
                      >
                        <option value="">Select event type</option>
                        <option value="Daily Operations">Daily Operations</option>
                        <option value="Corporate Retreat">Corporate Retreat</option>
                        <option value="Wedding Reception">Wedding Reception</option>
                        <option value="Conference">Conference</option>
                        <option value="Gala Dinner">Gala Dinner</option>
                        <option value="Product Launch">Product Launch</option>
                        <option value="Holiday Celebration">Holiday Celebration</option>
                        <option value="Training Session">Training Session</option>
                        <option value="Team Building">Team Building</option>
                        <option value="Special Occasion">Special Occasion</option>
                        <option value="Maintenance Work">Maintenance Work</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {item.notes && (
                  <div className="mt-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Comments:</div>
                    <div className="text-sm">{item.notes}</div>
                  </div>
                )}
                
                <div className="mt-4 flex gap-4 flex-wrap">
                  <button 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => openOnHand(item)}
                  >
                    On Hand
                  </button>
                  <button 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => openOnOrder(item)}
                  >
                    On Order
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center ml-auto">
                    Detail <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
                
                {/* Per-item action buttons - xs size */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <button 
                    className="py-1 px-2 text-xs bg-white border border-blue-300 text-blue-600 rounded-md text-center font-medium"
                    onClick={() => setItemStatus(item.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button 
                    className="py-1 px-2 text-xs bg-white border border-gray-300 text-gray-700 rounded-md text-center font-medium"
                    onClick={() => setItemStatus(item.id, "Review")}
                  >
                    Review
                  </button>
                  <button 
                    className="py-1 px-2 text-xs bg-white border border-red-300 text-red-600 rounded-md text-center font-medium"
                    onClick={() => setItemStatus(item.id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar - PR style */}
      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-md p-3 w-full max-w-md mx-auto border-t border-gray-200 dark:border-gray-700 z-50">
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
                <span className="text-gray-700 dark:text-gray-300">Please review all items before submitting</span>
              </>
            )}
          </div>
        </div>
        {/* Conditional Button Display */}
        {hasEditedItems() ? (
          <div className="flex gap-3">
            <button 
              className="flex-1 h-12 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md"
              onClick={handleCancelChanges}
            >
              Cancel Changes
            </button>
            <button 
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button 
            className={`w-full h-12 text-white font-medium rounded-md ${getSubmitButtonColor()}`}
            onClick={() => setShowSubmitDialog(true)}
            disabled={!canSubmit() || isSubmitting}
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
          <div className="bg-card text-card-foreground border border-border rounded-lg max-w-sm w-full max-h-[80vh] overflow-auto m-4">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold">{selectedItem.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedItem.sku}</p>
              </div>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => setShowOnHand(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="p-4">
              <div className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 mb-2 px-2 py-1 rounded-full inline-block">
                BU: {requisition.businessUnit}
              </div>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 dark:bg-muted/20">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground border-b border-border">Location</th>
                      <th className="text-center py-2 px-2 font-medium text-muted-foreground border-b border-border">Qty Available</th>
                      <th className="text-center py-2 px-2 font-medium text-muted-foreground border-b border-border">Min</th>
                      <th className="text-center py-2 px-2 font-medium text-muted-foreground border-b border-border">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {onHandData[selectedItem.sku]?.map((row, index) => (
                      <tr key={index} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                        <td className="py-2 px-3">{row.location}</td>
                        <td className="py-2 px-2 text-center">{row.qtyAvailable}</td>
                        <td className="py-2 px-2 text-center">{row.min}</td>
                        <td className="py-2 px-2 text-center">{row.max}</td>
                      </tr>
                    ))}
                    {!onHandData[selectedItem.sku]?.length && (
                      <tr>
                        <td colSpan={4} className="py-3 text-center text-muted-foreground">No on-hand data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* On Order Modal */}
      {showOnOrder && selectedItem && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground border border-border rounded-lg max-w-sm w-full max-h-[80vh] overflow-auto m-4">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold">{selectedItem.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedItem.sku}</p>
              </div>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => setShowOnOrder(false)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="p-4">
              <div className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 mb-2 px-2 py-1 rounded-full inline-block">
                BU: {requisition.businessUnit}
              </div>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 dark:bg-muted/20">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground border-b border-border">PO Number</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground border-b border-border">Vendor</th>
                      <th className="text-center py-2 px-2 font-medium text-muted-foreground border-b border-border">Qty</th>
                      <th className="text-center py-2 px-2 font-medium text-muted-foreground border-b border-border">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {onOrderData[selectedItem.sku]?.map((row, index) => (
                      <tr key={index} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                        <td className="py-2 px-3">{row.poNumber}</td>
                        <td className="py-2 px-2">{row.vendor}</td>
                        <td className="py-2 px-2 text-center">{row.orderedQty}</td>
                        <td className="py-2 px-2 text-center text-xs">{row.dueDate}</td>
                      </tr>
                    ))}
                    {!onOrderData[selectedItem.sku]?.length && (
                      <tr>
                        <td colSpan={4} className="py-3 text-center text-muted-foreground">No pending orders</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 