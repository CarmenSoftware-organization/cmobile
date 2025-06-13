// Mock Inventory Data for Spot Check Manual Selection
// Based on existing PO and GRN data

export interface InventoryItem {
  sku: string;
  product: string;
  description: string;
  category: string;
  subcategory?: string;
  brand?: string;
  storeLocation: string;
  systemQty: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  lastUpdated: string;
  department: string;
  supplier: string;
  expiryDate?: string;
  batchNumber?: string;
}

// Generate inventory based on existing PO data
export const mockInventoryByLocation: Record<string, InventoryItem[]> = {
  "Main Store": [
    {
      sku: "SKU12345",
      product: "Mineral Water 500ml",
      description: "Mineral Water 500ml (24 bottles/case)",
      category: "Beverages",
      subcategory: "Water",
      brand: "Aqua",
      storeLocation: "Main Store",
      systemQty: 48,
      unit: "case",
      unitPrice: 12.5,
      totalValue: 600.0,
      lastUpdated: "2024-06-15",
      department: "F&B",
      supplier: "Aqua Supplier",
      expiryDate: "2025-01-01",
      batchNumber: "BT240601001"
    },
    {
      sku: "SKU78905",
      product: "Bottled Water 1.5L",
      description: "Natural spring water 1.5L (12 bottles/case)",
      category: "Beverages",
      subcategory: "Water",
      brand: "Aqua",
      storeLocation: "Main Store",
      systemQty: 25,
      unit: "case",
      unitPrice: 18.0,
      totalValue: 450.0,
      lastUpdated: "2024-06-14",
      department: "F&B",
      supplier: "Aqua Supplier",
      expiryDate: "2025-03-15"
    },
    {
      sku: "SKU99001",
      product: "Distilled Water 5L",
      description: "Distilled Water 5L bottle for cleaning",
      category: "Cleaning Supplies",
      subcategory: "Water",
      brand: "Aqua",
      storeLocation: "Main Store",
      systemQty: 35,
      unit: "bottle",
      unitPrice: 8.0,
      totalValue: 280.0,
      lastUpdated: "2024-06-13",
      department: "Housekeeping",
      supplier: "Aqua Supplier"
    },
    {
      sku: "SKU78903",
      product: "Premium Coffee Beans",
      description: "Premium Arabica coffee beans 1kg bag",
      category: "Coffee",
      subcategory: "Beans",
      brand: "Coffee Roasters",
      storeLocation: "Main Store",
      systemQty: 20,
      unit: "bag",
      unitPrice: 35.0,
      totalValue: 700.0,
      lastUpdated: "2024-06-12",
      department: "Kitchen",
      supplier: "Coffee Traders",
      expiryDate: "2025-08-15"
    }
  ],
  "Bar Storage": [
    {
      sku: "SKU54321",
      product: "Sparkling Water 1L",
      description: "Sparkling Water 1L (12 bottles/box)",
      category: "Beverages",
      subcategory: "Water",
      brand: "Aqua",
      storeLocation: "Bar Storage",
      systemQty: 15,
      unit: "box",
      unitPrice: 15.0,
      totalValue: 225.0,
      lastUpdated: "2024-06-15",
      department: "Bar",
      supplier: "Aqua Supplier",
      expiryDate: "2025-02-01"
    },
    {
      sku: "SKU78906",
      product: "Wine Glasses Set",
      description: "Crystal wine glasses set of 6",
      category: "Glassware",
      subcategory: "Wine Glasses",
      brand: "Crystal Pro",
      storeLocation: "Bar Storage",
      systemQty: 8,
      unit: "set",
      unitPrice: 65.0,
      totalValue: 520.0,
      lastUpdated: "2024-06-14",
      department: "Bar",
      supplier: "Glassware Specialists"
    },
    {
      sku: "SKU78907",
      product: "Cocktail Mixers Set",
      description: "Premium cocktail mixers and syrups set",
      category: "Bar Supplies",
      subcategory: "Mixers",
      brand: "Mix Master",
      storeLocation: "Bar Storage",
      systemQty: 6,
      unit: "set",
      unitPrice: 85.0,
      totalValue: 510.0,
      lastUpdated: "2024-06-13",
      department: "Bar",
      supplier: "Bar Supplies Co",
      expiryDate: "2025-12-31"
    },
    {
      sku: "SKU67892",
      product: "Cranberry Juice 750ml",
      description: "Premium Cranberry Juice 750ml",
      category: "Beverages",
      subcategory: "Juice",
      brand: "Juice Co.",
      storeLocation: "Bar Storage",
      systemQty: 18,
      unit: "bottle",
      unitPrice: 9.5,
      totalValue: 171.0,
      lastUpdated: "2024-06-12",
      department: "Bar",
      supplier: "Juice Co.",
      expiryDate: "2025-01-20"
    }
  ],
  "Kitchen Storage": [
    {
      sku: "SKU78902",
      product: "Kitchen Towels",
      description: "Absorbent kitchen towels pack of 50",
      category: "Kitchen Supplies",
      subcategory: "Cleaning",
      brand: "Clean Pro",
      storeLocation: "Kitchen Storage",
      systemQty: 12,
      unit: "pack",
      unitPrice: 12.5,
      totalValue: 150.0,
      lastUpdated: "2024-06-15",
      department: "Kitchen",
      supplier: "Aqua Supplier",
      expiryDate: "2025-12-31"
    },
    {
      sku: "SKU11111",
      product: "Arabica Coffee Beans 1kg",
      description: "Premium Arabica Coffee Beans 1kg bag",
      category: "Coffee",
      subcategory: "Beans",
      brand: "Coffee Traders",
      storeLocation: "Kitchen Storage",
      systemQty: 13,
      unit: "bag",
      unitPrice: 35.0,
      totalValue: 455.0,
      lastUpdated: "2024-06-14",
      department: "F&B",
      supplier: "Coffee Traders",
      expiryDate: "2025-06-01"
    },
    {
      sku: "SKU11112",
      product: "Espresso Blend 500g",
      description: "House Espresso Blend 500g pack",
      category: "Coffee",
      subcategory: "Beans",
      brand: "Coffee Traders",
      storeLocation: "Kitchen Storage",
      systemQty: 23,
      unit: "pack",
      unitPrice: 18.0,
      totalValue: 414.0,
      lastUpdated: "2024-06-13",
      department: "F&B",
      supplier: "Coffee Traders",
      expiryDate: "2025-03-15"
    },
    {
      sku: "SKU67890",
      product: "Orange Juice 1L",
      description: "Fresh Orange Juice 1L bottle",
      category: "Beverages",
      subcategory: "Juice",
      brand: "Juice Co.",
      storeLocation: "Kitchen Storage",
      systemQty: 27,
      unit: "bottle",
      unitPrice: 8.5,
      totalValue: 229.5,
      lastUpdated: "2024-06-12",
      department: "F&B",
      supplier: "Juice Co.",
      expiryDate: "2024-12-15"
    }
  ],
  "Housekeeping Storage": [
    {
      sku: "SKU78904",
      product: "Luxury Bath Towels",
      description: "100% Egyptian cotton luxury bath towel set",
      category: "Linens",
      subcategory: "Towels",
      brand: "Luxury Linens",
      storeLocation: "Housekeeping Storage",
      systemQty: 32,
      unit: "set",
      unitPrice: 45.0,
      totalValue: 1440.0,
      lastUpdated: "2024-06-15",
      department: "Housekeeping",
      supplier: "Luxury Linens Co"
    },
    {
      sku: "SKU99002",
      product: "Glass Cleaner Spray",
      description: "Professional glass cleaner spray 500ml",
      category: "Cleaning Supplies",
      subcategory: "Cleaners",
      brand: "Clean Pro",
      storeLocation: "Housekeeping Storage",
      systemQty: 20,
      unit: "bottle",
      unitPrice: 6.5,
      totalValue: 130.0,
      lastUpdated: "2024-06-14",
      department: "Housekeeping",
      supplier: "Aqua Supplier",
      expiryDate: "2025-06-30"
    },
    {
      sku: "SKU99003",
      product: "Microfiber Cleaning Cloths",
      description: "Premium microfiber cloths pack of 10",
      category: "Cleaning Supplies",
      subcategory: "Cloths",
      brand: "Clean Pro",
      storeLocation: "Housekeeping Storage",
      systemQty: 13,
      unit: "pack",
      unitPrice: 15.0,
      totalValue: 195.0,
      lastUpdated: "2024-06-13",
      department: "Housekeeping",
      supplier: "Aqua Supplier"
    },
    {
      sku: "SKU99004",
      product: "Bathroom Cleaner Concentrate",
      description: "Concentrated bathroom cleaner 1L",
      category: "Cleaning Supplies",
      subcategory: "Cleaners",
      brand: "Eco Clean",
      storeLocation: "Housekeeping Storage",
      systemQty: 10,
      unit: "bottle",
      unitPrice: 22.0,
      totalValue: 220.0,
      lastUpdated: "2024-06-12",
      department: "Housekeeping",
      supplier: "Aqua Supplier",
      expiryDate: "2025-09-30"
    }
  ],
  "Pool Equipment Room": [
    {
      sku: "SKU99007",
      product: "Pool Chlorine Tablets",
      description: "Chlorine tablets 5kg bucket",
      category: "Pool Supplies",
      subcategory: "Chemicals",
      brand: "AquaChem",
      storeLocation: "Pool Equipment Room",
      systemQty: 12,
      unit: "bucket",
      unitPrice: 45.0,
      totalValue: 540.0,
      lastUpdated: "2024-06-15",
      department: "Pool Maintenance",
      supplier: "Aqua Supplier",
      expiryDate: "2025-12-31"
    },
    {
      sku: "SKU99008",
      product: "pH Test Strips",
      description: "pH test strips pack of 100",
      category: "Pool Supplies",
      subcategory: "Testing",
      brand: "TestPro",
      storeLocation: "Pool Equipment Room",
      systemQty: 8,
      unit: "pack",
      unitPrice: 18.0,
      totalValue: 144.0,
      lastUpdated: "2024-06-14",
      department: "Pool Maintenance",
      supplier: "Aqua Supplier",
      expiryDate: "2026-06-30"
    },
    {
      sku: "SKU99009",
      product: "Pool Skimmer Nets",
      description: "Professional pool skimmer net",
      category: "Pool Supplies",
      subcategory: "Equipment",
      brand: "PoolPro",
      storeLocation: "Pool Equipment Room",
      systemQty: 5,
      unit: "piece",
      unitPrice: 35.0,
      totalValue: 175.0,
      lastUpdated: "2024-06-13",
      department: "Pool Maintenance",
      supplier: "Aqua Supplier"
    }
  ]
};

// Helper functions
export const getAllProducts = (): InventoryItem[] => {
  return Object.values(mockInventoryByLocation).flat();
};

export const getProductsByLocation = (location: string): InventoryItem[] => {
  return mockInventoryByLocation[location] || [];
};

export const searchProducts = (query: string, location?: string): InventoryItem[] => {
  const products = location ? getProductsByLocation(location) : getAllProducts();
  
  return products.filter(product =>
    product.product.toLowerCase().includes(query.toLowerCase()) ||
    product.sku.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase()) ||
    product.brand?.toLowerCase().includes(query.toLowerCase()) ||
    product.supplier.toLowerCase().includes(query.toLowerCase())
  );
};

export const getProductsByCategory = (category: string, location?: string): InventoryItem[] => {
  const products = location ? getProductsByLocation(location) : getAllProducts();
  return products.filter(product => product.category === category);
};

export const getCategories = (location?: string): string[] => {
  const products = location ? getProductsByLocation(location) : getAllProducts();
  return Array.from(new Set(products.map(product => product.category))).sort();
};