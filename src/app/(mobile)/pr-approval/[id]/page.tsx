"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, XCircle, AlertCircle, ChevronLeft, MessageCircle } from "lucide-react";

// Import shared workflow configuration
import {
  getCurrentWorkflowStage,
  canUserActOnPR,
  getWorkflowStageLabel,
  mockUsers,
  getWorkflowSteps
} from '@/lib/workflow';

type ItemStatus = 'Pending' | 'Approved' | 'Review' | 'Rejected' | 'Converted';

type Item = {
  id: number;
  name: string;
  sku: string;
  status: ItemStatus;
  requested: number;
  unit: string;
  onHand: number;
  onOrder: number;
  comments: string;
  imageUrl: string;
  unitOptions?: string[];
  inventoryUnit: string;
  unitPrice: number;
  totalPrice: number;
  onHandData?: Array<{ name: string; qty_available: number; min_qty: number; max_qty: number; last_counted: string; }>;
  onOrderData?: Array<{ po_number: string; vendor: string; ordered_qty: number; status: string; due_date: string; }>;
  requestLocations?: Array<{ location: string; quantity: number; priority: string; notes?: string; }>;
  vendorPrices: Array<{vendor: string; price: number; currency?: string; date?: string}>;
  selectedVendor: string;

  lastPurchaseVendor?: string;
  lastPurchaseDate?: string;
  lastPurchasePrice?: number;
  approvedQuantity: string;
  approvedUnit: string;
  isEdited?: boolean;
  // Currency support
  currency: string;
  baseCurrencyPrice?: number;
  baseCurrencyTotal?: number;
  location?: string;
  requiredDate: string;
  vendor: string;
  pricelistNumber: string;
  businessDimensions?: {
    projectCode?: string;
    costCenter?: string;
    marketSegment?: string;
    event?: string;
    department?: string;
    region?: string;
  };
};

const statusColor: Record<ItemStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Approved: "bg-green-100 text-green-800 border-green-300",
  Review: "bg-blue-100 text-blue-800 border-blue-300",
  Rejected: "bg-red-100 text-red-800 border-red-300",
  Converted: "bg-purple-100 text-purple-800 border-purple-300",
};



export default function PrApprovalDetailPage() {
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [onHandItem, setOnHandItem] = useState<Item | null>(null);
  const [onOrderItem, setOnOrderItem] = useState<Item | null>(null);
  const [priceCompareItem, setPriceCompareItem] = useState<Item | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [originalItemsState, setOriginalItemsState] = useState<Item[]>([]); // Store original state for cancel functionality
  const [showTestPanel, setShowTestPanel] = useState(false);

  const [sendbackStep, setSendbackStep] = useState<number>(0);
  const selectAllCheckboxRef = React.useRef<HTMLInputElement>(null);

  const [currentUserId, setCurrentUserId] = useState("user-hod");
  const currentUser = mockUsers.find(user => user.id === currentUserId) || mockUsers[0];
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [selectedItemComments, setSelectedItemComments] = useState<Item | null>(null);

  const [itemsState, setItemsState] = useState<Item[]>([
    {
      id: 1,
      name: "Premium Coffee Beans",
      sku: "SKU11111",
      status: "Pending" as ItemStatus,
      requested: 10,
      unit: "kg",
      onHand: 50,
      onOrder: 20,
      comments: "Urgent for upcoming corporate event",
      imageUrl: "https://readdy.ai/api/search-image?query=icon%2C%20Realistic%20premium%20coffee%20beans%2C%20photorealistic%20arabica%20coffee%20beans%20with%20rich%20brown%20color%2C%20high-detail%203D%20rendering%2C%20prominent%20main%20subjects%2C%20clear%20and%20sharp%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows%2C%20product%20photography%20style&width=100&height=100&seq=1&orientation=squarish",
      unitOptions: ["kg", "g", "lb"],
      inventoryUnit: "bag",
      unitPrice: 24.99,
      totalPrice: 249.90,
      onHandData: [
        { name: 'Main Store', qty_available: 20, min_qty: 10, max_qty: 100, last_counted: '2025-05-01' },
        { name: 'Bar', qty_available: 5, min_qty: 2, max_qty: 20, last_counted: '2025-04-28' },
      ],
      onOrderData: [
        { po_number: 'PO-2025-001', vendor: 'Vendor A', ordered_qty: 20, status: 'In Progress', due_date: '2025-06-15' },
        { po_number: 'PO-2025-002', vendor: 'Vendor B', ordered_qty: 10, status: 'Completed', due_date: '2025-05-30' },
      ],
      requestLocations: [
        { location: 'Main Kitchen', quantity: 6, priority: 'High', notes: 'For daily breakfast service' },
        { location: 'Banquet Kitchen', quantity: 3, priority: 'Medium', notes: 'For special events' },
        { location: 'Café Counter', quantity: 1, priority: 'Low', notes: 'Backup supply' },
      ],
      vendorPrices: [{vendor: 'Vendor A', price: 24.99, currency: 'SGD', date: '2025-05-01'}, {vendor: 'Vendor B', price: 23.50, currency: 'SGD', date: '2025-05-01'}],
      selectedVendor: 'Vendor A',
      approvedQuantity: "10",
      approvedUnit: "kg",
      currency: "SGD",
      baseCurrencyPrice: 18.49,
      baseCurrencyTotal: 184.90,
      location: "Main Kitchen",
      requiredDate: "2025-01-20",
      vendor: "Premium Coffee Suppliers Ltd",
      pricelistNumber: "PL-COFFEE-2024-001",
      businessDimensions: {
        projectCode: "PROJ-2025-001",
        costCenter: "CC-F&B-001",
        marketSegment: "Corporate Events",
        event: "Annual Conference 2025",
        department: "Food & Beverage",
        region: "Singapore East"
      },
      lastPurchaseVendor: "Vendor A",
      lastPurchaseDate: "2025-05-01",
      lastPurchasePrice: 24.99
    },
    {
      id: 2,
      name: "Organic Tea Bags",
      sku: "SKU22222",
      status: "Approved" as ItemStatus,
      requested: 5,
      unit: "box",
      onHand: 30,
      onOrder: 10,
      comments: "For VIP guest lounge restocking",
      imageUrl: "https://readdy.ai/api/search-image?query=icon%2C%20Realistic%20organic%20tea%20bags%2C%20photorealistic%20tea%20bags%20with%20string%20and%20tag%2C%20high-detail%203D%20rendering%2C%20prominent%20main%20subjects%2C%20clear%20and%20sharp%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows%2C%20product%20photography%20style&width=100&height=100&seq=2&orientation=squarish",
      unitOptions: ["box", "pack"],
      inventoryUnit: "bag",
      unitPrice: 18.50,
      totalPrice: 92.50,
      onHandData: [
        { name: 'Main Store', qty_available: 20, min_qty: 10, max_qty: 100, last_counted: '2025-05-01' },
        { name: 'Bar', qty_available: 5, min_qty: 2, max_qty: 20, last_counted: '2025-04-28' },
      ],
      onOrderData: [
        { po_number: 'PO-2025-003', vendor: 'Vendor C', ordered_qty: 10, status: 'In Progress', due_date: '2025-06-10' },
        { po_number: 'PO-2025-004', vendor: 'Vendor D', ordered_qty: 5, status: 'Completed', due_date: '2025-05-25' },
      ],
      requestLocations: [
        { location: 'VIP Lounge', quantity: 3, priority: 'High', notes: 'Premium tea service for VIP guests' },
        { location: 'Executive Floor', quantity: 2, priority: 'Medium', notes: 'Guest room minibar restocking' },
      ],
      vendorPrices: [{vendor: 'Vendor C', price: 24.99, currency: 'SGD', date: '2025-05-01'}, {vendor: 'Vendor D', price: 23.50, currency: 'SGD', date: '2025-05-01'}],
      selectedVendor: 'Vendor C',
      approvedQuantity: "5",
      approvedUnit: "box",
      currency: "SGD",
      baseCurrencyPrice: 13.69,
      baseCurrencyTotal: 68.45,
      location: "VIP Lounge",
      requiredDate: "2025-01-22",
      vendor: "Organic Tea Co Pte Ltd",
      pricelistNumber: "PL-TEA-2024-002",
      businessDimensions: {
        projectCode: "PROJ-2025-002",
        costCenter: "CC-VIP-001",
        marketSegment: "VIP Services",
        department: "Guest Relations",
        region: "Singapore Central"
      },
      lastPurchaseVendor: "Vendor C",
      lastPurchaseDate: "2025-05-01",
      lastPurchasePrice: 24.99
    },
    {
      id: 3,
      name: "Specialty Sugar",
      sku: "SKU33333",
      status: "Review" as ItemStatus,
      requested: 8,
      unit: "kg",
      onHand: 15,
      onOrder: 0,
      comments: "Brown sugar for specialty coffee bar",
      imageUrl: "https://readdy.ai/api/search-image?query=icon%2C%20Realistic%20brown%20sugar%20crystals%2C%20photorealistic%20specialty%20sugar%20granules%2C%20high-detail%203D%20rendering%2C%20prominent%20main%20subjects%2C%20clear%20and%20sharp%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows%2C%20product%20photography%20style&width=100&height=100&seq=3&orientation=squarish",
      unitOptions: ["kg", "g"],
      inventoryUnit: "bag",
      unitPrice: 12.75,
      totalPrice: 102.00,
      onHandData: [
        { name: 'Main Store', qty_available: 20, min_qty: 10, max_qty: 100, last_counted: '2025-05-01' },
        { name: 'Bar', qty_available: 5, min_qty: 2, max_qty: 20, last_counted: '2025-04-28' },
      ],
      onOrderData: [
        { po_number: 'PO-2025-005', vendor: 'Vendor E', ordered_qty: 8, status: 'In Progress', due_date: '2025-06-05' },
        { po_number: 'PO-2025-006', vendor: 'Vendor F', ordered_qty: 0, status: 'Completed', due_date: '2025-05-20' },
      ],
      requestLocations: [
        { location: 'Specialty Coffee Bar', quantity: 5, priority: 'High', notes: 'Premium brown sugar for artisan drinks' },
        { location: 'Banquet Service', quantity: 2, priority: 'Medium', notes: 'For coffee stations at events' },
        { location: 'Room Service', quantity: 1, priority: 'Low', notes: 'Guest requests for in-room coffee' },
      ],
      vendorPrices: [{vendor: 'Vendor E', price: 22.99, currency: 'SGD', date: '2025-05-01'}, {vendor: 'Vendor F', price: 21.50, currency: 'SGD', date: '2025-05-01'}],
      selectedVendor: 'Vendor E',
      approvedQuantity: "8",
      approvedUnit: "kg",
      currency: "SGD",
      baseCurrencyPrice: 9.44,
      baseCurrencyTotal: 75.48,
      location: "Specialty Coffee Bar",
      requiredDate: "2025-01-18",
      vendor: "Sugar Specialists Pte Ltd",
      pricelistNumber: "PL-SUGAR-2024-003",
      lastPurchaseVendor: "Vendor E",
      lastPurchaseDate: "2025-05-01",
      lastPurchasePrice: 22.99
    },
    {
      id: 4,
      name: "Milk Frother",
      sku: "SKU44444",
      status: "Rejected" as ItemStatus,
      requested: 2,
      unit: "unit",
      onHand: 3,
      onOrder: 5,
      comments: "Replacement for damaged equipment",
      imageUrl: "https://readdy.ai/api/search-image?query=icon%2C%20Realistic%20milk%20frother%20device%2C%20photorealistic%20stainless%20steel%20milk%20frother%20with%20handle%2C%20high-detail%203D%20rendering%2C%20prominent%20main%20subjects%2C%20clear%20and%20sharp%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows%2C%20product%20photography%20style&width=100&height=100&seq=4&orientation=squarish",
      unitOptions: ["unit", "set"],
      inventoryUnit: "unit",
      unitPrice: 45.00,
      totalPrice: 90.00,
      onHandData: [
        { name: 'Main Store', qty_available: 20, min_qty: 10, max_qty: 100, last_counted: '2025-05-01' },
        { name: 'Bar', qty_available: 5, min_qty: 2, max_qty: 20, last_counted: '2025-04-28' },
      ],
      onOrderData: [
        { po_number: 'PO-2025-007', vendor: 'Vendor G', ordered_qty: 2, status: 'In Progress', due_date: '2025-05-25' },
        { po_number: 'PO-2025-008', vendor: 'Vendor H', ordered_qty: 3, status: 'Completed', due_date: '2025-05-15' },
      ],
      requestLocations: [
        { location: 'Main Café', quantity: 1, priority: 'High', notes: 'Replacement for broken equipment' },
        { location: 'Conference Room Service', quantity: 1, priority: 'Medium', notes: 'Mobile coffee station backup' },
      ],
      vendorPrices: [{vendor: 'Vendor G', price: 19.99, currency: 'SGD', date: '2025-05-01'}, {vendor: 'Vendor H', price: 18.50, currency: 'SGD', date: '2025-05-01'}],
      selectedVendor: 'Vendor G',
      approvedQuantity: "2",
      approvedUnit: "unit",
      currency: "SGD",
      baseCurrencyPrice: 33.30,
      baseCurrencyTotal: 66.60,
      location: "Main Café",
      requiredDate: "2025-01-25",
      vendor: "Kitchen Equipment Ltd",
      pricelistNumber: "PL-EQUIP-2024-004",
      lastPurchaseVendor: "Vendor G",
      lastPurchaseDate: "2025-05-01",
      lastPurchasePrice: 19.99
    }
  ]);

  // Initialize original state when component mounts
  useEffect(() => {
    if (originalItemsState.length === 0) {
      setOriginalItemsState(JSON.parse(JSON.stringify(itemsState)));
    }
  }, [itemsState, originalItemsState.length]);

  // Mock PR header data - matches PR-2001 from the list
  const mockPR = {
    id: 1,
    number: "PR-2001",
    status: "In-progress" as ItemStatus,
    workflowStage: 1, // HOD Review stage
    requestor: "Alice Lee",
    department: "F&B",
    date: "2024-06-01",
    value: "S$1,200.00",
    business_unit: "Grand Hotel Singapore",
    role: "HOD", // Stage 1 requires HOD approval
    createdBy: "user-requestor",
    currentApprover: "user-hod",
    lastAction: "Submitted for HOD Review (2024-06-01)",
    prType: "General",
    currency: "SGD",
    exchangeRate: 0.74,

    baseCurrency: "USD",
    baseValue: "$888.00",
    history: [
      {
        stage: 0,
        status: "Draft",
        user: "Alice Lee",
        role: "Requestor", 
        date: "2024-05-30",
        action: "Created"
      },
      {
        stage: 1,
        status: "In-progress",
        user: "System",
        role: "System",
        date: "2024-06-01",
        action: "Submitted for HOD Review"
      }
    ]
  };

  // Workflow status checks
  const currentWorkflowStage = getCurrentWorkflowStage(mockPR);
  const userCanAct = canUserActOnPR(mockPR, currentUser.role);
  const workflowStageLabel = getWorkflowStageLabel(currentWorkflowStage);
  const hasBusinessUnitAccess = currentUser.businessUnits.includes(mockPR.business_unit);

  // Workflow stage information
  const workflowInfo = {
    currentStage: currentWorkflowStage,
    stageName: workflowStageLabel,
    requiredRole: mockPR.role, // Role required for current stage
    userRole: currentUser.role, // Current user's role
    canApprove: userCanAct && hasBusinessUnitAccess,
    stageDescription: `Stage ${currentWorkflowStage + 1}: ${workflowStageLabel} Review`
  };

  // Select all logic with smart handling for pending vs all items
  const pendingItems = itemsState.filter(item => item.status === 'Pending');
  const allSelected = selectedItems.length === itemsState.length;
  const allPendingSelected = pendingItems.length > 0 && pendingItems.every(item => selectedItems.includes(item.id));
  
  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Workflow logic functions
  const determineWorkflowAction = () => {
    const itemStatuses = itemsState.map(item => item.status);
    const approvedCount = itemStatuses.filter(status => status === 'Approved').length;
    const rejectedCount = itemStatuses.filter(status => status === 'Rejected').length;
    const reviewCount = itemStatuses.filter(status => status === 'Review').length;
    const pendingCount = itemStatuses.filter(status => status === 'Pending').length;
    const totalItems = itemStatuses.length;

    // All items rejected - reject the entire PR
    if (rejectedCount === totalItems) {
      return `REJECT_PR`;
    }
    
    // Any items need review - return for review
    if (reviewCount > 0) {
      return `RETURN_FOR_REVIEW`;
    }
    
    // Any items still pending - not ready for submission (MUST CHECK BEFORE PARTIAL APPROVAL)
    if (pendingCount > 0) {
      return `NOT_READY`;
    }
    
    // All remaining items are approved (no pending, no review) - full approval
    if (approvedCount > 0 && pendingCount === 0 && reviewCount === 0) {
      return `APPROVE_PR`;
    }
    
    // Mixed status (approved + rejected, but no pending/review) - partial approval
    if (approvedCount > 0) {
      return `PARTIAL_APPROVAL`;
    }
    
    // Fallback - not ready for submission
    return `NOT_READY`;
  };

  const handleSubmit = async () => {
    const workflowAction = determineWorkflowAction();
    const itemStatuses = itemsState.map(item => item.status);
    const approvedCount = itemStatuses.filter(status => status === 'Approved').length;
    const rejectedCount = itemStatuses.filter(status => status === 'Rejected').length;
    const reviewCount = itemStatuses.filter(status => status === 'Review').length;
    
    // Prevent submission for invalid states
    if (workflowAction === 'NOT_READY') {
      alert('Please review all items before submitting. Items cannot be left in Pending status.');
      return;
    }



    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log the action for debugging
      console.log('Workflow action:', workflowAction);
      console.log('Item statuses:', itemsState.map(item => ({ id: item.id, status: item.status })));
      console.log('Sendback step:', sendbackStep);
      
      // Show success message based on action
      switch (workflowAction) {
        case 'REJECT_PR':
          alert(`PR rejected - all ${rejectedCount} items were rejected`);
          break;
        case 'RETURN_FOR_REVIEW':
          const stepName = getWorkflowSteps().find(s => s.id === sendbackStep)?.label || 'Unknown';
          alert(`PR returned for review to ${stepName} - ${reviewCount} item(s) need additional review`);
          break;
        case 'APPROVE_PR':
          alert(`PR fully approved - all ${approvedCount} items approved`);
          break;
        case 'PARTIAL_APPROVAL':
          alert(`PR partially approved - ${approvedCount} item(s) approved`);
          break;
      }
      
      // Reset form state
      setSendbackStep(0);
      
      // Navigate back to PR list
      router.push('/pr-approval');
    } catch (error) {
      console.error('Error submitting PR:', error);
      alert('Failed to submit PR. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
    }
  };

  const getSubmitButtonText = () => {
    const workflowAction = determineWorkflowAction();
    const itemStatuses = itemsState.map(item => item.status);
    const approvedCount = itemStatuses.filter(status => status === 'Approved').length;
    const rejectedCount = itemStatuses.filter(status => status === 'Rejected').length;
    
    switch (workflowAction) {
      case 'REJECT_PR': return `Reject PR (${rejectedCount} items)`;
      case 'RETURN_FOR_REVIEW': return 'Return for Review';
      case 'APPROVE_PR': return `Approve PR (${approvedCount} items)`;
      case 'PARTIAL_APPROVAL': return `Partial Approval (${approvedCount} items)`;
      case 'NOT_READY': return 'Review Required';
      default: return 'Submit';
    }
  };

  const getSubmitButtonColor = () => {
    const workflowAction = determineWorkflowAction();
    switch (workflowAction) {
      case 'REJECT_PR': return 'bg-red-600 hover:bg-red-700';
      case 'RETURN_FOR_REVIEW': return 'bg-orange-600 hover:bg-orange-700';
      case 'APPROVE_PR': return 'bg-green-600 hover:bg-green-700';
      case 'PARTIAL_APPROVAL': return 'bg-blue-600 hover:bg-blue-700';
      case 'NOT_READY': return 'bg-gray-400 cursor-not-allowed';
      default: return 'bg-green-600 hover:bg-green-700';
    }
  };

  const canSubmit = () => {
    const workflowAction = determineWorkflowAction();
    return workflowAction !== 'NOT_READY';
  };

  // Check if any items have been edited
  const hasEditedItems = () => {
    return itemsState.some(item => item.isEdited === true);
  };

  // Save changes - clear the edited flags
  const handleSaveChanges = () => {
    setItemsState(prevItems => 
      prevItems.map(item => ({
        ...item,
        isEdited: false
      }))
    );
    // Update original state to current state
    setOriginalItemsState(JSON.parse(JSON.stringify(itemsState)));
  };

  // Cancel changes - revert to original state
  const handleCancelChanges = () => {
    setItemsState(JSON.parse(JSON.stringify(originalItemsState)));
    setSelectedItem(null); // Close any open dialogs
  };

  // Function to update approved quantity
  const updateApprovedQuantity = (itemId: number, quantity: string) => {
    setItemsState(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? {
              ...item,
              status: 'In-progress' as ItemStatus, // Set status to In-progress when edited
              approvedQuantity: quantity,
              isEdited: true // Mark as edited
            }
          : item
      )
    );
    
    // Update selectedItem if it's the same item
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(prev => prev ? {
        ...prev,
        status: 'In-progress' as ItemStatus, // Set status to In-progress when edited
        approvedQuantity: quantity,
        isEdited: true // Mark as edited
      } : null);
    }
  };

  // Function to update Business Dimensions


  // Handle indeterminate state for select all checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const someSelected = selectedItems.length > 0 && selectedItems.length < itemsState.length;
      selectAllCheckboxRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [selectedItems, itemsState.length, allSelected]);

  const [showBulkSelectDialog, setShowBulkSelectDialog] = useState(false);
  const [bulkSelectOption, setBulkSelectOption] = useState<'all' | 'pending' | 'none'>('all');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 relative mx-auto">
      {/* User Context Info */}
      <div className="mb-4">
        {/* Toggle Button */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            🧪 Development Panel
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            onClick={() => setShowTestPanel(!showTestPanel)}
          >
            {showTestPanel ? (
              <ChevronLeft className="h-3 w-3 rotate-90" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        </div>

        {showTestPanel && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 px-4">
            {/* User Switcher for Testing */}
            <div className="mb-3 pb-3 border-b border-blue-200 dark:border-blue-700">
              <label className="block text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
                🧪 Test User Switcher (Development Only)
              </label>
              <select
                value={currentUserId}
                onChange={(e) => setCurrentUserId(e.target.value)}
                className="w-full text-xs border border-blue-300 dark:border-blue-600 rounded px-2 py-1 bg-white dark:bg-blue-800 text-blue-900 dark:text-blue-100"
              >
                {mockUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.businessUnits.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <span className="font-medium">Your Role:</span> {workflowInfo.userRole} 
                  <span className="ml-2 text-xs">({workflowInfo.stageDescription})</span>
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  <span className="font-medium">Stage Requires:</span> {workflowInfo.requiredRole} approval
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  <span className="font-medium">Business Unit Access:</span> {hasBusinessUnitAccess ? "✓ Authorized" : "✗ No access"} for {mockPR.business_unit}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  {workflowInfo.canApprove 
                    ? "✓ You can approve this PR" 
                    : userCanAct 
                      ? "⚠ No business unit access" 
                      : "⚠ This PR requires approval from " + workflowInfo.requiredRole
                  }
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Workflow Stage {workflowInfo.currentStage + 1}
                </div>
                <div className="text-xs font-medium text-blue-900 dark:text-blue-100">
                  {workflowInfo.stageName}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Needs: {workflowInfo.requiredRole}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PR Header Card */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4">
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
                <span className="font-bold text-base text-gray-900 dark:text-gray-100">{mockPR.number}</span>
                {mockPR.prType && (
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${mockPR.prType === 'Market List' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'}`}>
                    {mockPR.prType}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-blue-700 dark:text-blue-400 text-sm font-semibold">{mockPR.business_unit}</span>
              </div>
            </div>
            
            {/* Workflow Stepper */}
            <div className="flex items-center gap-1 overflow-x-auto mt-3">
              {getWorkflowSteps(currentWorkflowStage).map((step, idx) => {
                const isActive = step.id === currentWorkflowStage;
                const isDone = step.id < currentWorkflowStage;
                
                return (
                  <div key={step.id} className="flex items-center whitespace-nowrap">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 ${
                      isActive ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500" : 
                      isDone ? "bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600" : 
                      "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-500"
                    }`}>
                      {step.id + 1}
                    </div>
                    <span className={`ml-1 mr-2 text-xs ${
                      isActive ? "font-semibold text-blue-700 dark:text-blue-400" : 
                      isDone ? "text-green-700 dark:text-green-400" : 
                      "text-gray-400 dark:text-gray-500"
                    }`}>
                      {step.label}
                    </span>
                    {idx < getWorkflowSteps(currentWorkflowStage).length - 1 && (
                      <span className={`w-4 h-0.5 mx-1 ${
                        isDone ? "bg-green-500 dark:bg-green-600" : "bg-gray-300 dark:bg-gray-600"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-row justify-between gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
              <div><span className="font-medium">Requestor:</span> {mockPR.requestor}</div>
              <div><span className="font-medium">Department:</span> {mockPR.department}</div>
            </div>
            <div className="flex flex-row justify-between gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
              <div><span className="font-medium">Date:</span> {mockPR.date}</div>
              {mockPR.currency !== mockPR.baseCurrency && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Base Amount:</span> {mockPR.baseValue} ({mockPR.baseCurrency})
                </div>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs">

                <Badge className="text-xs px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700">
                  Return for review
                </Badge>
              </div>

            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 px-4">
        <div>
          <div className="flex items-center mb-4 gap-2">
            <input
              ref={selectAllCheckboxRef}
              type="checkbox"
              checked={allSelected || (pendingItems.length > 0 && allPendingSelected)}
              onChange={() => setShowBulkSelectDialog(true)}
              className="mr-2 w-4 h-4 accent-blue-600 cursor-pointer"
              aria-label="Bulk select options"
            />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Select
              {pendingItems.length > 0 ? (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  ({pendingItems.length} pending)
                </span>
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  ({itemsState.length} processed)
                </span>
              )}
            </h2>
          </div>
          {/* Selection Status Summary */}
          <div className="mb-2 text-xs text-gray-700 dark:text-gray-300">
            {selectedItems.length === itemsState.length && itemsState.length > 0 ? (
              <span>All items selected</span>
            ) : selectedItems.length === pendingItems.length && pendingItems.length > 0 && selectedItems.every(id => pendingItems.map(i => i.id).includes(id)) ? (
              <span>Only pending items selected</span>
            ) : selectedItems.length === 0 ? (
              <span>No items selected</span>
            ) : (
              <span>{selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected</span>
            )}
          </div>

          {/* Bulk Select Modal */}
          <Dialog open={showBulkSelectDialog} onOpenChange={setShowBulkSelectDialog}>
            <DialogContent className="w-[350px]">
              <DialogHeader>
                <DialogTitle>Bulk Select Items</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="bulk-all"
                    name="bulk-select"
                    checked={bulkSelectOption === 'all'}
                    onChange={() => setBulkSelectOption('all')}
                  />
                  <label htmlFor="bulk-all" className="text-sm cursor-pointer">
                    Select <b>All Items</b> <span className="text-xs text-gray-500">({itemsState.length})</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="bulk-pending"
                    name="bulk-select"
                    checked={bulkSelectOption === 'pending'}
                    onChange={() => setBulkSelectOption('pending')}
                  />
                  <label htmlFor="bulk-pending" className="text-sm cursor-pointer">
                    Select <b>Only Pending Items</b> <span className="text-xs text-gray-500">({pendingItems.length})</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="bulk-none"
                    name="bulk-select"
                    checked={bulkSelectOption === 'none'}
                    onChange={() => setBulkSelectOption('none')}
                  />
                  <label htmlFor="bulk-none" className="text-sm cursor-pointer">
                    Deselect All
                  </label>
                </div>
                <div className="mt-4 flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowBulkSelectDialog(false)}>Cancel</Button>
                  <Button
                    onClick={() => {
                      if (bulkSelectOption === 'all') {
                        setSelectedItems(itemsState.map(item => item.id));
                      } else if (bulkSelectOption === 'pending') {
                        setSelectedItems(pendingItems.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                      setShowBulkSelectDialog(false);
                    }}
                  >
                    Apply Selection
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {selectedItems.length > 0 && (
            <div className="flex gap-2 mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg items-center">
              <Button size="sm" className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => setItemsState(prev => prev.map(item => selectedItems.includes(item.id) ? { ...item, status: 'Approved', isEdited: false } : item))}>Approve</Button>
              <Button size="sm" className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600" onClick={() => {
                const comment = prompt('Please provide a reason for requesting review:');
                if (comment !== null && comment.trim()) {
                  setItemsState(prev => prev.map(item => selectedItems.includes(item.id) ? { ...item, status: 'Review', comments: comment.trim(), isEdited: false } : item));
                }
              }}>Review</Button>
              <Button size="sm" className="bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" onClick={() => {
                const comment = prompt('Please provide a reason for rejection:');
                if (comment !== null && comment.trim()) {
                  setItemsState(prev => prev.map(item => selectedItems.includes(item.id) ? { ...item, status: 'Rejected', comments: comment.trim(), isEdited: false } : item));
                }
              }}>Reject</Button>
              <Button size="sm" className="bg-white dark:bg-gray-700 text-yellow-600 dark:text-yellow-400 border border-yellow-600 dark:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30" onClick={() => setItemsState(prev => prev.map(item => selectedItems.includes(item.id) ? { ...item, status: 'Pending', isEdited: false } : item))}>Reset</Button>
            </div>
          )}

          <ScrollArea className="h-[600px] pr-2">
            {itemsState.map((item) => (
              <Card key={item.id} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleSelectItem(item.id)} className="mr-2 w-4 h-4 accent-blue-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.isEdited && (
                      <Badge className="text-xs px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700">
                        Edited
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs px-2 py-0.5">{item.status}</Badge>
                      {item.comments && item.status !== 'Approved' && item.status !== 'Pending' && (
                        <div 
                          className="relative cursor-pointer hover:opacity-70 transition-opacity"
                          onClick={() => {
                            setSelectedItemComments(item);
                            setShowCommentsDialog(true);
                          }}
                        >
                          <MessageCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Requested:</p>
                                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.requested} {item.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Approved:</p>
                    <div className="flex items-center">
                      <Input 
                        type="text" 
                        className="w-20 h-8 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" 
                        value={item.approvedQuantity}
                        onChange={(e) => updateApprovedQuantity(item.id, e.target.value)}
                      />
                      <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{item.approvedUnit}</span>
                    </div>
                  </div>
                </div>

                {/* Price Information */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Unit Price:</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${item.unitPrice.toFixed(2)} {item.currency}</p>
                      {item.baseCurrencyPrice && (
                        <p className="text-xs text-muted-foreground">≈ ${item.baseCurrencyPrice.toFixed(2)} USD</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Price:</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${item.totalPrice.toFixed(2)} {item.currency}</p>
                      {item.baseCurrencyTotal && (
                        <p className="text-xs text-muted-foreground">≈ ${item.baseCurrencyTotal.toFixed(2)} USD</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location and Required Date */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location:</p>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 py-1 h-8 flex items-center">
                      {item.location || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Required Date:</p>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 py-1">
                      {new Date(item.requiredDate).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>

                {/* Vendor and Pricelist Number */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Vendor:</p>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 py-1">
                      {item.vendor}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 block">Comments:</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                    rows={2}
                    value={item.comments}
                    onChange={(e) => setItemsState(prev => prev.map(i => i.id === item.id ? { ...i, comments: e.target.value, isEdited: true } : i))}
                  />
                </div>



                <div className="flex flex-row items-center justify-between text-sm mt-2 mb-1">
                  <div className="flex flex-row gap-3">
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 no-underline hover:underline bg-transparent border-0 p-0" onClick={() => setOnHandItem(item)}>On Hand</Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 no-underline hover:underline bg-transparent border-0 p-0" onClick={() => setOnOrderItem(item)}>On Order</Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 no-underline hover:underline bg-transparent border-0 p-0" onClick={() => setPriceCompareItem(item)}>Price Comparison</Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 no-underline hover:underline bg-transparent border-0 p-0 flex items-center gap-1" onClick={() => setSelectedItem(item)}>
                    Detail <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>

                <div className="mt-3">
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <Button size="sm" className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 !rounded-button" onClick={() => setItemsState(prev => prev.map(i => i.id === item.id ? { ...i, status: 'Approved', isEdited: false } : i))}>
                      Approve
                    </Button>
                    <Button size="sm" className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 !rounded-button" onClick={() => {
                      const comment = prompt('Please provide a reason for requesting review:');
                      if (comment !== null && comment.trim()) {
                        setItemsState(prev => prev.map(i => i.id === item.id ? { ...i, status: 'Review', comments: comment.trim(), isEdited: false } : i));
                      }
                    }}>
                      Review
                    </Button>
                    <Button size="sm" className="bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 !rounded-button" onClick={() => {
                      const comment = prompt('Please provide a reason for rejection:');
                      if (comment !== null && comment.trim()) {
                        setItemsState(prev => prev.map(i => i.id === item.id ? { ...i, status: 'Rejected', comments: comment.trim(), isEdited: false } : i));
                      }
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="w-[375px] p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Item Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <ScrollArea className="p-4 max-h-[70vh]">
              {/* Item Header */}
              <div className="flex items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedItem.name}</h3>
                  <p className="text-sm font-mono text-gray-500 dark:text-gray-400">{selectedItem.sku}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedItem.isEdited && (
                      <Badge className="text-xs px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700">
                        Edited
                      </Badge>
                    )}
                    <Badge className={`text-xs ${statusColor[selectedItem.status] || ''}`}>
                      {selectedItem.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Approved Quantity and Conversion Rate */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Approved Quantity</p>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">{selectedItem.approvedQuantity}</span>
                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">{selectedItem.approvedUnit}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Conversion Rate</p>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    1 {selectedItem.unit} = {(selectedItem.requested / parseFloat(selectedItem.approvedQuantity)).toFixed(2)} {selectedItem.inventoryUnit}
                  </div>
                </div>
              </div>

              {/* Approved Base Quantity/Unit */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Approved Base Quantity/Unit</p>
                <Card className="p-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{selectedItem.requested} {selectedItem.inventoryUnit}</span>
                </Card>
              </div>

              {/* Summary Section */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Summary</p>
                <Card className="p-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-2 gap-2 text-sm mb-1 text-gray-900 dark:text-gray-100">
                    <div>Item Subtotal ({selectedItem.currency})</div>
                    <div className="text-right font-medium">${selectedItem.totalPrice.toFixed(2)}</div>
                    <div>Discount (5%)</div>
                    <div className="text-right font-medium">-${(selectedItem.totalPrice * 0.05).toFixed(2)}</div>
                    <div>Net Total</div>
                    <div className="text-right font-medium">${(selectedItem.totalPrice * 0.95).toFixed(2)}</div>
                    <div>Tax (7%)</div>
                    <div className="text-right font-medium">+${(selectedItem.totalPrice * 0.95 * 0.07).toFixed(2)}</div>
                    <div className="font-semibold">Total ({selectedItem.currency})</div>
                    <div className="text-right font-semibold">${(selectedItem.totalPrice * 0.95 * 1.07).toFixed(2)}</div>
                    {selectedItem.baseCurrencyTotal && (
                      <>
                        <div className="text-xs text-muted-foreground">Base Currency Total</div>
                        <div className="text-right text-xs text-muted-foreground">${(selectedItem.baseCurrencyTotal * 0.95 * 1.07).toFixed(2)} USD</div>
                      </>
                    )}
                  </div>
                </Card>
              </div>

              {/* Business Dimensions Section */}
              {selectedItem.businessDimensions && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Business Dimensions</p>
                  <Card className="p-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <div className="space-y-3">
                      {selectedItem.businessDimensions.projectCode && (
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Project Code:</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{selectedItem.businessDimensions.projectCode}</span>
                        </div>
                      )}
                      {selectedItem.businessDimensions.costCenter && (
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Cost Center:</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{selectedItem.businessDimensions.costCenter}</span>
                        </div>
                      )}
                      {selectedItem.businessDimensions.marketSegment && (
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Market Segment:</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{selectedItem.businessDimensions.marketSegment}</span>
                        </div>
                      )}
                      {selectedItem.businessDimensions.event && (
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Event:</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{selectedItem.businessDimensions.event}</span>
                        </div>
                      )}
                      {selectedItem.businessDimensions.department && (
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Department:</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{selectedItem.businessDimensions.department}</span>
                        </div>
                      )}
                      {selectedItem.businessDimensions.region && (
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Region:</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{selectedItem.businessDimensions.region}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 p-3 w-[375px] mx-auto">
        {/* Workflow Status Indicator */}
        <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 text-xs">
            {determineWorkflowAction() === 'REJECT_PR' && (
              <>
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-300 font-medium">All items rejected - PR will be rejected</span>
              </>
            )}
            {determineWorkflowAction() === 'RETURN_FOR_REVIEW' && (
              <>
                <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-orange-700 dark:text-orange-300 font-medium">Items need review - will return to previous stage</span>
              </>
            )}
            {determineWorkflowAction() === 'NOT_READY' && (
              <>
                <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Please review all items before submitting</span>
              </>
            )}
          </div>
        </div>

        {/* Conditional Button Display */}
        {hasEditedItems() ? (
          /* Save/Cancel Buttons when items are edited */
          <div className="flex gap-3">
            <Button 
              className="flex-1 h-12 bg-gray-500 hover:bg-gray-600 text-white font-medium !rounded-button"
              onClick={handleCancelChanges}
            >
              Cancel Changes
            </Button>
            <Button 
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium !rounded-button"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        ) : (
          /* Submit Button when no items are edited */
          <Button 
            className={`w-full h-12 text-white font-medium !rounded-button ${getSubmitButtonColor()}`}
            onClick={() => setShowSubmitDialog(true)}
            disabled={!canSubmit() || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : getSubmitButtonText()}
          </Button>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 w-[375px] mx-auto">
        <div className="grid grid-cols-6 gap-1">
          <div className="flex flex-col items-center cursor-pointer">
            <i className="fas fa-home text-blue-600 dark:text-blue-400 text-[14px]"></i>
            <span className="text-[9px] mt-0.5 text-blue-600 dark:text-blue-400">Home</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <i className="fas fa-box text-gray-500 dark:text-gray-400 text-[14px]"></i>
            <span className="text-[9px] mt-0.5 text-gray-500 dark:text-gray-400">GRN</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <i className="fas fa-check-circle text-gray-500 dark:text-gray-400 text-[14px]"></i>
            <span className="text-[9px] mt-0.5 text-gray-500 dark:text-gray-400">Approval</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <i className="fas fa-shopping-cart text-gray-500 dark:text-gray-400 text-[14px]"></i>
            <span className="text-[9px] mt-0.5 text-gray-500 dark:text-gray-400">Store Req.</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <i className="fas fa-clipboard-list text-gray-500 dark:text-gray-400 text-[14px]"></i>
            <span className="text-[9px] mt-0.5 text-gray-500 dark:text-gray-400">Stock</span>
          </div>
        </div>
      </nav>

      {/* On Hand Dialog */}
      <Dialog open={!!onHandItem} onOpenChange={() => setOnHandItem(null)}>
        <DialogContent className="w-[375px] p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex flex-col items-start text-left space-y-2">
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">On Hand Details</span>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 text-left">
                {onHandItem?.name || 'Product Name'}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <div className="flex flex-row items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-medium">
                    {onHandItem?.sku || 'SKU'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-medium">
                    Base Unit: {onHandItem?.unit}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
          {onHandItem && (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Inventory by Location
                </h3>
                <div className="space-y-3">
                  {onHandItem.onHandData?.map((loc, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md transition-all duration-200">
                      {/* First Level: Location and Available Quantity */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{loc.name}</span>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-extrabold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {loc.qty_available} Available
                        </span>
                      </div>
                      
                      {/* Second Level: Min and Max */}
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Min Qty</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{loc.min_qty}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Max Qty</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{loc.max_qty}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Last Counted</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{loc.last_counted}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(onHandItem.onHandData?.length ?? 0) > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Total Available</span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100">
                          {onHandItem.onHandData?.reduce((sum, loc) => sum + (loc.qty_available || 0), 0) || 0}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {!onHandItem.onHandData?.length && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                      <span className="text-gray-500 dark:text-gray-400">No on-hand data available</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      

      {/* On Order Dialog */}
      <Dialog open={!!onOrderItem} onOpenChange={() => setOnOrderItem(null)}>
        <DialogContent className="w-[375px] p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex flex-col items-start text-left space-y-2">
              <span className="text-lg font-bold text-orange-700 dark:text-orange-300 mb-1">On Order Details</span>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 text-left">
                {onOrderItem?.name || 'Product Name'}
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <div className="flex flex-row items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 text-xs font-medium">
                    {onOrderItem?.sku || 'SKU'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-900 text-xs font-medium">
                    Order Unit: {onOrderItem?.unit}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
          {onOrderItem && (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  Purchase Orders
                </h3>
                <div className="space-y-3">
                  {onOrderItem.onOrderData?.map((po, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md transition-all duration-200">
                      {/* First Level: PO Number and Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{po.po_number}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            po.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                            po.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {po.status === 'In Progress' ? 'Partial' : po.status === 'Completed' ? 'Sent' : po.status}
                          </span>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-extrabold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                          {po.ordered_qty} {onOrderItem.inventoryUnit}
                        </span>
                      </div>
                      
                      {/* Second Level: Vendor and Due Date */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Vendor</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{po.vendor}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Delivery Date</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{po.due_date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!onOrderItem.onOrderData?.length && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
                      <span className="text-gray-500 dark:text-gray-400">No pending orders</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Price Comparison Dialog */}
      <Dialog open={!!priceCompareItem} onOpenChange={() => setPriceCompareItem(null)}>
        <DialogContent className="w-[375px] p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex flex-row items-start justify-between w-full">
              <div className="flex flex-col items-start text-left space-y-2">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 text-left">Price Comparison</DialogTitle>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100 text-left">
                  {priceCompareItem?.name || 'Product Name'}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {priceCompareItem?.sku || 'SKU'}
                </span>
              </div>
              {/* Close button removed as per request */}
            </div>
          </DialogHeader>
          {priceCompareItem && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Selected
                </h3>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 block mb-1">Vendor</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{priceCompareItem.selectedVendor}</span>
                    </div>
                    <div className="col-span-2 mt-2 flex items-center gap-4">
                      <div>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 block mb-1">Price</span>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          ${priceCompareItem.vendorPrices.find(vp => vp.vendor === priceCompareItem.selectedVendor)?.price.toFixed(2) ?? '--'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 block mb-1">Order Unit</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{priceCompareItem.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                  Purchase History
                </h3>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 block mb-1">Last Vendor</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{priceCompareItem.vendor || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 block mb-1">Last Price</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">${priceCompareItem.lastPurchasePrice?.toFixed(2) || 'N/A'}</span>
                    </div>
                    <div className="col-span-2 mt-2">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 block mb-1">Last Purchase Date</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{priceCompareItem.lastPurchaseDate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Pricelist
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Vendor</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {priceCompareItem.vendorPrices.map((vp, idx) => (
                          <tr key={idx} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            vp.vendor === priceCompareItem.selectedVendor ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                          }`}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{vp.vendor}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                ${vp.price.toFixed(2)} {vp.currency || priceCompareItem.currency}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="w-[375px] p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Submission</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {determineWorkflowAction()}
              </p>
              
              {/* Item Status Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Item Status Summary:</h4>
                <div className="space-y-1 text-xs">
                  {['Approved', 'Rejected', 'Review', 'Pending'].map(status => {
                    const count = itemsState.filter(item => item.status === status).length;
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

              {/* Return for Review Section */}
              {determineWorkflowAction() === 'RETURN_FOR_REVIEW' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                    Send back to step:
                  </label>
                  <select
                    value={sendbackStep}
                    onChange={(e) => setSendbackStep(Number(e.target.value))}
                    className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {getWorkflowSteps().map(step => (
                      <option key={step.id} value={step.id}>
                        {step.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}


            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowSubmitDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 text-white ${getSubmitButtonColor()}`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  getSubmitButtonText()
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comments History Dialog */}
      <Dialog open={showCommentsDialog} onOpenChange={setShowCommentsDialog}>
        <DialogContent className="w-[375px] p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Review Comments</DialogTitle>
          </DialogHeader>
          {selectedItemComments && (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{selectedItemComments.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {selectedItemComments.sku}</p>
                <div className="mt-2">
                  <Badge className={`text-xs ${statusColor[selectedItemComments.status] || ''}`}>
                    {selectedItemComments.status}
                  </Badge>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Comments & Review History</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <div className="space-y-3">
                    {/* Mock comment history - in real app this would come from backend */}
                    <div className="border-b border-gray-200 dark:border-gray-600 pb-2 last:border-b-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Finance Review</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-gray-100">{selectedItemComments.comments}</p>
                    </div>
                    {selectedItemComments.status === 'Review' && (
                      <div className="border-b border-gray-200 dark:border-gray-600 pb-2 last:border-b-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">HOD Review</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">Initial review - please verify quantity requirements</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowCommentsDialog(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 