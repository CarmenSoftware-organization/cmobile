"use client";

import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessUnitLabel } from "@/components/ui/business-unit-label";
import { ChevronLeft } from "lucide-react";
import React from "react";

// Vendors and PO mock data copied from main page for consistency
const vendors = [
  { id: 1, name: "Aqua Supplier" },
  { id: 2, name: "Juice Co." },
  { id: 3, name: "Coffee Traders" },
  { id: 4, name: "Fresh Farms" },
  { id: 5, name: "Bakery Bros" },
  { id: 6, name: "Dairy Direct" },
  { id: 7, name: "Meat Masters" },
  { id: 8, name: "Veggie Valley" },
  { id: 9, name: "Seafood Source" },
  { id: 10, name: "Spice World" },
];

interface POItem {
  product: string;
  sku: string;
  qty: number;
}
interface PO {
  id: number;
  number: string;
  description: string;
  items: POItem[];
  vendorId: number;
  eta: string;
  value: string;
  status: string;
  business_unit: string;
}

const pos: PO[] = [
  {
    id: 1,
    number: "PO-1001",
    description: "Bottled water for guest rooms and events.",
    items: [
      { product: "Mineral Water 500ml", sku: "SKU12345", qty: 10 },
      { product: "Sparkling Water 1L", sku: "SKU54321", qty: 5 }
    ],
    vendorId: 1,
    eta: "2024-06-01",
    value: "$120.00",
    status: "Open",
    business_unit: "Grand Hotel Singapore",
  },
  {
    id: 2,
    number: "PO-1002",
    description: "Fresh orange juice for breakfast buffet.",
    items: [
      { product: "Orange Juice 1L", sku: "SKU67890", qty: 8 }
    ],
    vendorId: 2,
    eta: "2024-06-02",
    value: "$80.00",
    status: "Closed",
    business_unit: "Business Hotel Jakarta",
  },
  {
    id: 3,
    number: "PO-1003",
    description: "Coffee supplies for lobby cafe.",
    items: [
      { product: "Espresso Beans", sku: "SKU11111", qty: 3 },
      { product: "Coffee Filters", sku: "SKU22222", qty: 2 },
      { product: "Milk", sku: "SKU33333", qty: 6 }
    ],
    vendorId: 3,
    eta: "2024-06-03",
    value: "$60.00",
    status: "Partial",
    business_unit: "Boutique Hotel Bangkok",
  },
  {
    id: 4,
    number: "PO-1004",
    description: "Fresh vegetables for kitchen stock.",
    items: [
      { product: "Lettuce", sku: "SKU44444", qty: 20 },
      { product: "Tomatoes", sku: "SKU55555", qty: 15 }
    ],
    vendorId: 4,
    eta: "2024-06-04",
    value: "$90.00",
    status: "Open",
    business_unit: "Grand Hotel Singapore",
  },
  {
    id: 5,
    number: "PO-1005",
    description: "Bakery bread for daily restaurant service.",
    items: [
      { product: "Whole Wheat Bread", sku: "SKU66666", qty: 12 }
    ],
    vendorId: 5,
    eta: "2024-06-05",
    value: "$45.00",
    status: "Closed",
    business_unit: "Business Hotel Jakarta",
  },
  {
    id: 6,
    number: "PO-1006",
    description: "Dairy products for breakfast and desserts.",
    items: [
      { product: "Cheddar Cheese", sku: "SKU77777", qty: 7 },
      { product: "Yogurt", sku: "SKU88888", qty: 10 }
    ],
    vendorId: 6,
    eta: "2024-06-06",
    value: "$110.00",
    status: "Partial",
    business_unit: "Boutique Hotel Bangkok",
  },
  {
    id: 7,
    number: "PO-1007",
    description: "Chicken for banquet event.",
    items: [
      { product: "Chicken Breast", sku: "SKU99999", qty: 25 }
    ],
    vendorId: 7,
    eta: "2024-06-07",
    value: "$200.00",
    status: "Open",
    business_unit: "Grand Hotel Singapore",
  },
  {
    id: 8,
    number: "PO-1008",
    description: "Vegetables for salad bar.",
    items: [
      { product: "Carrots", sku: "SKU10101", qty: 30 },
      { product: "Broccoli", sku: "SKU20202", qty: 18 }
    ],
    vendorId: 8,
    eta: "2024-06-08",
    value: "$70.00",
    status: "Closed",
    business_unit: "Business Hotel Jakarta",
  },
  {
    id: 9,
    number: "PO-1009",
    description: "Seafood for Friday dinner special.",
    items: [
      { product: "Salmon Fillet", sku: "SKU30303", qty: 10 }
    ],
    vendorId: 9,
    eta: "2024-06-09",
    value: "$250.00",
    status: "Partial",
    business_unit: "Boutique Hotel Bangkok",
  },
  {
    id: 10,
    number: "PO-1010",
    description: "Spices for kitchen restock.",
    items: [
      { product: "Black Pepper", sku: "SKU40404", qty: 5 },
      { product: "Cumin", sku: "SKU50505", qty: 3 }
    ],
    vendorId: 10,
    eta: "2024-06-10",
    value: "$35.00",
    status: "Open",
    business_unit: "Grand Hotel Singapore",
  },
  {
    id: 11,
    number: "PO-1011",
    description: "Butter for baking and cooking.",
    items: [
      { product: "Butter", sku: "SKU60606", qty: 8 }
    ],
    vendorId: 6,
    eta: "2024-06-11",
    value: "$55.00",
    status: "Closed",
    business_unit: "Business Hotel Jakarta",
  },
  {
    id: 12,
    number: "PO-1012",
    description: "Pork for weekend BBQ.",
    items: [
      { product: "Pork Chops", sku: "SKU70707", qty: 14 }
    ],
    vendorId: 7,
    eta: "2024-06-12",
    value: "$180.00",
    status: "Partial",
    business_unit: "Boutique Hotel Bangkok",
  },
  {
    id: 13,
    number: "PO-1013",
    description: "Spinach for omelets and salads.",
    items: [
      { product: "Spinach", sku: "SKU80808", qty: 22 }
    ],
    vendorId: 8,
    eta: "2024-06-13",
    value: "$60.00",
    status: "Open",
    business_unit: "Grand Hotel Singapore",
  },
  {
    id: 14,
    number: "PO-1014",
    description: "Shrimp for seafood pasta.",
    items: [
      { product: "Shrimp", sku: "SKU90909", qty: 16 }
    ],
    vendorId: 9,
    eta: "2024-06-14",
    value: "$210.00",
    status: "Closed",
    business_unit: "Business Hotel Jakarta",
  },
  {
    id: 15,
    number: "PO-1015",
    description: "Cinnamon and nutmeg for bakery.",
    items: [
      { product: "Cinnamon", sku: "SKU01010", qty: 4 },
      { product: "Nutmeg", sku: "SKU11112", qty: 2 }
    ],
    vendorId: 10,
    eta: "2024-06-15",
    value: "$40.00",
    status: "Partial",
    business_unit: "Boutique Hotel Bangkok",
  },
];

export default function PoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const poId = Number(params.poId);
  const po = pos.find(p => p.id === poId);
  if (!po) {
    return (
      <div className="p-4 ">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" /> Back
        </Button>
        <div className="mt-8 text-center text-muted-foreground">PO not found.</div>
      </div>
    );
  }
  const vendor = vendors.find(v => v.id === po.vendorId);
  return (
    <div className="p-4 pb-32 max-w-lg mx-auto">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ChevronLeft className="w-5 h-5" /> Back
      </Button>
      <h1 className="text-xl font-bold mt-2 mb-1">PO {po.number}</h1>
      <div className="text-sm text-muted-foreground mb-2">{po.description}</div>
      <div className="flex items-center gap-2 mb-2">
        <BusinessUnitLabel assignedBusinessUnits={[{ id: 1, name: po.business_unit }]} />
        <span className={`rounded px-2 py-0.5 text-xs font-medium
          ${po.status === "Open" ? "bg-blue-100 text-blue-800"
            : po.status === "Partial" ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"}`}>{po.status}</span>
      </div>
      <div className="mb-2 text-sm">
        <span className="font-medium">ETA:</span> {po.eta} <br />
        <span className="font-medium">Value:</span> {po.value} <br />
        <span className="font-medium">Vendor:</span> {vendor ? vendor.name : "-"}
      </div>
      <Card className="p-4 mt-4">
        <div className="font-semibold mb-2">Items</div>
        <div className="divide-y">
          {po.items.map((item: POItem) => (
            <div key={item.sku} className="py-2 flex flex-col gap-1">
              <div className="font-medium">{item.product}</div>
              <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
              <div className="text-xs">Qty: {item.qty}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 