export interface GRNItem {
  product: string;
  sku: string;
  orderedQty: number;
  receivedQty: number;
  focQty: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  poNumber: string;
  expiryDate?: string;
  batchNumber?: string;
  storeLocation: string;
  itemDescription: string;
  department: string;
  accountCode: string;
  conversionRate: number;
  baseQty: number;
  baseUnit: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  taxType: 'included' | 'added' | 'exempt';
  taxRate: number;
  onHand: number;
  onOrder: number;
  reorderThreshold: number;
  restockLevel: number;
  lastPrice: number;
  lastVendor: string;
  comment?: string;
  inventoryUnit: string;
  category: string;
  subcategory?: string;
  brand?: string;
  supplier: string;
  leadTime: number;
  shelfLife?: number;
  storageCondition?: string;
  qualityGrade?: string;
  countryOfOrigin?: string;
  allergenInfo?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  packagingType: string;
  packagingSize: string;
  casesPerPallet?: number;
  unitsPerCase?: number;
  weight?: number;
  volume?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'mm' | 'inch';
  };
  certifications?: string[];
  sustainabilityRating?: 'A' | 'B' | 'C' | 'D' | 'E';
  locallySourced: boolean;
}

export interface GRNSummary {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  extraCostAmount: number;
  totalAmount: number;
  currency: string;
  exchangeRate?: number;
  baseCurrencyTotal?: number;
}

export interface GRNSignature {
  receiverName: string;
  receiverSignature: string;
  receivedDate: string;
  receivedTime: string;
  designation?: string;
  department?: string;
}

export interface GRNExtraCost {
  id: string;
  description: string;
  amount: number;
  currency: string;
  distributionMethod: 'qty' | 'value';
}

export interface GRNComment {
  id: number;
  sender: string;
  timestamp: string;
  text: string;
  attachments?: {
    id: string;
    name: string;
    type: 'file' | 'photo';
    url?: string;
    size?: number;
  }[];
}

export interface MockGRN {
  id: string;
  grnNumber: string;
  status: 'Draft' | 'Received' | 'Committed' | 'Void';
  vendorId: number;
  vendorName: string;
  vendorCode: string;
  createdDate: string;
  receivedDate?: string;
  commitDate?: string;
  dueDate?: string;
  linkedPOs: string[];
  businessUnit: string;
  createdBy: string;
  approvedBy?: string;
  totalValue: string;
  currency: string;
  itemCount: number;
  items: GRNItem[];
  summary: GRNSummary;
  signature?: GRNSignature;
  extraCosts: GRNExtraCost[];
  comments: GRNComment[];
  notes?: string;
  deliveryNote?: string;
  invoiceNumber?: string;
  receiptLocation: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

// Mock Vendors
export const mockVendors = [
  { id: 1, name: "Aqua Supplier", code: "AQS001", contact: "+65 6123 4567" },
  { id: 2, name: "Juice Co.", code: "JCO002", contact: "+62 21 987 6543" },
  { id: 3, name: "Coffee Traders", code: "CTR003", contact: "+66 2 555 0123" },
  { id: 4, name: "Fresh Farms", code: "FFM004", contact: "+65 6789 0123" },
  { id: 5, name: "Bakery Bros", code: "BBR005", contact: "+62 21 456 7890" },
  { id: 6, name: "Dairy Direct", code: "DDR006", contact: "+66 2 333 4444" },
  { id: 7, name: "Meat Masters", code: "MTM007", contact: "+65 6555 7777" },
  { id: 8, name: "Veggie Valley", code: "VVL008", contact: "+62 21 888 9999" },
  { id: 9, name: "Seafood Source", code: "SFS009", contact: "+66 2 111 2222" },
  { id: 10, name: "Spice World", code: "SPW010", contact: "+65 6444 5555" },
];

// Mock GRN Data
export const mockGRNs: MockGRN[] = [
  {
    id: "GRN-2024-001",
    grnNumber: "GRN-2024-001",
    status: "Draft",
    vendorId: 1,
    vendorName: "Aqua Supplier",
    vendorCode: "AQS001",
    createdDate: "2024-06-01",
    dueDate: "2024-06-05",
    linkedPOs: ["PO-1001"],
    businessUnit: "Grand Hotel Singapore",
    createdBy: "John Smith",
    totalValue: "$121.00",
    currency: "SGD",
    itemCount: 2,
    receiptLocation: "Main Warehouse",
    priority: "Medium",
    items: [
      {
        product: "Mineral Water 500ml",
        sku: "SKU12345",
        orderedQty: 10,
        receivedQty: 10,
        focQty: 0,
        unit: "case",
        unitPrice: 12.0,
        totalAmount: 120.0,
        poNumber: "PO-1001",
        expiryDate: "2025-01-01",
        batchNumber: "BT240601001",
        storeLocation: "Main Warehouse",
        itemDescription: "Mineral Water 500ml",
        department: "F&B Operations",
        accountCode: "AQS001",
        conversionRate: 1.0,
        baseQty: 10,
        baseUnit: "case",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 10,
        onOrder: 0,
        reorderThreshold: 10,
        restockLevel: 10,
        lastPrice: 12.0,
        lastVendor: "Aqua Supplier",
        comment: "Initial GRN created, awaiting delivery.",
        inventoryUnit: "case",
        category: "Beverages",
        subcategory: "Water",
        brand: "Aqua",
        supplier: "Aqua Supplier",
        leadTime: 0,
        shelfLife: 365,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Singapore",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        packagingType: "Plastic",
        packagingSize: "500ml",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      },
      {
        product: "Sparkling Water 1L",
        sku: "SKU54321",
        orderedQty: 5,
        receivedQty: 5,
        focQty: 1,
        unit: "box",
        unitPrice: 15.0,
        totalAmount: 75.0,
        poNumber: "PO-1001",
        expiryDate: "2025-02-01",
        batchNumber: "BT240601002",
        storeLocation: "Main Warehouse",
        itemDescription: "Sparkling Water 1L",
        department: "F&B Operations",
        accountCode: "AQS001",
        conversionRate: 1.0,
        baseQty: 5,
        baseUnit: "box",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 5,
        onOrder: 0,
        reorderThreshold: 5,
        restockLevel: 5,
        lastPrice: 15.0,
        lastVendor: "Aqua Supplier",
        comment: "Initial GRN created, awaiting delivery.",
        inventoryUnit: "box",
        category: "Beverages",
        subcategory: "Water",
        brand: "Aqua",
        supplier: "Aqua Supplier",
        leadTime: 0,
        shelfLife: 365,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Singapore",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        packagingType: "Plastic",
        packagingSize: "1L",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 1,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      }
    ],
    summary: {
      subtotal: 195.0,
      taxAmount: 13.65,
      discountAmount: 9.75,
      extraCostAmount: 5.0,
      totalAmount: 203.9,
      currency: "SGD",
      exchangeRate: 1.0,
      baseCurrencyTotal: 203.9
    },
    extraCosts: [
      {
        id: "EC001",
        description: "Delivery Charges",
        amount: 5.0,
        currency: "SGD",
        distributionMethod: "qty"
      }
    ],
    comments: [
      {
        id: 1,
        sender: "John Smith",
        timestamp: "2024-06-01 09:30",
        text: "Initial GRN created, awaiting delivery.",
        attachments: []
      }
    ],
    notes: "Handle with care - fragile items",
    deliveryNote: "DN-240601-001"
  },
  {
    id: "GRN-2024-002",
    grnNumber: "GRN-2024-002",
    status: "Committed",
    vendorId: 2,
    vendorName: "Juice Co.",
    vendorCode: "JCO002",
    createdDate: "2024-06-02",
    receivedDate: "2024-06-02",
    commitDate: "2024-06-02",
    linkedPOs: ["PO-1002"],
    businessUnit: "Business Hotel Jakarta",
    createdBy: "Sarah Lee",
    approvedBy: "Manager Jake",
    totalValue: "$80.00",
    currency: "IDR",
    itemCount: 1,
    receiptLocation: "Kitchen Store",
    priority: "High",
    items: [
      {
        product: "Orange Juice 1L",
        sku: "SKU67890",
        orderedQty: 8,
        receivedQty: 8,
        focQty: 0,
        unit: "bottle",
        unitPrice: 10.0,
        totalAmount: 80.0,
        poNumber: "PO-1002",
        expiryDate: "2024-12-01",
        batchNumber: "BT240602001",
        storeLocation: "Kitchen Store",
        itemDescription: "Orange Juice 1L",
        department: "F&B Operations",
        accountCode: "JCO002",
        conversionRate: 15000,
        baseQty: 8,
        baseUnit: "bottle",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 8,
        onOrder: 0,
        reorderThreshold: 8,
        restockLevel: 8,
        lastPrice: 10.0,
        lastVendor: "Juice Co.",
        comment: "Quality checked - all items in good condition",
        inventoryUnit: "bottle",
        category: "Beverages",
        subcategory: "Juice",
        brand: "Juice Co.",
        supplier: "Juice Co.",
        leadTime: 0,
        shelfLife: 365,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Indonesia",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 100,
          protein: 1,
          carbs: 10,
          fat: 0.5
        },
        packagingType: "Plastic",
        packagingSize: "1L",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 1,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      }
    ],
    summary: {
      subtotal: 80.0,
      taxAmount: 0.0,
      discountAmount: 0.0,
      extraCostAmount: 0.0,
      totalAmount: 80.0,
      currency: "IDR",
      exchangeRate: 15000,
      baseCurrencyTotal: 1200000
    },
    signature: {
      receiverName: "Sarah Lee",
      receiverSignature: "[Digital Signature - Sarah Lee]",
      receivedDate: "2024-06-02",
      receivedTime: "14:30",
      designation: "Procurement Officer",
      department: "F&B Operations"
    },
    extraCosts: [],
    comments: [
      {
        id: 1,
        sender: "Sarah Lee",
        timestamp: "2024-06-02 14:25",
        text: "Quality checked - all items in good condition",
        attachments: []
      },
      {
        id: 2,
        sender: "Manager Jake",
        timestamp: "2024-06-02 15:00",
        text: "Approved and committed to inventory",
        attachments: []
      }
    ],
    invoiceNumber: "INV-JCO-240602-001"
  },
  {
    id: "GRN-2024-003",
    grnNumber: "GRN-2024-003",
    status: "Committed",
    vendorId: 3,
    vendorName: "Coffee Traders",
    vendorCode: "CTR003",
    createdDate: "2024-06-03",
    receivedDate: "2024-06-03",
    commitDate: "2024-06-04",
    dueDate: "2024-06-07",
    linkedPOs: ["PO-1003"],
    businessUnit: "Boutique Hotel Bangkok",
    createdBy: "Mike Johnson",
    approvedBy: "Chef Maria",
    totalValue: "$60.00",
    currency: "THB",
    itemCount: 3,
    receiptLocation: "Cafe Storage",
    priority: "Medium",
    items: [
      {
        product: "Espresso Beans",
        sku: "SKU11111",
        orderedQty: 3,
        receivedQty: 3,
        focQty: 0,
        unit: "kg",
        unitPrice: 25.0,
        totalAmount: 75.0,
        poNumber: "PO-1003",
        expiryDate: "2025-06-01",
        batchNumber: "BT240603001",
        storeLocation: "Cafe Storage",
        itemDescription: "Espresso Beans",
        department: "F&B Operations",
        accountCode: "CTR003",
        conversionRate: 35,
        baseQty: 3,
        baseUnit: "kg",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 3,
        onOrder: 0,
        reorderThreshold: 3,
        restockLevel: 3,
        lastPrice: 25.0,
        lastVendor: "Coffee Traders",
        comment: "Received coffee supplies. Quality looks excellent.",
        inventoryUnit: "kg",
        category: "Coffee",
        subcategory: "Beans",
        brand: "Coffee Traders",
        supplier: "Coffee Traders",
        leadTime: 0,
        shelfLife: 365,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Thailand",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 200,
          protein: 10,
          carbs: 20,
          fat: 5
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      },
      {
        product: "Coffee Filters",
        sku: "SKU22222",
        orderedQty: 2,
        receivedQty: 2,
        focQty: 0,
        unit: "box",
        unitPrice: 8.0,
        totalAmount: 16.0,
        poNumber: "PO-1003",
        batchNumber: "BT240603002",
        storeLocation: "Cafe Storage",
        itemDescription: "Coffee Filters",
        department: "F&B Operations",
        accountCode: "CTR003",
        conversionRate: 35,
        baseQty: 2,
        baseUnit: "box",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 2,
        onOrder: 0,
        reorderThreshold: 2,
        restockLevel: 2,
        lastPrice: 8.0,
        lastVendor: "Coffee Traders",
        comment: "Received coffee supplies. Quality looks excellent.",
        inventoryUnit: "box",
        category: "Coffee",
        subcategory: "Filters",
        brand: "Coffee Traders",
        supplier: "Coffee Traders",
        leadTime: 0,
        shelfLife: 365,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Thailand",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      },
      {
        product: "Milk",
        sku: "SKU33333",
        orderedQty: 6,
        receivedQty: 6,
        focQty: 0,
        unit: "bottle",
        unitPrice: 3.5,
        totalAmount: 21.0,
        poNumber: "PO-1003",
        expiryDate: "2024-06-10",
        batchNumber: "BT240603003",
        storeLocation: "Cafe Storage",
        itemDescription: "Milk",
        department: "F&B Operations",
        accountCode: "CTR003",
        conversionRate: 35,
        baseQty: 6,
        baseUnit: "bottle",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 6,
        onOrder: 0,
        reorderThreshold: 6,
        restockLevel: 6,
        lastPrice: 3.5,
        lastVendor: "Coffee Traders",
        comment: "Received coffee supplies. Quality looks excellent.",
        inventoryUnit: "bottle",
        category: "Dairy",
        subcategory: "Milk",
        brand: "Coffee Traders",
        supplier: "Coffee Traders",
        leadTime: 0,
        shelfLife: 30,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Thailand",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 150,
          protein: 8,
          carbs: 5,
          fat: 3
        },
        packagingType: "Plastic",
        packagingSize: "1L",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 1,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      }
    ],
    summary: {
      subtotal: 112.0,
      taxAmount: 7.84,
      discountAmount: 5.6,
      extraCostAmount: 8.0,
      totalAmount: 122.24,
      currency: "THB",
      exchangeRate: 35,
      baseCurrencyTotal: 4278.4
    },
    signature: {
      receiverName: "Mike Johnson",
      receiverSignature: "[Digital Signature - Mike Johnson]",
      receivedDate: "2024-06-03",
      receivedTime: "11:15",
      designation: "Cafe Manager",
      department: "F&B Operations"
    },
    extraCosts: [
      {
        id: "EC002",
        description: "Import Duties",
        amount: 8.0,
        currency: "THB",
        distributionMethod: "value"
      }
    ],
    comments: [
      {
        id: 1,
        sender: "Mike Johnson",
        timestamp: "2024-06-03 11:00",
        text: "Received coffee supplies. Quality looks excellent.",
        attachments: [
          {
            id: "att001",
            name: "quality_check.jpg",
            type: "photo",
            size: 245760
          }
        ]
      },
      {
        id: 2,
        sender: "Chef Maria",
        timestamp: "2024-06-04 09:15",
        text: "Quality verified and approved. Items committed to inventory for cafe operations.",
        attachments: []
      }
    ],
    notes: "Premium coffee beans - store in cool, dry place",
    deliveryNote: "DN-240603-001",
    invoiceNumber: "INV-CTR-240603-001"
  },
  {
    id: "GRN-2024-004",
    grnNumber: "GRN-2024-004",
    status: "Void",
    vendorId: 4,
    vendorName: "Fresh Farms",
    vendorCode: "FFM004",
    createdDate: "2024-06-04",
    linkedPOs: ["PO-1004"],
    businessUnit: "Grand Hotel Singapore",
    createdBy: "Lisa Wong",
    totalValue: "$0.00",
    currency: "SGD",
    itemCount: 2,
    receiptLocation: "Main Kitchen",
    priority: "High",
    items: [
      {
        product: "Lettuce",
        sku: "SKU44444",
        orderedQty: 20,
        receivedQty: 0,
        focQty: 0,
        unit: "kg",
        unitPrice: 2.5,
        totalAmount: 0.0,
        poNumber: "PO-1004",
        storeLocation: "Main Kitchen",
        itemDescription: "Lettuce",
        department: "Kitchen Operations",
        accountCode: "FFM004",
        conversionRate: 1.0,
        baseQty: 20,
        baseUnit: "kg",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 0,
        onOrder: 0,
        reorderThreshold: 20,
        restockLevel: 20,
        lastPrice: 2.5,
        lastVendor: "Fresh Farms",
        comment: "Delivery cancelled due to quality issues. Voiding GRN.",
        inventoryUnit: "kg",
        category: "Produce",
        subcategory: "Leafy Greens",
        brand: "Fresh Farms",
        supplier: "Fresh Farms",
        leadTime: 0,
        shelfLife: 7,
        storageCondition: "Cool, dry",
        qualityGrade: "B",
        countryOfOrigin: "Singapore",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 15,
          protein: 1,
          carbs: 2,
          fat: 0.2
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "B",
        locallySourced: true
      },
      {
        product: "Tomatoes",
        sku: "SKU55555",
        orderedQty: 15,
        receivedQty: 0,
        focQty: 0,
        unit: "kg",
        unitPrice: 3.0,
        totalAmount: 0.0,
        poNumber: "PO-1004",
        storeLocation: "Main Kitchen",
        itemDescription: "Tomatoes",
        department: "Kitchen Operations",
        accountCode: "FFM004",
        conversionRate: 1.0,
        baseQty: 15,
        baseUnit: "kg",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 0,
        onOrder: 0,
        reorderThreshold: 15,
        restockLevel: 15,
        lastPrice: 3.0,
        lastVendor: "Fresh Farms",
        comment: "Delivery cancelled due to quality issues. Voiding GRN.",
        inventoryUnit: "kg",
        category: "Produce",
        subcategory: "Tomatoes",
        brand: "Fresh Farms",
        supplier: "Fresh Farms",
        leadTime: 0,
        shelfLife: 7,
        storageCondition: "Cool, dry",
        qualityGrade: "B",
        countryOfOrigin: "Singapore",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 20,
          protein: 1,
          carbs: 4,
          fat: 0.3
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "B",
        locallySourced: true
      }
    ],
    summary: {
      subtotal: 0.0,
      taxAmount: 0.0,
      discountAmount: 0.0,
      extraCostAmount: 0.0,
      totalAmount: 0.0,
      currency: "SGD",
      exchangeRate: 1.0,
      baseCurrencyTotal: 0.0
    },
    extraCosts: [],
    comments: [
      {
        id: 1,
        sender: "Lisa Wong",
        timestamp: "2024-06-04 08:00",
        text: "Delivery cancelled due to quality issues. Voiding GRN.",
        attachments: []
      },
      {
        id: 2,
        sender: "Manager Kim",
        timestamp: "2024-06-04 08:30",
        text: "Confirmed - vegetables did not meet quality standards. Supplier will replace.",
        attachments: []
      }
    ],
    notes: "VOIDED - Quality issues with fresh produce"
  },
  {
    id: "GRN-2024-005",
    grnNumber: "GRN-2024-005",
    status: "Received",
    vendorId: 5,
    vendorName: "Bakery Bros",
    vendorCode: "BBR005",
    createdDate: "2024-06-05",
    receivedDate: "2024-06-06",
    dueDate: "2024-06-09",
    linkedPOs: ["PO-1005"],
    businessUnit: "Business Hotel Jakarta",
    createdBy: "David Chen",
    totalValue: "$45.00",
    currency: "IDR",
    itemCount: 1,
    receiptLocation: "Bakery Section",
    priority: "Low",
    items: [
      {
        product: "Whole Wheat Bread",
        sku: "SKU66666",
        orderedQty: 12,
        receivedQty: 12,
        focQty: 0,
        unit: "piece",
        unitPrice: 3.75,
        totalAmount: 45.0,
        poNumber: "PO-1005",
        storeLocation: "Bakery Section",
        itemDescription: "Whole Wheat Bread",
        department: "F&B Operations",
        accountCode: "BBR005",
        conversionRate: 15000,
        baseQty: 12,
        baseUnit: "piece",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 12,
        onOrder: 0,
        reorderThreshold: 12,
        restockLevel: 12,
        lastPrice: 3.75,
        lastVendor: "Bakery Bros",
        comment: "GRN created, awaiting fresh bread delivery.",
        inventoryUnit: "piece",
        category: "Bakery",
        subcategory: "Bread",
        brand: "Bakery Bros",
        supplier: "Bakery Bros",
        leadTime: 0,
        shelfLife: 7,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Indonesia",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 200,
          protein: 6,
          carbs: 30,
          fat: 2
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      }
    ],
    summary: {
      subtotal: 45.0,
      taxAmount: 3.15,
      discountAmount: 0.0,
      extraCostAmount: 0.0,
      totalAmount: 48.15,
      currency: "IDR",
      exchangeRate: 15000,
      baseCurrencyTotal: 722250
    },
    extraCosts: [],
    comments: [
      {
        id: 1,
        sender: "David Chen",
        timestamp: "2024-06-05 07:00",
        text: "GRN created, awaiting fresh bread delivery.",
        attachments: []
      },
      {
        id: 2,
        sender: "David Chen",
        timestamp: "2024-06-06 08:30",
        text: "Fresh bread received in excellent condition. Quality perfect for breakfast service.",
        attachments: []
      }
    ],
    notes: "Fresh bread for daily breakfast service",
    deliveryNote: "DN-240605-001"
  },
  {
    id: "GRN-2024-006",
    grnNumber: "GRN-2024-006",
    status: "Committed",
    vendorId: 6,
    vendorName: "Dairy Direct",
    vendorCode: "DDR006",
    createdDate: "2024-06-06",
    receivedDate: "2024-06-06",
    commitDate: "2024-06-07",
    linkedPOs: ["PO-1006"],
    businessUnit: "Boutique Hotel Bangkok",
    createdBy: "Lisa Davis",
    approvedBy: "Chef Antonio",
    totalValue: "$110.00",
    currency: "THB",
    itemCount: 2,
    receiptLocation: "Cold Storage",
    priority: "Medium",
    items: [
      {
        product: "Cheddar Cheese",
        sku: "SKU77777",
        orderedQty: 7,
        receivedQty: 7,
        focQty: 0,
        unit: "kg",
        unitPrice: 8.0,
        totalAmount: 56.0,
        poNumber: "PO-1006",
        expiryDate: "2024-12-01",
        batchNumber: "BT240606001",
        storeLocation: "Cold Storage",
        itemDescription: "Cheddar Cheese",
        department: "Kitchen Operations",
        accountCode: "DDR006",
        conversionRate: 35,
        baseQty: 7,
        baseUnit: "kg",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 7,
        onOrder: 0,
        reorderThreshold: 7,
        restockLevel: 7,
        lastPrice: 8.0,
        lastVendor: "Dairy Direct",
        comment: "Dairy products received in perfect condition. Temperature maintained.",
        inventoryUnit: "kg",
        category: "Dairy",
        subcategory: "Cheese",
        brand: "Dairy Direct",
        supplier: "Dairy Direct",
        leadTime: 0,
        shelfLife: 365,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Thailand",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 300,
          protein: 20,
          carbs: 1,
          fat: 25
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      },
      {
        product: "Yogurt",
        sku: "SKU88888",
        orderedQty: 10,
        receivedQty: 10,
        focQty: 0,
        unit: "cup",
        unitPrice: 5.4,
        totalAmount: 54.0,
        poNumber: "PO-1006",
        expiryDate: "2024-06-20",
        batchNumber: "BT240606002",
        storeLocation: "Cold Storage",
        itemDescription: "Yogurt",
        department: "Kitchen Operations",
        accountCode: "DDR006",
        conversionRate: 35,
        baseQty: 10,
        baseUnit: "cup",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 10,
        onOrder: 0,
        reorderThreshold: 10,
        restockLevel: 10,
        lastPrice: 5.4,
        lastVendor: "Dairy Direct",
        comment: "Dairy products received in perfect condition. Temperature maintained.",
        inventoryUnit: "cup",
        category: "Dairy",
        subcategory: "Yogurt",
        brand: "Dairy Direct",
        supplier: "Dairy Direct",
        leadTime: 0,
        shelfLife: 14,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Thailand",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 100,
          protein: 5,
          carbs: 10,
          fat: 4
        },
        packagingType: "Plastic",
        packagingSize: "1L",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 1,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      }
    ],
    summary: {
      subtotal: 110.0,
      taxAmount: 7.7,
      discountAmount: 0.0,
      extraCostAmount: 3.0,
      totalAmount: 120.7,
      currency: "THB",
      exchangeRate: 35,
      baseCurrencyTotal: 4224.5
    },
    signature: {
      receiverName: "Lisa Davis",
      receiverSignature: "[Digital Signature - Lisa Davis]",
      receivedDate: "2024-06-06",
      receivedTime: "16:45",
      designation: "Inventory Coordinator",
      department: "Kitchen Operations"
    },
    extraCosts: [
      {
        id: "EC003",
        description: "Cold Chain Transport",
        amount: 3.0,
        currency: "THB",
        distributionMethod: "qty"
      }
    ],
    comments: [
      {
        id: 1,
        sender: "Lisa Davis",
        timestamp: "2024-06-06 16:40",
        text: "Dairy products received in perfect condition. Temperature maintained.",
        attachments: []
      }
    ],
    invoiceNumber: "INV-DDR-240606-001"
  },
  {
    id: "GRN-2024-007",
    grnNumber: "GRN-2024-007",
    status: "Committed",
    vendorId: 7,
    vendorName: "Meat Masters",
    vendorCode: "MTM007",
    createdDate: "2024-06-07",
    receivedDate: "2024-06-07",
    commitDate: "2024-06-08",
    dueDate: "2024-06-10",
    linkedPOs: ["PO-1007", "PO-1012"],
    businessUnit: "Grand Hotel Singapore",
    createdBy: "Robert Kim",
    approvedBy: "Head Chef Antonio",
    totalValue: "$380.00",
    currency: "SGD",
    itemCount: 2,
    receiptLocation: "Meat Storage",
    priority: "Urgent",
    items: [
      {
        product: "Chicken Breast",
        sku: "SKU99999",
        orderedQty: 25,
        receivedQty: 25,
        focQty: 2,
        unit: "kg",
        unitPrice: 8.0,
        totalAmount: 200.0,
        poNumber: "PO-1007",
        expiryDate: "2024-06-14",
        batchNumber: "BT240607001",
        storeLocation: "Meat Storage",
        itemDescription: "Chicken Breast",
        department: "Kitchen Operations",
        accountCode: "MTM007",
        conversionRate: 1.0,
        baseQty: 25,
        baseUnit: "kg",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 25,
        onOrder: 0,
        reorderThreshold: 25,
        restockLevel: 25,
        lastPrice: 8.0,
        lastVendor: "Meat Masters",
        comment: "Premium meat received for banquet event. Quality excellent.",
        inventoryUnit: "kg",
        category: "Meat",
        subcategory: "Chicken",
        brand: "Meat Masters",
        supplier: "Meat Masters",
        leadTime: 0,
        shelfLife: 7,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Singapore",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 150,
          protein: 20,
          carbs: 0,
          fat: 5
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      },
      {
        product: "Pork Chops",
        sku: "SKU70707",
        orderedQty: 14,
        receivedQty: 14,
        focQty: 0,
        unit: "kg",
        unitPrice: 12.86,
        totalAmount: 180.0,
        poNumber: "PO-1012",
        expiryDate: "2024-06-12",
        batchNumber: "BT240607002",
        storeLocation: "Meat Storage",
        itemDescription: "Pork Chops",
        department: "Kitchen Operations",
        accountCode: "MTM007",
        conversionRate: 1.0,
        baseQty: 14,
        baseUnit: "kg",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 14,
        onOrder: 0,
        reorderThreshold: 14,
        restockLevel: 14,
        lastPrice: 12.86,
        lastVendor: "Meat Masters",
        comment: "Premium meat received for banquet event. Quality excellent.",
        inventoryUnit: "kg",
        category: "Meat",
        subcategory: "Pork",
        brand: "Meat Masters",
        supplier: "Meat Masters",
        leadTime: 0,
        shelfLife: 7,
        storageCondition: "Cool, dry",
        qualityGrade: "A",
        countryOfOrigin: "Singapore",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 150,
          protein: 20,
          carbs: 0,
          fat: 5
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "A",
        locallySourced: true
      }
    ],
    summary: {
      subtotal: 380.0,
      taxAmount: 26.6,
      discountAmount: 19.0,
      extraCostAmount: 15.0,
      totalAmount: 402.6,
      currency: "SGD",
      exchangeRate: 1.0,
      baseCurrencyTotal: 402.6
    },
    signature: {
      receiverName: "Robert Kim",
      receiverSignature: "[Digital Signature - Robert Kim]",
      receivedDate: "2024-06-07",
      receivedTime: "06:45",
      designation: "Procurement Manager",
      department: "Kitchen Operations"
    },
    extraCosts: [
      {
        id: "EC004",
        description: "Halal Certification Fee",
        amount: 10.0,
        currency: "SGD",
        distributionMethod: "value"
      },
      {
        id: "EC005",
        description: "Express Delivery",
        amount: 5.0,
        currency: "SGD",
        distributionMethod: "qty"
      }
    ],
    comments: [
      {
        id: 1,
        sender: "Robert Kim",
        timestamp: "2024-06-07 06:00",
        text: "Premium meat received for banquet event. Quality excellent.",
        attachments: [
          {
            id: "att002",
            name: "meat_quality_certificate.pdf",
            type: "file",
            size: 156789
          }
        ]
      },
      {
        id: 2,
        sender: "Chef Maria",
        timestamp: "2024-06-07 06:30",
        text: "Perfect marbling on the meat. Ready for weekend banquet.",
        attachments: []
      },
      {
        id: 3,
        sender: "Head Chef Antonio",
        timestamp: "2024-06-08 07:00",
        text: "Quality confirmed and approved. Items committed to inventory for Saturday banquet service.",
        attachments: []
      }
    ],
    notes: "URGENT: For Saturday banquet - handle with care",
    deliveryNote: "DN-240607-001",
    invoiceNumber: "INV-MTM-240607-001"
  },
  {
    id: "GRN-2024-008",
    grnNumber: "GRN-2024-008",
    status: "Draft",
    vendorId: 8,
    vendorName: "Veggie Valley",
    vendorCode: "VVL008",
    createdDate: "2024-06-08",
    dueDate: "2024-06-12",
    linkedPOs: ["PO-1008", "PO-1013"],
    businessUnit: "Business Hotel Jakarta",
    createdBy: "Anna Tan",
    totalValue: "$130.00",
    currency: "IDR",
    itemCount: 3,
    receiptLocation: "Vegetable Storage",
    priority: "Medium",
    items: [
      {
        product: "Carrots",
        sku: "SKU10101",
        orderedQty: 30,
        receivedQty: 0,
        focQty: 0,
        unit: "kg",
        unitPrice: 2.33,
        totalAmount: 0.0,
        poNumber: "PO-1008",
        storeLocation: "Vegetable Storage",
        itemDescription: "Carrots",
        department: "Kitchen Operations",
        accountCode: "VVL008",
        conversionRate: 15000,
        baseQty: 30,
        baseUnit: "kg",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 0,
        onOrder: 0,
        reorderThreshold: 30,
        restockLevel: 30,
        lastPrice: 2.33,
        lastVendor: "Veggie Valley",
        comment: "Awaiting fresh vegetable delivery for salad bar restock.",
        inventoryUnit: "kg",
        category: "Produce",
        subcategory: "Root Vegetables",
        brand: "Veggie Valley",
        supplier: "Veggie Valley",
        leadTime: 0,
        shelfLife: 7,
        storageCondition: "Cool, dry",
        qualityGrade: "B",
        countryOfOrigin: "Indonesia",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 50,
          protein: 1,
          carbs: 10,
          fat: 0.2
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "B",
        locallySourced: true
      },
      {
        product: "Broccoli",
        sku: "SKU20202",
        orderedQty: 18,
        receivedQty: 0,
        focQty: 0,
        unit: "kg",
        unitPrice: 3.89,
        totalAmount: 0.0,
        poNumber: "PO-1008",
        storeLocation: "Vegetable Storage",
        itemDescription: "Broccoli",
        department: "Kitchen Operations",
        accountCode: "VVL008",
        conversionRate: 15000,
        baseQty: 18,
        baseUnit: "kg",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 0,
        onOrder: 0,
        reorderThreshold: 18,
        restockLevel: 18,
        lastPrice: 3.89,
        lastVendor: "Veggie Valley",
        comment: "Awaiting fresh vegetable delivery for salad bar restock.",
        inventoryUnit: "kg",
        category: "Produce",
        subcategory: "Leafy Greens",
        brand: "Veggie Valley",
        supplier: "Veggie Valley",
        leadTime: 0,
        shelfLife: 7,
        storageCondition: "Cool, dry",
        qualityGrade: "B",
        countryOfOrigin: "Indonesia",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 50,
          protein: 3,
          carbs: 5,
          fat: 0.5
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "B",
        locallySourced: true
      },
      {
        product: "Spinach",
        sku: "SKU80808",
        orderedQty: 22,
        receivedQty: 0,
        focQty: 0,
        unit: "kg",
        unitPrice: 2.73,
        totalAmount: 0.0,
        poNumber: "PO-1013",
        storeLocation: "Vegetable Storage",
        itemDescription: "Spinach",
        department: "Kitchen Operations",
        accountCode: "VVL008",
        conversionRate: 15000,
        baseQty: 22,
        baseUnit: "kg",
        discount: 0,
        discountType: "fixed",
        taxType: "exempt",
        taxRate: 0,
        onHand: 0,
        onOrder: 0,
        reorderThreshold: 22,
        restockLevel: 22,
        lastPrice: 2.73,
        lastVendor: "Veggie Valley",
        comment: "Awaiting fresh vegetable delivery for salad bar restock.",
        inventoryUnit: "kg",
        category: "Produce",
        subcategory: "Leafy Greens",
        brand: "Veggie Valley",
        supplier: "Veggie Valley",
        leadTime: 0,
        shelfLife: 7,
        storageCondition: "Cool, dry",
        qualityGrade: "B",
        countryOfOrigin: "Indonesia",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 20,
          protein: 2,
          carbs: 2,
          fat: 0.3
        },
        packagingType: "Plastic",
        packagingSize: "500g",
        casesPerPallet: 24,
        unitsPerCase: 24,
        weight: 0.5,
        volume: 0.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 20,
          unit: "cm"
        },
        certifications: [],
        sustainabilityRating: "B",
        locallySourced: true
      }
    ],
    summary: {
      subtotal: 0.0,
      taxAmount: 0.0,
      discountAmount: 0.0,
      extraCostAmount: 0.0,
      totalAmount: 0.0,
      currency: "IDR",
      exchangeRate: 15000,
      baseCurrencyTotal: 0.0
    },
    extraCosts: [],
    comments: [
      {
        id: 1,
        sender: "Anna Tan",
        timestamp: "2024-06-08 05:30",
        text: "Awaiting fresh vegetable delivery for salad bar restock.",
        attachments: []
      }
    ],
    notes: "Fresh vegetables for salad bar - check quality on arrival"
  },
  {
    id: "GRN-2024-009",
    grnNumber: "GRN-2024-009",
    status: "Draft",
    vendorId: 3,
    vendorName: "Fresh Meat Co.",
    vendorCode: "FMC003",
    createdDate: "2024-06-09",
    dueDate: "2024-06-12",
    linkedPOs: ["PO-1009"],
    businessUnit: "Grand Hotel Singapore",
    createdBy: "Mike Chen",
    totalValue: "$245.50",
    currency: "SGD",
    itemCount: 3,
    receiptLocation: "Cold Storage",
    priority: "High",
    items: [
      {
        product: "Premium Beef Tenderloin",
        sku: "SKU30301",
        orderedQty: 5,
        receivedQty: 0,
        focQty: 0,
        unit: "kg",
        unitPrice: 45.50,
        totalAmount: 0.0,
        poNumber: "PO-1009",
        storeLocation: "Cold Storage",
        itemDescription: "Premium Beef Tenderloin",
        department: "Kitchen Operations",
        accountCode: "FMC003",
        conversionRate: 1.0,
        baseQty: 5,
        baseUnit: "kg",
        discount: 0,
        discountType: "fixed",
        taxType: "added",
        taxRate: 7,
        onHand: 2,
        onOrder: 5,
        reorderThreshold: 3,
        restockLevel: 8,
        lastPrice: 45.50,
        lastVendor: "Fresh Meat Co.",
        comment: "Premium cut for special dinner service.",
        inventoryUnit: "kg",
        category: "Meat",
        subcategory: "Beef",
        brand: "Premium Select",
        supplier: "Fresh Meat Co.",
        leadTime: 2,
        shelfLife: 5,
        storageCondition: "Refrigerated",
        qualityGrade: "A",
        countryOfOrigin: "Australia",
        allergenInfo: [],
        nutritionalInfo: {
          calories: 250,
          protein: 26,
          carbs: 0,
          fat: 15
        },
        packagingType: "Vacuum Sealed",
        packagingSize: "1kg",
        weight: 1.0,
        volume: 0.8,
        dimensions: {
          length: 25,
          width: 15,
          height: 5,
          unit: "cm"
        },
        certifications: ["Halal", "Organic"],
        sustainabilityRating: "B",
        locallySourced: false
      }
    ],
    summary: {
      subtotal: 0.0,
      taxAmount: 0.0,
      discountAmount: 0.0,
      extraCostAmount: 0.0,
      totalAmount: 0.0,
      currency: "SGD",
      exchangeRate: 1.0,
      baseCurrencyTotal: 0.0
    },
    extraCosts: [],
    comments: [
      {
        id: 1,
        sender: "Mike Chen",
        timestamp: "2024-06-09 14:20",
        text: "Awaiting premium meat delivery for weekend special menu.",
        attachments: []
      }
    ],
    notes: "Handle with care - premium quality meat for special events"
  },
  {
    id: "GRN-2024-010",
    grnNumber: "GRN-2024-010",
    status: "Draft",
    vendorId: 4,
    vendorName: "Office Supplies Plus",
    vendorCode: "OSP004",
    createdDate: "2024-06-10",
    dueDate: "2024-06-13",
    linkedPOs: ["PO-1010"],
    businessUnit: "Business Hotel Jakarta",
    createdBy: "Lisa Wong",
    totalValue: "$89.75",
    currency: "IDR",
    itemCount: 4,
    receiptLocation: "Admin Storage",
    priority: "Low",
    items: [
      {
        product: "A4 Copy Paper",
        sku: "SKU40401",
        orderedQty: 10,
        receivedQty: 0,
        focQty: 0,
        unit: "ream",
        unitPrice: 8.50,
        totalAmount: 0.0,
        poNumber: "PO-1010",
        storeLocation: "Admin Storage",
        itemDescription: "A4 Copy Paper 80gsm",
        department: "Administration",
        accountCode: "OSP004",
        conversionRate: 15000,
        baseQty: 10,
        baseUnit: "ream",
        discount: 0,
        discountType: "fixed",
        taxType: "added",
        taxRate: 10,
        onHand: 5,
        onOrder: 10,
        reorderThreshold: 8,
        restockLevel: 20,
        lastPrice: 8.50,
        lastVendor: "Office Supplies Plus",
        comment: "Standard office paper for daily operations.",
        inventoryUnit: "ream",
        category: "Office Supplies",
        subcategory: "Paper",
        brand: "PaperMax",
        supplier: "Office Supplies Plus",
        leadTime: 1,
        shelfLife: 365,
        storageCondition: "Dry storage",
        qualityGrade: "A",
        countryOfOrigin: "Indonesia",
        allergenInfo: [],
        nutritionalInfo: {},
        packagingType: "Cardboard",
        packagingSize: "500 sheets",
        weight: 2.5,
        volume: 0.05,
        dimensions: {
          length: 30,
          width: 21,
          height: 5,
          unit: "cm"
        },
        certifications: ["FSC Certified"],
        sustainabilityRating: "A",
        locallySourced: true
      }
    ],
    summary: {
      subtotal: 0.0,
      taxAmount: 0.0,
      discountAmount: 0.0,
      extraCostAmount: 0.0,
      totalAmount: 0.0,
      currency: "IDR",
      exchangeRate: 15000,
      baseCurrencyTotal: 0.0
    },
    extraCosts: [],
    comments: [
      {
        id: 1,
        sender: "Lisa Wong",
        timestamp: "2024-06-10 11:45",
        text: "Office supplies order for monthly restocking.",
        attachments: []
      }
    ],
    notes: "Regular monthly office supplies order"
  }
];

// Helper functions
export const getGRNById = (id: string): MockGRN | undefined => {
  return mockGRNs.find(grn => grn.id === id || grn.grnNumber === id);
};

export const getGRNsByStatus = (status: MockGRN['status']): MockGRN[] => {
  return mockGRNs.filter(grn => grn.status === status);
};

export const getGRNsByBusinessUnit = (businessUnit: string): MockGRN[] => {
  return mockGRNs.filter(grn => grn.businessUnit === businessUnit);
};

export const getGRNsByVendor = (vendorId: number): MockGRN[] => {
  return mockGRNs.filter(grn => grn.vendorId === vendorId);
};

export const getVendorById = (id: number) => {
  return mockVendors.find(vendor => vendor.id === id);
};

// Business units for filtering
export const businessUnits = [
  "Grand Hotel Singapore",
  "Business Hotel Jakarta", 
  "Boutique Hotel Bangkok"
];

// Priority levels
export const priorityLevels = ['Low', 'Medium', 'High', 'Urgent'] as const;

// Status options
export const statusOptions = ['Draft', 'Received', 'Committed', 'Void'] as const;

// Currency options
export const currencyOptions = ['SGD', 'IDR', 'THB', 'USD'] as const; 