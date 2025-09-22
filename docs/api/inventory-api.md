# Inventory Management API

## Overview
The Inventory Management API provides comprehensive inventory operations including item management, stock levels, locations, availability checking, and inventory movements for the Carmen Supply Chain application.

## Base URL
```
/api/inventory
```

## API Request Headers

All API requests must include the following headers:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>   # (if multi-tenant)
```

All endpoints require the query parameter `version=latest`.

## Example Request

```http
GET /api/inventory/items?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### GET /inventory/items
Retrieve inventory items with filtering and pagination.

#### Request
```http
GET /api/inventory/items?version=latest&page=1&limit=25&search=coffee&category=beverages&location=main-store&businessUnit=bu_12345
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 25, max: 100) |
| search | string | Search term for item name/SKU |
| category | string | Filter by category |
| location | string | Filter by location |
| businessUnit | string | Filter by business unit |
| status | string | Filter by status (active, inactive, discontinued) |
| lowStock | boolean | Filter items with low stock |
| sort | string | Sort field (name, sku, stock, category) |
| order | string | Sort order (asc, desc) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "item_123",
        "sku": "SKU001",
        "name": "Premium Coffee Beans",
        "description": "High-quality arabica coffee beans",
        "category": {
          "id": "cat_001",
          "name": "Beverages",
          "parentId": null
        },
        "subCategory": {
          "id": "subcat_001",
          "name": "Coffee"
        },
        "brand": "Premium Roasters",
        "manufacturer": "Coffee Co Ltd",
        "barcode": "1234567890123",
        "units": {
          "base": "kg",
          "purchase": "bag",
          "inventory": "kg",
          "conversion": {
            "bag": 1,
            "kg": 25
          }
        },
        "pricing": {
          "cost": 24.99,
          "currency": "SGD",
          "lastUpdated": "2024-01-15T10:00:00Z"
        },
        "stock": {
          "onHand": 150,
          "available": 120,
          "reserved": 30,
          "onOrder": 50,
          "allocated": 20,
          "unit": "kg"
        },
        "thresholds": {
          "minimum": 25,
          "maximum": 200,
          "reorderPoint": 50,
          "reorderQuantity": 100
        },
        "locations": [
          {
            "locationId": "loc_001",
            "locationName": "Main Store",
            "quantity": 100,
            "reserved": 20,
            "available": 80
          },
          {
            "locationId": "loc_002",
            "locationName": "Kitchen Store",
            "quantity": 50,
            "reserved": 10,
            "available": 40
          }
        ],
        "status": "active",
        "tags": ["premium", "organic", "fair-trade"],
        "attributes": {
          "weight": "25kg",
          "origin": "Colombia",
          "roastLevel": "Medium"
        },
        "images": [
          {
            "id": "img_001",
            "url": "https://cdn.carmen-supply.com/items/coffee-beans.jpg",
            "alt": "Premium Coffee Beans",
            "isPrimary": true
          }
        ],
        "createdAt": "2023-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z",
        "createdBy": "user_123",
        "lastCountDate": "2024-01-10T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 150,
      "totalPages": 6,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "totalItems": 150,
      "lowStockItems": 12,
      "outOfStockItems": 3,
      "totalValue": 125000.50
    }
  }
}
```

### GET /inventory/items/{id}
Get detailed information for a specific inventory item.

#### Request
```http
GET /api/inventory/items/item_123?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "item": {
      "id": "item_123",
      "sku": "SKU001",
      "name": "Premium Coffee Beans",
      "description": "High-quality arabica coffee beans sourced from Colombian highlands",
      "category": {
        "id": "cat_001",
        "name": "Beverages",
        "path": "Food & Beverage > Beverages > Coffee"
      },
      "specifications": {
        "weight": "25kg",
        "dimensions": "40x30x20cm",
        "shelfLife": "24 months",
        "storageConditions": "Cool, dry place"
      },
      "stock": {
        "onHand": 150,
        "available": 120,
        "reserved": 30,
        "onOrder": 50,
        "allocated": 20,
        "unit": "kg",
        "lastUpdated": "2024-01-15T10:00:00Z"
      },
      "movements": [
        {
          "id": "mov_001",
          "type": "receipt",
          "quantity": 100,
          "unit": "kg",
          "reference": "GRN-001",
          "date": "2024-01-14T10:00:00Z",
          "user": "John Doe",
          "notes": "Received from PO-2024-001"
        },
        {
          "id": "mov_002",
          "type": "issue",
          "quantity": -25,
          "unit": "kg",
          "reference": "SR-001",
          "date": "2024-01-13T14:30:00Z",
          "user": "Jane Smith",
          "notes": "Issued to Kitchen"
        }
      ],
      "vendors": [
        {
          "vendorId": "vendor_001",
          "vendorName": "Premium Suppliers Ltd",
          "partNumber": "PS-COFFEE-001",
          "price": 24.99,
          "currency": "SGD",
          "leadTime": 7,
          "minimumOrder": 10,
          "isPrimary": true
        }
      ],
      "alternatives": [
        {
          "itemId": "item_124",
          "sku": "SKU002",
          "name": "Standard Coffee Beans",
          "substitutionRatio": 1.0
        }
      ]
    }
  }
}
```

### PUT /inventory/items/{id}/stock
Update stock levels for an inventory item.

#### Request
```http
PUT /api/inventory/items/item_123/stock?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "adjustments": [
    {
      "locationId": "loc_001",
      "quantity": 25,
      "unit": "kg",
      "type": "adjustment",
      "reason": "Physical count variance",
      "reference": "PC-2024-001",
      "notes": "Counted 125kg, system showed 100kg"
    }
  ],
  "countDate": "2024-01-15T10:00:00Z",
  "countedBy": "user_123"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "item": {
      "id": "item_123",
      "sku": "SKU001",
      "stock": {
        "onHand": 175,
        "available": 145,
        "reserved": 30,
        "unit": "kg",
        "lastUpdated": "2024-01-15T10:00:00Z"
      }
    },
    "movements": [
      {
        "id": "mov_003",
        "type": "adjustment",
        "quantity": 25,
        "unit": "kg",
        "reference": "PC-2024-001",
        "date": "2024-01-15T10:00:00Z",
        "user": "John Doe",
        "notes": "Physical count adjustment"
      }
    ]
  },
  "message": "Stock updated successfully"
}
```

### GET /inventory/locations
Get list of inventory locations.

#### Request
```http
GET /api/inventory/locations?version=latest&businessUnit=bu_12345&type=storage
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "locations": [
      {
        "id": "loc_001",
        "code": "MAIN-STORE",
        "name": "Main Store",
        "type": "storage",
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        },
        "address": {
          "building": "Main Building",
          "floor": "Basement 1",
          "room": "Store Room A"
        },
        "capacity": {
          "volume": 1000,
          "unit": "m3",
          "utilization": 75.5
        },
        "zones": [
          {
            "id": "zone_001",
            "name": "Dry Goods",
            "temperature": "ambient"
          },
          {
            "id": "zone_002",
            "name": "Refrigerated",
            "temperature": "2-8°C"
          }
        ],
        "status": "active",
        "manager": {
          "id": "user_456",
          "name": "Store Manager"
        },
        "createdAt": "2023-01-15T10:00:00Z"
      }
    ]
  }
}
```

### GET /inventory/availability
Check item availability across locations.

#### Request
```http
GET /api/inventory/availability?version=latest&items=item_123,item_124&location=loc_001&businessUnit=bu_12345
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "availability": [
      {
        "itemId": "item_123",
        "sku": "SKU001",
        "name": "Premium Coffee Beans",
        "locations": [
          {
            "locationId": "loc_001",
            "locationName": "Main Store",
            "available": 120,
            "reserved": 30,
            "onHand": 150,
            "unit": "kg",
            "lastUpdated": "2024-01-15T10:00:00Z"
          }
        ],
        "totalAvailable": 120,
        "totalOnHand": 150,
        "unit": "kg"
      }
    ],
    "summary": {
      "requestedItems": 2,
      "availableItems": 1,
      "unavailableItems": 1
    }
  }
}
```

### POST /inventory/movements
Record inventory movements.

#### Request
```http
POST /api/inventory/movements?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "movements": [
    {
      "itemId": "item_123",
      "type": "issue",
      "quantity": 25,
      "unit": "kg",
      "fromLocation": "loc_001",
      "toLocation": "loc_002",
      "reference": "SR-001",
      "reason": "Store requisition",
      "notes": "Transfer to kitchen store",
      "requestedBy": "user_789",
      "approvedBy": "user_456"
    }
  ],
  "transactionDate": "2024-01-15T10:00:00Z",
  "batchId": "batch_001"
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "movements": [
      {
        "id": "mov_004",
        "itemId": "item_123",
        "type": "issue",
        "quantity": 25,
        "unit": "kg",
        "fromLocation": "loc_001",
        "toLocation": "loc_002",
        "reference": "SR-001",
        "date": "2024-01-15T10:00:00Z",
        "user": "user_123",
        "status": "completed"
      }
    ],
    "batchId": "batch_001"
  },
  "message": "Movements recorded successfully"
}
```

### GET /inventory/movements
Get inventory movement history.

#### Request
```http
GET /api/inventory/movements?version=latest&itemId=item_123&dateFrom=2024-01-01&dateTo=2024-01-15&type=issue
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "movements": [
      {
        "id": "mov_004",
        "item": {
          "id": "item_123",
          "sku": "SKU001",
          "name": "Premium Coffee Beans"
        },
        "type": "issue",
        "quantity": 25,
        "unit": "kg",
        "fromLocation": {
          "id": "loc_001",
          "name": "Main Store"
        },
        "toLocation": {
          "id": "loc_002",
          "name": "Kitchen Store"
        },
        "reference": "SR-001",
        "reason": "Store requisition",
        "date": "2024-01-15T10:00:00Z",
        "user": {
          "id": "user_123",
          "name": "John Doe"
        },
        "approvedBy": {
          "id": "user_456",
          "name": "Store Manager"
        },
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 50,
      "totalPages": 2
    }
  }
}
```

### GET /inventory/categories
Get inventory categories hierarchy.

#### Request
```http
GET /api/inventory/categories?version=latest&businessUnit=bu_12345
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_001",
        "name": "Food & Beverage",
        "code": "F&B",
        "description": "Food and beverage items",
        "parentId": null,
        "level": 0,
        "children": [
          {
            "id": "cat_002",
            "name": "Beverages",
            "code": "BEV",
            "parentId": "cat_001",
            "level": 1,
            "children": [
              {
                "id": "cat_003",
                "name": "Coffee",
                "code": "COFFEE",
                "parentId": "cat_002",
                "level": 2,
                "itemCount": 15
              }
            ],
            "itemCount": 45
          }
        ],
        "itemCount": 120
      }
    ]
  }
}
```

### POST /inventory/cycle-count
Initiate cycle count for items.

#### Request
```http
POST /api/inventory/cycle-count?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Monthly Cycle Count - January 2024",
  "type": "scheduled",
  "locations": ["loc_001", "loc_002"],
  "items": ["item_123", "item_124"],
  "scheduledDate": "2024-01-20T09:00:00Z",
  "assignedTo": ["user_123", "user_456"],
  "instructions": "Count all items in designated locations",
  "businessUnit": "bu_12345"
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "cycleCount": {
      "id": "cc_001",
      "name": "Monthly Cycle Count - January 2024",
      "status": "scheduled",
      "itemCount": 2,
      "locationCount": 2,
      "scheduledDate": "2024-01-20T09:00:00Z",
      "createdAt": "2024-01-15T10:00:00Z",
      "createdBy": "user_123"
    }
  },
  "message": "Cycle count created successfully"
}
```

## Data Models

### Inventory Item
```typescript
interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: Category;
  subCategory?: Category;
  brand?: string;
  manufacturer?: string;
  barcode?: string;
  units: UnitConfiguration;
  pricing: PricingInfo;
  stock: StockInfo;
  thresholds: StockThresholds;
  locations: LocationStock[];
  status: 'active' | 'inactive' | 'discontinued';
  tags: string[];
  attributes: Record<string, any>;
  images: ItemImage[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastCountDate?: string;
}
```

### Stock Information
```typescript
interface StockInfo {
  onHand: number;
  available: number;
  reserved: number;
  onOrder: number;
  allocated: number;
  unit: string;
  lastUpdated: string;
}
```

### Location Stock
```typescript
interface LocationStock {
  locationId: string;
  locationName: string;
  quantity: number;
  reserved: number;
  available: number;
  lastUpdated?: string;
}
```

### Inventory Movement
```typescript
interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'receipt' | 'issue' | 'transfer' | 'adjustment' | 'return';
  quantity: number;
  unit: string;
  fromLocation?: string;
  toLocation?: string;
  reference?: string;
  reason?: string;
  notes?: string;
  date: string;
  user: string;
  approvedBy?: string;
  status: 'pending' | 'completed' | 'cancelled';
}
```

## Error Codes

| Code | Description |
|------|-------------|
| INV_001 | Item not found |
| INV_002 | Insufficient stock |
| INV_003 | Invalid location |
| INV_004 | Invalid unit conversion |
| INV_005 | Stock adjustment failed |
| INV_006 | Movement validation failed |
| INV_007 | Category not found |
| INV_008 | Duplicate SKU |
| INV_009 | Invalid stock threshold |
| INV_010 | Location capacity exceeded |

## Business Rules

### Stock Management
- Stock cannot go below zero
- Reserved stock cannot exceed on-hand stock
- Available stock = on-hand - reserved - allocated
- Stock movements require proper authorization

### Unit Conversions
- All conversions must be defined in unit configuration
- Base unit is used for all calculations
- Fractional quantities allowed for weight/volume units

### Location Management
- Items can exist in multiple locations
- Location transfers require both source and destination
- Location capacity limits are enforced

### Approval Requirements
- Stock adjustments > $1000 require manager approval
- Inter-location transfers require store manager approval
- Negative adjustments require justification

## Examples

### Check Item Availability
```typescript
const checkAvailability = async (itemId: string, quantity: number) => {
  const response = await fetch(`/api/inventory/availability?version=latest&items=${itemId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const { data } = await response.json();
  const item = data.availability[0];
  
  return item.totalAvailable >= quantity;
};
```

### Record Stock Movement
```typescript
const recordMovement = async (movement: InventoryMovement) => {
  const response = await fetch('/api/inventory/movements?version=latest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      movements: [movement],
      transactionDate: new Date().toISOString()
    })
  });
  
  return response.json();
};
```

### Update Stock Levels
```typescript
const updateStock = async (itemId: string, adjustments: StockAdjustment[]) => {
  const response = await fetch(`/api/inventory/items/${itemId}/stock?version=latest`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      adjustments,
      countDate: new Date().toISOString(),
      countedBy: currentUser.id
    })
  });
  
  return response.json();
};
```