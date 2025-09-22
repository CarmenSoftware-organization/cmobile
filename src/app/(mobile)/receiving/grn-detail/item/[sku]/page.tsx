"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Info, Package, Tag, Layers, DollarSign, ClipboardList, ArrowLeft } from "lucide-react";
import React from "react";

const statusColors: Record<string, string> = {
  Received: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  InTransit: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  Partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  Draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  Committed: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  Void: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

interface GrnItem {
  sku: string;
  product: string;
  storeLocation: string;
  itemDescription: string;
  orderedQty: number;
  received: number;
  foc: number;
  price: number;
  extraCost: number;
  totalAmount: number;
  status: string;
  expiryDate: string;
  department: string;
  accountCode: string;
  receivedQty: number;
  conversionRate: number;
  baseQty: number;
  discount: number;
  taxType: string;
  taxName: string;
  taxRate: number;
  onHand: number;
  onOrder: number;
  reorderThreshold: number;
  restockLevel: number;
  poRef: string;
  lastPrice: number;
  lastVendor: string;
  comment: string;
  inventoryUnit: string;
  jobCode?: string;
  event?: string;
  marketSegment?: string;
  itemDetail?: {
    jobCode?: string;
    event?: string;
    marketSegment?: string;
  };
}

const mockItems: GrnItem[] = [
  {
    sku: "SKU12345",
    product: "Mineral Water 500ml",
    storeLocation: "Main Store",
    itemDescription: "Mineral Water 500ml (24 bottles/case)",
    orderedQty: 10,
    received: 10,
    foc: 0,
    price: 12.0,
    extraCost: 1.0,
    totalAmount: 121.0,
    status: "Received",
    expiryDate: "2025-01-01",
    department: "F&B",
    accountCode: "AC-1001",
    receivedQty: 10,
    conversionRate: 1.0,
    baseQty: 10,
    discount: 0,
    taxType: "Add",
    taxName: "VAT",
    taxRate: 7,
    onHand: 50,
    onOrder: 20,
    reorderThreshold: 10,
    restockLevel: 60,
    poRef: "PO-1001",
    lastPrice: 12.0,
    lastVendor: "Aqua Supplier",
    comment: "Urgent delivery for event.",
    inventoryUnit: "case",
    jobCode: "JC-2025-001",
    event: "Annual Gala Dinner",
    marketSegment: "F&B",
    itemDetail: {
      jobCode: "JC-2025-001",
      event: "Annual Gala Dinner",
      marketSegment: "F&B"
    }
  },
  // ... add more mock items as needed
];

export default function GrnItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sku = params.sku as string;
  const item = mockItems.find(i => i.sku === sku);

  if (!item) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="mt-8 text-center text-muted-foreground">Item not found.</div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-32 max-w-lg mx-auto min-h-screen bg-background">
      {/* Sticky Back Button */}
      <div className="sticky top-0 z-20 bg-background p-4 flex items-center shadow-sm">
        <Button variant="outline" size="sm" onClick={() => router.back()} aria-label="Back to previous page" className="rounded-full px-4 py-2 text-base font-semibold">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>
      </div>
      {/* Product Header */}
      <div className="bg-card text-card-foreground rounded-xl shadow-md p-4 pt-2 mb-6 mt-2 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-bold leading-tight">{item.product}</span>
          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${statusColors[item.status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}`}>{item.status}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Tag className="w-4 h-4" /> SKU: {item.sku}
        </div>
      </div>
      {/* Basic Info */}
      <section className="bg-card text-card-foreground rounded-lg shadow p-4 mb-5">
        <div className="font-semibold mb-2 flex items-center gap-2 text-base"><Info className="w-4 h-4" /> Basic Info</div>
        <div className="space-y-1 text-sm">
          <div><span className="font-medium">Store Location:</span> {item.storeLocation}</div>
          <div><span className="font-medium">Item Description:</span> {item.itemDescription}</div>
          <div><span className="font-medium">Department:</span> {item.department}</div>
          <div><span className="font-medium">Account Code:</span> {item.accountCode}</div>
          <div><span className="font-medium">Expiry Date:</span> {item.expiryDate}</div>
        </div>
      </section>
      {/* Business Dimensions */}
      <section className="bg-card text-card-foreground rounded-lg shadow p-4 mb-5">
        <div className="font-semibold mb-2 flex items-center gap-2 text-base"><Tag className="w-4 h-4" /> Business Dimensions</div>
        <div className="space-y-1 text-sm">
          <div><span className="font-medium">Job Code:</span> {item.jobCode || item.itemDetail?.jobCode || '-'}</div>
          <div><span className="font-medium">Event:</span> {item.event || item.itemDetail?.event || '-'}</div>
          <div><span className="font-medium">Market Segment:</span> {item.marketSegment || item.itemDetail?.marketSegment || '-'}</div>
        </div>
      </section>
      {/* Quantities */}
      <section className="bg-card text-card-foreground rounded-lg shadow p-4 mb-5">
        <div className="font-semibold mb-2 flex items-center gap-2 text-base"><Package className="w-4 h-4" /> Quantities</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="font-medium">Ordered Qty:</span> {item.orderedQty} {item.inventoryUnit}</div>
          <div><span className="font-medium">Received Qty:</span> {item.receivedQty} {item.inventoryUnit}</div>
          <div><span className="font-medium">FOC Qty:</span> {item.foc} {item.inventoryUnit}</div>
          <div><span className="font-medium">Inventory Qty:</span> {item.baseQty} {item.inventoryUnit}</div>
          <div><span className="font-medium">Conversion Rate:</span> {item.conversionRate}</div>
        </div>
      </section>
      {/* Financials */}
      <section className="bg-card text-card-foreground rounded-lg shadow p-4 mb-5">
        <div className="font-semibold mb-2 flex items-center gap-2 text-base"><DollarSign className="w-4 h-4" /> Financials</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="font-medium">Price:</span> {item.price.toFixed(2)}</div>
          <div><span className="font-medium">Extra Cost:</span> {item.extraCost.toFixed(2)}</div>
          <div><span className="font-medium">Discount:</span> {item.discount}</div>
          <div><span className="font-medium">Tax:</span> {item.taxName ? `${item.taxName} (${item.taxType})` : item.taxType}</div>
          <div><span className="font-medium">Tax Rate:</span> {item.taxRate}%</div>
          <div><span className="font-medium">Total Amount:</span> {item.totalAmount.toFixed(2)}</div>
        </div>
      </section>
      {/* Inventory */}
      <section className="bg-card text-card-foreground rounded-lg shadow p-4 mb-5">
        <div className="font-semibold mb-2 flex items-center gap-2 text-base"><Layers className="w-4 h-4" /> Inventory</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="font-medium">On Hand:</span> {item.onHand}</div>
          <div><span className="font-medium">On Order:</span> {item.onOrder}</div>
          <div><span className="font-medium">Reorder Threshold:</span> {item.reorderThreshold}</div>
          <div><span className="font-medium">Restock Level:</span> {item.restockLevel}</div>
        </div>
      </section>
      {/* Purchase Info */}
      <section className="bg-card text-card-foreground rounded-lg shadow p-4 mb-32">
        <div className="font-semibold mb-2 flex items-center gap-2 text-base"><ClipboardList className="w-4 h-4" /> Purchase Info</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div><span className="font-medium">PO Ref#:</span> {item.poRef}</div>
          <div><span className="font-medium">Last Price:</span> {item.lastPrice.toFixed(2)}</div>
          <div><span className="font-medium">Last Vendor:</span> {item.lastVendor}</div>
        </div>
      </section>
      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full max-w-lg mx-auto z-30 bg-background border-t border-border p-4 flex gap-2 justify-end shadow-lg">
        <Button variant="outline" size="sm">Report Issue</Button>
        <Button variant="default" size="sm">Done</Button>
      </div>
    </div>
  );
} 