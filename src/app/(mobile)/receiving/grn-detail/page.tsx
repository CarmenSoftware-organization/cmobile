"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  MapPin, 
  X,
  Trash2
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockPOs, type POItem as SharedPOItem } from "@/data/mockPOData";
import { CommentsWithAttachments, Comment as CommentType } from "@/components/ui/file-attachments";
import { getGRNById, mockVendors, type MockGRN, type GRNComment } from "@/data/mockGRNData";

// Use shared PO data instead of local mock data
const pos = mockPOs;



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

// Add interface for PO item structure
interface GrnItem {
  product: string;
  sku: string;
  poNumber: string;
  orderedQty: number;
  orderUnit: string;
  remaining: number;
  receivedQty: string;
  receivedUnit: string;
  focQty: string;
  focUnit: string;
  comment?: string; // Direct comment field for existing GRN items
  jobCode?: string;
  event?: string;
  marketSegment?: string;
  itemDetail?: {
    storeLocation: string;
    itemDescription: string;
    foc: number;
    extraCost: number;
    status: string;
    expiryDate: string;
    department: string;
    accountCode: string;
    conversionRate: number;
    baseQty: number;
    discount: number;
    taxType: string;
    taxRate: number;
    onHand: number;
    onOrder: number;
    reorderThreshold: number;
    restockLevel: number;
    lastPrice: number;
    lastVendor: string;
    comment: string;
    inventoryUnit: string;
    jobCode?: string;
    event?: string;
    marketSegment?: string;
  }; // Optional for scanned items
}

interface PriceCompareData {
  vendor: string;
  price: number;
  currency: string;
  date: string;
}

// Type guard for objects with storeLocation
function hasStoreLocation(obj: unknown): obj is { storeLocation: string } {
  return typeof obj === 'object' && obj !== null && 'storeLocation' in obj && typeof (obj as { storeLocation: unknown }).storeLocation === 'string';
}

function GrnDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Handle multiple PO parameters (po=1&po=2) from both flows
  const poIds = searchParams.getAll("po").map(Number).filter(id => !isNaN(id));
    
  const grnParam = searchParams.get("grn");
  const poDataParam = searchParams.get("poData");
  const locations = searchParams.get("locations");
  
  // Try to load existing GRN data if editing
  const [existingGRN, setExistingGRN] = useState<MockGRN | null>(null);
  
  useEffect(() => {
    if (grnParam) {
      const grnData = getGRNById(grnParam);
      if (grnData) {
        setExistingGRN(grnData);
        // Update items when GRN data is loaded
        const grnItems = grnData.items.map(item => ({
          product: item.product,
          sku: item.sku,
          poNumber: item.poNumber,
          orderedQty: item.orderedQty,
          orderUnit: item.unit,
          remaining: item.orderedQty - item.receivedQty,
          receivedQty: item.receivedQty.toString(),
          receivedUnit: item.unit,
          focQty: item.focQty.toString(),
          focUnit: item.unit,
          comment: item.comment, // Include comment from existing GRN item
          storeLocation: item.storeLocation,
        }));
        setGrnItems(grnItems);
        

        setComments(grnData.comments || []);
      }
    }
  }, [grnParam]);

  // Handle scanned PO data
  let scannedPO = null;
  if (poDataParam) {
    try {
      // First decode URL encoding, then try base64
      const urlDecoded = decodeURIComponent(poDataParam);
      
      // Check if the URL-decoded string looks like base64
      const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(urlDecoded);
      
      if (isBase64) {
        // Try base64 decoding
        const decodedData = atob(urlDecoded);
        scannedPO = JSON.parse(decodedData);
      } else {
        // Try parsing the URL-decoded data directly as JSON
        scannedPO = JSON.parse(urlDecoded);
      }
    } catch (error) {
      console.error("Error parsing PO data (primary method):", error);
      // Fallback: try direct base64 decoding without URL decoding first
      try {
        const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(poDataParam);
        if (isBase64) {
          const decodedData = atob(poDataParam);
          scannedPO = JSON.parse(decodedData);
        } else {
          // Last resort: try parsing directly
          scannedPO = JSON.parse(poDataParam);
        }
      } catch (secondError) {
        console.error("Error parsing PO data (fallback method):", secondError);
      }
    }
  }

  // Get selected POs - handle both scanned PO and traditional flow
  const selectedPOs = useMemo(() => {
    return scannedPO 
      ? [scannedPO] 
      : pos.filter(po => poIds.includes(po.id));
  }, [scannedPO, poIds]);
  
  // Parse selected locations for filtering
  const selectedLocationsList = locations ? locations.split(',').map(loc => loc.trim()) : [];
  
  // Initialize items - use existing GRN data if available, otherwise create from POs
  const initialItems = existingGRN 
    ? existingGRN.items.map(item => ({
        product: item.product,
        sku: item.sku,
        poNumber: item.poNumber,
        orderedQty: item.orderedQty,
        orderUnit: item.unit,
        remaining: item.orderedQty - item.receivedQty,
        receivedQty: item.receivedQty.toString(),
        receivedUnit: item.unit,
        focQty: item.focQty.toString(),
        focUnit: item.unit,
        comment: item.comment, // Include comment from existing GRN item
      }))
    : selectedPOs.flatMap(po =>
        po.items
          .filter((item: SharedPOItem) => {
            // If no specific locations selected or "All" is selected, include all items
            if (!locations || locations === 'All' || selectedLocationsList.length === 0) {
              return true;
            }
            // Otherwise, only include items from selected locations
            return item.itemDetail && selectedLocationsList.includes(item.itemDetail.storeLocation);
          })
          .map((item: SharedPOItem) => ({
            product: item.product,
            sku: item.sku,
            poNumber: po.number,
            orderedQty: item.qty,
            orderUnit: item.orderUnit,
            remaining: item.qty,
            receivedQty: "",
            receivedUnit: item.orderUnit,
            focQty: "",
            focUnit: item.orderUnit,
            itemDetail: item.itemDetail, // Include full item detail from scanned PO
          }))
      );

  const [grnItems, setGrnItems] = useState(initialItems);
  const [tab, setTab] = useState<'items' | 'summary' | 'attachments'>('items');
  
  // GRN Form Fields State
  const [grnFormData, setGrnFormData] = useState({
    refNumber: existingGRN?.grnNumber || '',
    date: existingGRN?.createdDate || new Date().toISOString().split('T')[0],
    invoiceDate: '',
    invoiceNumber: existingGRN?.invoiceNumber || '',
    description: existingGRN?.notes || '',
    vendorId: existingGRN?.vendorId || '',
    businessUnit: existingGRN?.businessUnit || selectedPOs[0]?.businessUnit || '',
    currency: existingGRN?.currency || 'THB',
    exchangeRate: existingGRN?.summary?.exchangeRate || 1.00000
  });

  // Sync grnFormData with existingGRN when it loads
  useEffect(() => {
    if (existingGRN) {
      setGrnFormData({
        refNumber: existingGRN.grnNumber || '',
        date: existingGRN.createdDate || new Date().toISOString().split('T')[0],
        invoiceDate: '',
        invoiceNumber: existingGRN.invoiceNumber || '',
        description: existingGRN.notes || '',
        vendorId: existingGRN.vendorId || '',
        businessUnit: existingGRN.businessUnit || '',
        currency: existingGRN.currency || 'THB',
        exchangeRate: existingGRN.summary?.exchangeRate || 1.00000
      });
    }
  }, [existingGRN]);

  // Default vendor and business unit from PO if not editing existing GRN
  useEffect(() => {
    if (!existingGRN && selectedPOs.length > 0) {
      const po = selectedPOs[0];
      let vendorId = '';
      if (po.vendorId) {
        vendorId = String(po.vendorId);
      } else if (po.vendor) {
        const vendorObj = mockVendors.find(v => v.name === po.vendor);
        if (vendorObj) vendorId = String(vendorObj.id);
      }
      
      // Use functional update to avoid reading from current state
      setGrnFormData(prev => {
        // Only update if the values would actually change
        if (prev.vendorId === vendorId && prev.businessUnit === (po.businessUnit || '')) {
          return prev; // Return same object to prevent re-render
        }
        
        return {
          ...prev,
          vendorId: vendorId,
          businessUnit: po.businessUnit || '',
        };
      });
    }
  }, [existingGRN, selectedPOs]);

  // Handle form field changes
  const handleFormChange = (field: string, value: string | number | boolean) => {
    setGrnFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  


  // Initialize comments from existing GRN or with sample comments
  const [comments, setComments] = useState<GRNComment[]>(
    existingGRN?.comments || [
      { id: 1, sender: 'Alice', timestamp: '2024-06-01 10:00', text: 'Please check the invoice attached.', attachments: [] },
      { id: 2, sender: 'Bob', timestamp: '2024-06-01 10:05', text: 'Received, will review.', attachments: [] },
    ]
  );

  const [showOnHand, setShowOnHand] = useState(false);
  const [showOnOrder, setShowOnOrder] = useState(false);
  const [selectedItem] = useState<GrnItem | null>(null);
  const [showPriceCompare, setShowPriceCompare] = useState(false);
  
  // Mock data for On Hand information
  const onHandData: Record<string, OnHandData[]> = {
    "SKU12345": [
      { location: "Main Store", qtyAvailable: 25, min: 10, max: 50, lastCounted: "2023-06-10" },
      { location: "Kitchen", qtyAvailable: 5, min: 2, max: 10, lastCounted: "2023-06-12" }
    ],
    "SKU54321": [
      { location: "Main Store", qtyAvailable: 12, min: 5, max: 20, lastCounted: "2023-06-08" }
    ],
    "SKU67890": [
      { location: "Main Store", qtyAvailable: 350, min: 100, max: 500, lastCounted: "2023-06-05" },
      { location: "Restaurant", qtyAvailable: 75, min: 50, max: 150, lastCounted: "2023-06-11" }
    ]
  };
  
  // Mock data for On Order information
  const onOrderData: Record<string, OnOrderData[]> = {
    "SKU12345": [
      { poNumber: "PO-2023-089", vendor: "Global Foods", orderedQty: 50, status: "In Transit", dueDate: "2023-06-20" }
    ],
    "SKU54321": [
      { poNumber: "PO-2023-092", vendor: "Gourmet Supplies", orderedQty: 24, status: "Ordered", dueDate: "2023-06-25" }
    ],
    "SKU67890": []
  };
  
  // Mock data for Price Compare information
  const priceCompareData: Record<string, PriceCompareData[]> = {
    "SKU12345": [
      { vendor: "Aqua Supplier", price: 12.0, currency: "SGD", date: "2023-05-10" },
      { vendor: "Water Supplies Inc", price: 12.5, currency: "SGD", date: "2023-04-15" },
      { vendor: "Premium Hydration", price: 13.2, currency: "SGD", date: "2023-03-22" }
    ],
    "SKU54321": [
      { vendor: "Gourmet Supplies", price: 15.0, currency: "SGD", date: "2023-05-05" },
      { vendor: "Premium Beverages", price: 16.0, currency: "SGD", date: "2023-04-10" }
    ],
    "SKU67890": [
      { vendor: "Juice Co.", price: 10.0, currency: "SGD", date: "2023-05-15" }
    ]
  };
  
  // Modal functions - commented out as they're not currently used
  // const openOnHand = (item: GrnItem) => {
  //   setSelectedItem(item);
  //   setShowOnHandModal(true);
  // };

  // const openOnOrder = (item: GrnItem) => {
  //   setSelectedItem(item);
  //   setShowOnOrderModal(true);
  // };

  // const openPriceCompare = (item: GrnItem) => {
  //   setSelectedItem(item);
  //   setShowPriceCompareModal(true);
  // };

  const handleQtyChange = (idx: number, value: string) => {
    setGrnItems(items => items.map((item, i) => i === idx ? { ...item, receivedQty: value } : item) as typeof items);
  };
  const handleFocQtyChange = (idx: number, value: string) => {
    setGrnItems(items => items.map((item, i) => i === idx ? { ...item, focQty: value } : item) as typeof items);
  };
  const handleReceivedUnitChange = (idx: number, value: string) => {
    setGrnItems(items => items.map((item, i) => i === idx ? { ...item, receivedUnit: value } : item) as typeof items);
  };
  const handleFocUnitChange = (idx: number, value: string) => {
    setGrnItems(items => items.map((item, i) => i === idx ? { ...item, focUnit: value } : item) as typeof items);
  };

  // Add delete item function
  const handleDeleteItem = (itemIndex: number) => {
    if (confirm('Are you sure you want to delete this item from the GRN?')) {
      setGrnItems(items => items.filter((_, i) => i !== itemIndex));
    }
  };

  // Financial summary (using existing GRN summary if available)
  const currencyRate = 1.35;
  const subtotal = grnItems.reduce((sum, item) => sum + ((Number(item.receivedQty) || 0) * 10), 0);
  const subtotalBase = subtotal * currencyRate;
  const discount = subtotal * 0.05; // 5% discount
  const discountBase = discount * currencyRate;
  const netAmount = subtotal - discount;
  const netAmountBase = netAmount * currencyRate;
  const extraCost = 0; // Extra costs removed
  const extraCostBase = extraCost * currencyRate;
  const taxAmount = (netAmount + extraCost) * 0.07; // 7% tax on net + extra cost
  const taxAmountBase = taxAmount * currencyRate;
  const grandTotal = netAmount + extraCost + taxAmount;
  const grandTotalBase = grandTotal * currencyRate;

  // Convert GRN comments to CommentsWithAttachments format
  const formattedComments: CommentType[] = comments.map(comment => ({
    id: comment.id,
    sender: comment.sender,
    timestamp: comment.timestamp,
    text: comment.text,
    attachments: comment.attachments?.map(att => ({
      id: att.id,
      name: att.name,
      type: att.type,
      url: att.url,
      file: undefined // For new attachments, this would be a File object
    })) || []
  }));
  
  const handleAddComment = (text: string, attachments: File[]) => {
    const newComment: GRNComment = {
      id: comments.length + 1,
      sender: 'You',
      timestamp: new Date().toLocaleString(),
      text,
      attachments: attachments.map((file, index) => ({
        id: `att${Date.now()}_${index}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'photo' : 'file',
        url: URL.createObjectURL(file),
        size: file.size
      }))
    };
    
    setComments([...comments, newComment]);
  };

  const handleSubmitGRN = () => {
    // Generate GRN ID based on current timestamp
    const grnId = `GRN-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    // Use existing GRN vendor or first selected PO vendor
    const vendorName = existingGRN?.vendorName || mockVendors.find(v => v.id === selectedPOs[0]?.vendorId)?.name || '';
    const businessUnit = existingGRN?.businessUnit || selectedPOs[0]?.businessUnit || '';
    // Navigate to confirmation page with GRN details, always include vendor and BU
    const params = new URLSearchParams({
      grnId,
      vendorName,
      totalValue: grandTotal.toFixed(2),
      poNumbers: existingGRN?.linkedPOs.join(',') || selectedPOs.map(po => po.number).join(','),
      itemCount: grnItems.length.toString(),
      businessUnit,
      vendor: vendorName, // ensure vendor is always present
      bu: businessUnit    // ensure BU is always present
    });
    router.push(`/receiving/confirmation?${params.toString()}`);
  };

  // Group items by location for better organization
  const groupItemsByLocation = (items: GrnItem[]) => {
    const grouped = new Map<string, GrnItem[]>();
    items.forEach(item => {
      const location = hasStoreLocation(item) ? item.storeLocation : item.itemDetail?.storeLocation || 'Unknown Location';
      if (grouped.has(location)) {
        grouped.get(location)!.push(item);
      } else {
        grouped.set(location, [item]);
      }
    });
    return Array.from(grouped.entries()).map(([location, items]) => ({
      location,
      items,
      itemCount: items.length
    }));
  };

  const groupedItems = groupItemsByLocation(grnItems);

  function handleAddPO() {
    // Use values from grnFormData as primary source
    const businessUnit = grnFormData.businessUnit || existingGRN?.businessUnit || selectedPOs[0]?.businessUnit;
    const vendorId = grnFormData.vendorId || existingGRN?.vendorId || selectedPOs[0]?.vendorId;
    console.log('DEBUG Add PO:', {
      grnFormDataVendorId: grnFormData.vendorId,
      grnFormDataBusinessUnit: grnFormData.businessUnit,
      existingGRNVendorId: existingGRN?.vendorId,
      existingGRNBusinessUnit: existingGRN?.businessUnit,
      selectedPOVendorId: selectedPOs[0]?.vendorId,
      selectedPOBusinessUnit: selectedPOs[0]?.businessUnit
    });
    if (!businessUnit || businessUnit === 'No BU') {
      alert('Please select a Business Unit in the GRN header before adding a PO.');
      return;
    }
    if (!vendorId) {
      alert('Vendor not found.');
      return;
    }
    // Route to PO selection, pre-filtered for this BU and vendor
    router.push(`/receiving/new?addToGRN=true&skipVendorSelect=true&skipNewGRN=true&vendorId=${vendorId}&bu=${encodeURIComponent(businessUnit)}`);
  }

  return (
    <div className="p-4 pb-32 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => router.back()}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          {/* Only show GRN number and status in header for existing GRN, no title or vendor */}
          {existingGRN && (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold leading-tight">GRN {existingGRN.grnNumber}</span>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                  existingGRN.status === "Draft" ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" :
                  existingGRN.status === "Received" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300" :
                  "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                }`}>
                  {existingGRN.status}
                </span>
              </div>
            </div>
          )}
          {/* For create mode, show the title */}
          {!existingGRN && (
            <div>
              <h1 className="text-xl font-bold leading-tight">Create GRN</h1>
              <div className="flex items-center gap-2 mt-1">
                <input
                  className="border-none bg-transparent text-sm font-medium text-primary cursor-default"
                  value={grnFormData.businessUnit || "No BU"}
                  readOnly
                  tabIndex={-1}
                  aria-label="Business Unit"
                  style={{ pointerEvents: 'none', width: 'auto' }}
                />
              </div>
            </div>
          )}
        </div>
        {/* Edit/Delete buttons for existing GRN in Draft or Received state */}
        {existingGRN && (existingGRN.status === "Draft" || existingGRN.status === "Received") && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => {/* trigger edit mode logic here */}}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => {/* trigger delete logic here */}}>
              Delete
            </Button>
          </div>
        )}
      </div>
      
      {/* GRN Info - Simplified */}
      {existingGRN && (
        <Card className="p-3 bg-card text-card-foreground mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-muted-foreground">
              Created: {existingGRN.createdDate}
            </div>
          </div>
          {existingGRN.receivedDate && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Received:</span> {existingGRN.receivedDate}
            </div>
          )}
          {existingGRN.status === "Committed" && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Committed:</span> {existingGRN.commitDate || "Not set"}
            </div>
          )}
        </Card>
      )}
      
      {/* GRN Form Section */}
      <Card className="p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">GRN Information</h2>
        <div className="space-y-4">
          {/* Row 1: Vendor and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Vendor *
              </label>
              <select
                value={grnFormData.vendorId}
                onChange={(e) => handleFormChange('vendorId', e.target.value)}
                className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
                required
              >
                <option value="">Select vendor</option>
                {mockVendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name} ({vendor.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Date *
              </label>
              <input
                type="date"
                value={grnFormData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
                required
              />
            </div>
          </div>
          {/* Row 2: Ref# and Invoice# */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Ref#
              </label>
              <input
                type="text"
                value={grnFormData.refNumber}
                onChange={(e) => handleFormChange('refNumber', e.target.value)}
                placeholder="Auto-generated"
                className="w-full px-2 py-1.5 border border-input rounded-md bg-muted text-muted-foreground text-sm"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Invoice#
              </label>
              <input
                type="text"
                value={grnFormData.invoiceNumber}
                onChange={(e) => handleFormChange('invoiceNumber', e.target.value)}
                placeholder="Enter invoice number"
                className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
              />
            </div>
          </div>
          {/* Row 3: Invoice Date */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Invoice Date
            </label>
            <input
              type="date"
              value={grnFormData.invoiceDate}
              onChange={(e) => handleFormChange('invoiceDate', e.target.value)}
              className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
            />
          </div>
          {/* Row 4: Description */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              value={grnFormData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Enter details about this receiving entry"
              className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
              rows={2}
            />
          </div>
          {/* Row 5: Currency/Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Currency</label>
              <select
                value={grnFormData.currency}
                onChange={(e) => handleFormChange('currency', e.target.value)}
                className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
              >
                <option value="THB">THB</option>
                <option value="USD">USD</option>
                <option value="SGD">SGD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Rate</label>
              <input
                type="number"
                value={grnFormData.exchangeRate}
                onChange={(e) => handleFormChange('exchangeRate', parseFloat(e.target.value) || 1)}
                placeholder="1.00000"
                step="0.00001"
                min="0"
                className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* GRN Details Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">GRN Details</h2>
        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-t text-sm font-medium border-b-2 ${
              tab === 'items' 
                ? 'border-primary text-primary bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setTab('items')}
          >
            Items
          </button>
          <button
            className={`flex-1 py-2 rounded-t text-sm font-medium border-b-2 ${
              tab === 'summary' 
                ? 'border-primary text-primary bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setTab('summary')}
          >
            Summary
          </button>
          <button
            className={`flex-1 py-2 rounded-t text-sm font-medium border-b-2 ${
              tab === 'attachments' 
                ? 'border-primary text-primary bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setTab('attachments')}
          >
            Comments{comments.length > 0 && <span className="ml-1 bg-primary text-primary-foreground rounded-full px-2 text-xs">{comments.length}</span>}
          </button>
        </div>
        
        {/* Tab Content */}
        {tab === 'items' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Items by Location</div>
              <Button
                className="bg-primary text-white px-4 py-2 rounded-md"
                onClick={handleAddPO}
              >
                + Add PO
              </Button>
            </div>
            <div className="space-y-6">
              {groupedItems.map((group, groupIdx) => (
                <div key={group.location + groupIdx} className="space-y-3">
                  {/* Location Header */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-700">{group.location}</span>
                      </div>
                      <span className="text-sm text-blue-600">
                        {group.itemCount} item{group.itemCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* Items in this location */}
                  <div className="space-y-3">
                    {group.items.map((item, idx) => (
                      <Card key={item.sku + idx} className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium">{item.product}</h3>
                              <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                              <p className="text-sm text-muted-foreground">PO: {item.poNumber}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                onClick={() => handleDeleteItem(idx)}
                                aria-label="Delete item"
                                title="Delete item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button 
                                className="text-blue-600 text-sm hover:underline"
                                onClick={() => router.push(`/receiving/grn-detail/item/${item.sku}`)}
                              >
                                Detail &gt;
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Ordered:</span>
                              <div className="font-medium">{item.orderedQty} {item.orderUnit}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Remaining:</span>
                              <div className="font-medium">{item.remaining} {item.orderUnit}</div>
                            </div>
                          </div>
                          <div className="space-y-4 mt-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-sm text-muted-foreground">Received Qty</label>
                                <div className="flex items-center mt-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-r-none border-r-0"
                                    onClick={() => {
                                      const currentValue = parseFloat(item.receivedQty) || 0;
                                      handleQtyChange(idx, Math.max(0, currentValue - 1).toString());
                                    }}
                                    aria-label="Decrease received quantity"
                                  >
                                    -
                                  </Button>
                                  <input
                                    type="number"
                                    value={item.receivedQty}
                                    onChange={(e) => handleQtyChange(idx, e.target.value)}
                                    className="w-full h-9 px-2 py-1.5 border-t border-b border-input text-center text-sm focus:ring-0 focus:outline-none"
                                    placeholder="0"
                                    min="0"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-l-none border-l-0"
                                    onClick={() => {
                                      const currentValue = parseFloat(item.receivedQty) || 0;
                                      handleQtyChange(idx, (currentValue + 1).toString());
                                    }}
                                    aria-label="Increase received quantity"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm text-muted-foreground">Unit</label>
                                <select
                                  value={item.receivedUnit}
                                  onChange={(e) => handleReceivedUnitChange(idx, e.target.value)}
                                  className="w-full mt-1 h-9 px-2 py-1.5 border border-input rounded-md text-sm"
                                >
                                  <option value="case">Case</option>
                                  <option value="box">Box</option>
                                  <option value="piece">Piece</option>
                                  <option value="kg">Kilogram</option>
                                  <option value="liter">Liter</option>
                                </select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-sm text-muted-foreground">FOC Qty</label>
                                <div className="flex items-center mt-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-r-none border-r-0"
                                    onClick={() => {
                                      const currentValue = parseFloat(item.focQty) || 0;
                                      handleFocQtyChange(idx, Math.max(0, currentValue - 1).toString());
                                    }}
                                    aria-label="Decrease FOC quantity"
                                  >
                                    -
                                  </Button>
                                  <input
                                    type="number"
                                    value={item.focQty}
                                    onChange={(e) => handleFocQtyChange(idx, e.target.value)}
                                    className="w-full h-9 px-2 py-1.5 border-t border-b border-input text-center text-sm focus:ring-0 focus:outline-none"
                                    placeholder="0"
                                    min="0"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 rounded-l-none border-l-0"
                                    onClick={() => {
                                      const currentValue = parseFloat(item.focQty) || 0;
                                      handleFocQtyChange(idx, (currentValue + 1).toString());
                                    }}
                                    aria-label="Increase FOC quantity"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm text-muted-foreground">Unit</label>
                                <select
                                  value={item.focUnit}
                                  onChange={(e) => handleFocUnitChange(idx, e.target.value)}
                                  className="w-full mt-1 h-9 px-2 py-1.5 border border-input rounded-md text-sm"
                                >
                                  <option value="case">Case</option>
                                  <option value="box">Box</option>
                                  <option value="piece">Piece</option>
                                  <option value="kg">Kilogram</option>
                                  <option value="liter">Liter</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          {/* Item Comment */}
                          {(item.itemDetail?.comment || item.comment) && (
                            <div className="mt-3 p-3 bg-muted/50 dark:bg-muted/30 rounded-md border border-border">
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                <div className="flex-1">
                                  <div className="text-xs text-muted-foreground mb-1">Comment</div>
                                  <div className="text-sm text-foreground">{item.itemDetail?.comment || item.comment}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {tab === 'summary' && (
          <Card className="p-4 bg-card text-card-foreground">
            <div className="mt-6">
              <div className="font-medium mb-1">Financial Summary</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-border mt-2">
                  <thead>
                    <tr className="bg-muted text-muted-foreground">
                      <th className="p-2 text-left font-semibold">&nbsp;</th>
                      <th className="p-2 text-left font-semibold">Currency</th>
                      <th className="p-2 text-left font-semibold">Base</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="p-2">Subtotal</td>
                      <td className="p-2">{subtotal.toFixed(2)}</td>
                      <td className="p-2">{subtotalBase.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-2">Discount</td>
                      <td className="p-2">-{discount.toFixed(2)}</td>
                      <td className="p-2">-{discountBase.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-2">Net Amount</td>
                      <td className="p-2">{netAmount.toFixed(2)}</td>
                      <td className="p-2">{netAmountBase.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-2">Extra Cost</td>
                      <td className="p-2">{extraCost.toFixed(2)}</td>
                      <td className="p-2">{extraCostBase.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="p-2">Tax Amount</td>
                      <td className="p-2">{taxAmount.toFixed(2)}</td>
                      <td className="p-2">{taxAmountBase.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t border-border font-bold">
                      <td className="p-2">Grand Total</td>
                      <td className="p-2">{grandTotal.toFixed(2)}</td>
                      <td className="p-2">{grandTotalBase.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}
        

        {tab === 'attachments' && (
          <Card className="p-4 flex flex-col h-[400px] max-h-[60vh] bg-card text-card-foreground">
            <div className="font-semibold mb-2">Comments & Attachments</div>
            <CommentsWithAttachments
              comments={formattedComments}
              onAddComment={handleAddComment}
              emptyMessage="No comments yet. Add your first comment about this GRN."
            />
          </Card>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={handleSubmitGRN}
        >
          Save
        </Button>
      </div>
      
      {/* Modal components remain the same... */}
      {/* On Hand Modal */}
      {showOnHand && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg max-w-sm w-full max-h-[80vh] overflow-auto m-4 shadow-lg">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold">On Hand: {selectedItem.sku}</h3>
                <p className="text-xs text-muted-foreground">{selectedItem.product}</p>
              </div>
              <button onClick={() => setShowOnHand(false)} className="p-1 rounded-full hover:bg-muted transition-colors">
                <X size={18} className="text-foreground" />
              </button>
            </div>
            <div className="p-4">
              <div className="text-xs text-primary mb-2">
                BU: {existingGRN?.businessUnit || selectedPOs[0]?.businessUnit || 'Grand Hotel Singapore'}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">Location</th>
                    <th className="text-center py-2 font-medium">Qty Available</th>
                    <th className="text-center py-2 font-medium">Min</th>
                    <th className="text-center py-2 font-medium">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {onHandData[selectedItem.sku]?.map((row, index) => (
                    <tr key={index} className="border-b border-border last:border-b-0">
                      <td className="py-2">{row.location}</td>
                      <td className="py-2 text-center">{row.qtyAvailable}</td>
                      <td className="py-2 text-center">{row.min}</td>
                      <td className="py-2 text-center">{row.max}</td>
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
      )}
      
      {/* On Order Modal */}
      {showOnOrder && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg max-w-sm w-full max-h-[80vh] overflow-auto m-4 shadow-lg">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold">On Order: {selectedItem.sku}</h3>
                <p className="text-xs text-muted-foreground">{selectedItem.product}</p>
              </div>
              <button onClick={() => setShowOnOrder(false)} className="p-1 rounded-full hover:bg-muted transition-colors">
                <X size={18} className="text-foreground" />
              </button>
            </div>
            <div className="p-4">
              <div className="text-xs text-primary mb-2">
                BU: {existingGRN?.businessUnit || selectedPOs[0]?.businessUnit || 'Grand Hotel Singapore'}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">PO Number</th>
                    <th className="text-left py-2 font-medium">Vendor</th>
                    <th className="text-center py-2 font-medium">Qty</th>
                    <th className="text-right py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {onOrderData[selectedItem.sku]?.map((row, index) => (
                    <tr key={index} className="border-b border-border last:border-b-0">
                      <td className="py-2">{row.poNumber}</td>
                      <td className="py-2">{row.vendor}</td>
                      <td className="py-2 text-center">{row.orderedQty}</td>
                      <td className="py-2 text-right">{row.status}</td>
                    </tr>
                  ))}
                  {!onOrderData[selectedItem.sku]?.length && (
                    <tr>
                      <td colSpan={4} className="py-3 text-center text-muted-foreground">No on-order data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Price Compare Modal */}
      {showPriceCompare && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg max-w-sm w-full max-h-[80vh] overflow-auto m-4 shadow-lg">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="font-bold">Price Compare: {selectedItem.sku}</h3>
                <p className="text-xs text-muted-foreground">{selectedItem.product}</p>
              </div>
              <button onClick={() => setShowPriceCompare(false)} className="p-1 rounded-full hover:bg-muted transition-colors">
                <X size={18} className="text-foreground" />
              </button>
            </div>
            <div className="p-4">
              <div className="text-xs text-primary mb-2">
                BU: {existingGRN?.businessUnit || selectedPOs[0]?.businessUnit || 'Grand Hotel Singapore'}
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">Vendor</th>
                    <th className="text-center py-2 font-medium">Price</th>
                    <th className="text-center py-2 font-medium">Currency</th>
                    <th className="text-right py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {priceCompareData[selectedItem.sku]?.map((row, index) => (
                    <tr key={index} className="border-b border-border last:border-b-0">
                      <td className="py-2">{row.vendor}</td>
                      <td className="py-2 text-center">{row.price}</td>
                      <td className="py-2 text-center">{row.currency}</td>
                      <td className="py-2 text-right">{row.date}</td>
                    </tr>
                  ))}
                  {!priceCompareData[selectedItem.sku]?.length && (
                    <tr>
                      <td colSpan={4} className="py-3 text-center text-muted-foreground">No price comparison data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrnDetailPageWithSuspense() {
  return (
    <Suspense fallback={<div className="p-4">Loading GRN details...</div>}>
      <GrnDetailPage />
    </Suspense>
  );
}