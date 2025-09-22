# Receiving API

## Overview
The Receiving API manages goods receipt notes (GRNs), purchase order receiving, inventory updates, and receiving workflow processes for the Carmen Supply Chain application. This API handles the core receiving operations from PO scanning to GRN completion.

## Base URL
```
/api/receiving
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
GET /api/receiving/grns?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### GET /receiving/purchase-orders
Retrieve purchase orders available for receiving.

#### Request
```http
GET /api/receiving/purchase-orders?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 25, max: 100) |
| status | string | Filter by status (pending, partial, completed, cancelled) |
| businessUnit | string | Filter by business unit |
| vendor | string | Filter by vendor ID |
| poNumber | string | Filter by PO number |
| dateFrom | string | Filter from date (ISO 8601) |
| dateTo | string | Filter to date (ISO 8601) |
| sort | string | Sort field (poNumber, date, vendor, status) |
| order | string | Sort order (asc, desc) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "purchaseOrders": [
      {
        "id": "po_123",
        "poNumber": "PO-2024-001",
        "status": "pending",
        "vendor": {
          "id": "vendor_123",
          "name": "Fresh Foods Supplier",
          "code": "FFS001"
        },
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        },
        "orderDate": "2024-01-10T00:00:00Z",
        "expectedDeliveryDate": "2024-01-15T00:00:00Z",
        "totalValue": 2500.00,
        "currency": "SGD",
        "itemCount": 15,
        "receivedItemCount": 0,
        "receivingStatus": "not_started",
        "createdBy": {
          "id": "user_123",
          "name": "Alice Lee"
        },
        "createdAt": "2024-01-10T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 45,
      "pages": 2
    }
  },
  "message": "Purchase orders retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /receiving/purchase-orders/{id}
Retrieve a specific purchase order with receiving details.

#### Request
```http
GET /api/receiving/purchase-orders/po_123?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "purchaseOrder": {
      "id": "po_123",
      "poNumber": "PO-2024-001",
      "status": "pending",
      "vendor": {
        "id": "vendor_123",
        "name": "Fresh Foods Supplier",
        "code": "FFS001",
        "contact": {
          "email": "orders@freshfoods.com",
          "phone": "+65-6123-4567"
        }
      },
      "businessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "orderDate": "2024-01-10T00:00:00Z",
      "expectedDeliveryDate": "2024-01-15T00:00:00Z",
      "totalValue": 2500.00,
      "currency": "SGD",
      "items": [
        {
          "id": "poi_123",
          "item": {
            "id": "item_123",
            "sku": "SKU001",
            "name": "Premium Coffee Beans",
            "description": "High-quality arabica coffee beans",
            "category": "Beverages",
            "unit": "kg"
          },
          "orderedQuantity": 25,
          "receivedQuantity": 0,
          "pendingQuantity": 25,
          "unitPrice": 24.99,
          "totalPrice": 624.75,
          "currency": "SGD",
          "receivingStatus": "pending"
        }
      ],
      "receivingHistory": [
        {
          "grnId": "grn_123",
          "grnNumber": "GRN-2024-001",
          "receivedDate": "2024-01-14T10:30:00Z",
          "receivedBy": "user_456",
          "itemsReceived": 5,
          "status": "completed"
        }
      ],
      "createdBy": {
        "id": "user_123",
        "name": "Alice Lee"
      },
      "createdAt": "2024-01-10T09:00:00Z"
    }
  },
  "message": "Purchase order retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /receiving/grns
Create a new Goods Receipt Note (GRN).

#### Request
```http
POST /api/receiving/grns?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "purchaseOrderId": "po_123",
  "businessUnitId": "bu_12345",
  "deliveryNote": "DN-2024-001",
  "deliveryDate": "2024-01-15T10:30:00Z",
  "receivedBy": "user_456",
  "notes": "All items received in good condition",
  "items": [
    {
      "purchaseOrderItemId": "poi_123",
      "receivedQuantity": 25,
      "unitPrice": 24.99,
      "locationId": "loc_123",
      "condition": "good",
      "expiryDate": "2024-12-31T00:00:00Z",
      "batchNumber": "BATCH001",
      "notes": "Premium quality as expected"
    }
  ]
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "grn": {
      "id": "grn_123",
      "grnNumber": "GRN-2024-001",
      "status": "draft",
      "purchaseOrder": {
        "id": "po_123",
        "poNumber": "PO-2024-001"
      },
      "businessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "vendor": {
        "id": "vendor_123",
        "name": "Fresh Foods Supplier"
      },
      "deliveryNote": "DN-2024-001",
      "deliveryDate": "2024-01-15T10:30:00Z",
      "receivedBy": {
        "id": "user_456",
        "name": "Bob Receiver"
      },
      "itemCount": 1,
      "totalValue": 624.75,
      "currency": "SGD",
      "notes": "All items received in good condition",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "GRN created successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /receiving/grns
Retrieve GRNs with filtering and pagination.

#### Request
```http
GET /api/receiving/grns?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 25, max: 100) |
| status | string | Filter by status (draft, completed, cancelled) |
| businessUnit | string | Filter by business unit |
| vendor | string | Filter by vendor ID |
| grnNumber | string | Filter by GRN number |
| poNumber | string | Filter by PO number |
| dateFrom | string | Filter from date (ISO 8601) |
| dateTo | string | Filter to date (ISO 8601) |
| receivedBy | string | Filter by receiver user ID |
| sort | string | Sort field (grnNumber, date, vendor, status) |
| order | string | Sort order (asc, desc) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "grns": [
      {
        "id": "grn_123",
        "grnNumber": "GRN-2024-001",
        "status": "draft",
        "purchaseOrder": {
          "id": "po_123",
          "poNumber": "PO-2024-001"
        },
        "vendor": {
          "id": "vendor_123",
          "name": "Fresh Foods Supplier"
        },
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        },
        "deliveryDate": "2024-01-15T10:30:00Z",
        "receivedBy": {
          "id": "user_456",
          "name": "Bob Receiver"
        },
        "itemCount": 1,
        "totalValue": 624.75,
        "currency": "SGD",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 12,
      "pages": 1
    },
    "summary": {
      "totalCount": 12,
      "statusCounts": {
        "draft": 3,
        "completed": 8,
        "cancelled": 1
      },
      "totalValue": 15750.00,
      "currency": "SGD"
    }
  },
  "message": "GRNs retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /receiving/grns/{id}
Retrieve a specific GRN with full details.

#### Request
```http
GET /api/receiving/grns/grn_123?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "grn": {
      "id": "grn_123",
      "grnNumber": "GRN-2024-001",
      "status": "draft",
      "purchaseOrder": {
        "id": "po_123",
        "poNumber": "PO-2024-001",
        "orderDate": "2024-01-10T00:00:00Z"
      },
      "businessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "vendor": {
        "id": "vendor_123",
        "name": "Fresh Foods Supplier",
        "code": "FFS001"
      },
      "deliveryNote": "DN-2024-001",
      "deliveryDate": "2024-01-15T10:30:00Z",
      "receivedBy": {
        "id": "user_456",
        "name": "Bob Receiver",
        "email": "bob.receiver@carmen.com"
      },
      "items": [
        {
          "id": "grni_123",
          "purchaseOrderItem": {
            "id": "poi_123",
            "orderedQuantity": 25,
            "unitPrice": 24.99
          },
          "item": {
            "id": "item_123",
            "sku": "SKU001",
            "name": "Premium Coffee Beans",
            "description": "High-quality arabica coffee beans",
            "category": "Beverages",
            "unit": "kg"
          },
          "receivedQuantity": 25,
          "unitPrice": 24.99,
          "totalPrice": 624.75,
          "currency": "SGD",
          "location": {
            "id": "loc_123",
            "name": "Main Store",
            "code": "MS001"
          },
          "condition": "good",
          "expiryDate": "2024-12-31T00:00:00Z",
          "batchNumber": "BATCH001",
          "notes": "Premium quality as expected",
          "variance": {
            "quantityVariance": 0,
            "priceVariance": 0.00,
            "hasVariance": false
          }
        }
      ],
      "totalValue": 624.75,
      "currency": "SGD",
      "notes": "All items received in good condition",
      "attachments": [
        {
          "id": "att_123",
          "name": "delivery_receipt.pdf",
          "url": "/api/v1/attachments/att_123",
          "size": 245760,
          "type": "application/pdf"
        }
      ],
      "auditTrail": [
        {
          "id": "audit_123",
          "action": "created",
          "performedBy": {
            "id": "user_456",
            "name": "Bob Receiver"
          },
          "timestamp": "2024-01-15T10:30:00Z",
          "details": "GRN created"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "GRN retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### PUT /receiving/grns/{id}
Update an existing GRN (only allowed in draft status).

#### Request
```http
PUT /api/receiving/grns/grn_123?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "deliveryNote": "DN-2024-001-UPDATED",
  "notes": "Updated notes - some items had minor packaging damage",
  "items": [
    {
      "id": "grni_123",
      "receivedQuantity": 24,
      "condition": "damaged",
      "notes": "1 kg bag had minor tear, contents intact"
    }
  ]
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "grn": {
      "id": "grn_123",
      "grnNumber": "GRN-2024-001",
      "status": "draft",
      "deliveryNote": "DN-2024-001-UPDATED",
      "notes": "Updated notes - some items had minor packaging damage",
      "totalValue": 599.76,
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  },
  "message": "GRN updated successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### POST /receiving/grns/{id}/complete
Complete a GRN and update inventory.

#### Request
```http
POST /api/receiving/grns/grn_123/complete?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "finalNotes": "Receiving completed successfully",
  "updateInventory": true
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "grn": {
      "id": "grn_123",
      "grnNumber": "GRN-2024-001",
      "status": "completed",
      "completedAt": "2024-01-15T11:30:00Z",
      "completedBy": {
        "id": "user_456",
        "name": "Bob Receiver"
      },
      "inventoryUpdated": true,
      "inventoryTransactions": [
        {
          "id": "inv_txn_123",
          "itemId": "item_123",
          "locationId": "loc_123",
          "quantity": 24,
          "type": "receipt",
          "reference": "GRN-2024-001"
        }
      ]
    }
  },
  "message": "GRN completed and inventory updated",
  "timestamp": "2024-01-15T11:30:00Z"
}
```

### POST /receiving/grns/{id}/cancel
Cancel a GRN.

#### Request
```http
POST /api/receiving/grns/grn_123/cancel?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "reason": "Delivery rejected",
  "comments": "Items did not meet quality standards"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "grn": {
      "id": "grn_123",
      "status": "cancelled",
      "cancelledAt": "2024-01-15T11:30:00Z",
      "cancelledBy": {
        "id": "user_456",
        "name": "Bob Receiver"
      },
      "cancellationReason": "Delivery rejected"
    }
  },
  "message": "GRN cancelled successfully",
  "timestamp": "2024-01-15T11:30:00Z"
}
```

### GET /receiving/grns/{id}/items
Retrieve items for a specific GRN.

#### Request
```http
GET /api/receiving/grns/grn_123/items?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "grni_123",
        "purchaseOrderItem": {
          "id": "poi_123",
          "orderedQuantity": 25,
          "unitPrice": 24.99
        },
        "item": {
          "id": "item_123",
          "sku": "SKU001",
          "name": "Premium Coffee Beans",
          "description": "High-quality arabica coffee beans",
          "category": "Beverages",
          "unit": "kg",
          "currentStock": 45.5
        },
        "receivedQuantity": 24,
        "unitPrice": 24.99,
        "totalPrice": 599.76,
        "currency": "SGD",
        "location": {
          "id": "loc_123",
          "name": "Main Store",
          "code": "MS001"
        },
        "condition": "damaged",
        "expiryDate": "2024-12-31T00:00:00Z",
        "batchNumber": "BATCH001",
        "notes": "1 kg bag had minor tear, contents intact",
        "variance": {
          "quantityVariance": -1,
          "priceVariance": 0.00,
          "hasVariance": true,
          "varianceReason": "Damaged packaging"
        }
      }
    ],
    "summary": {
      "totalItems": 1,
      "totalValue": 599.76,
      "currency": "SGD",
      "hasVariances": true
    }
  },
  "message": "GRN items retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /receiving/grns/{id}/items
Add items to a GRN (only allowed in draft status).

#### Request
```http
POST /api/receiving/grns/grn_123/items?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "items": [
    {
      "purchaseOrderItemId": "poi_124",
      "receivedQuantity": 50,
      "unitPrice": 2.50,
      "locationId": "loc_123",
      "condition": "good",
      "notes": "Additional item received"
    }
  ]
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "grni_124",
        "item": {
          "id": "item_124",
          "sku": "SKU002",
          "name": "Tea Bags",
          "unit": "box"
        },
        "receivedQuantity": 50,
        "unitPrice": 2.50,
        "totalPrice": 125.00,
        "currency": "SGD",
        "condition": "good",
        "notes": "Additional item received"
      }
    ]
  },
  "message": "Items added to GRN successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### PUT /receiving/grns/{id}/items/{itemId}
Update a specific item in a GRN.

#### Request
```http
PUT /api/receiving/grns/grn_123/items/grni_123?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "receivedQuantity": 25,
  "condition": "good",
  "notes": "Quality checked - all good"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "item": {
      "id": "grni_123",
      "receivedQuantity": 25,
      "condition": "good",
      "notes": "Quality checked - all good",
      "totalPrice": 624.75,
      "variance": {
        "quantityVariance": 0,
        "hasVariance": false
      },
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  },
  "message": "GRN item updated successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### DELETE /receiving/grns/{id}/items/{itemId}
Remove an item from a GRN (only allowed in draft status).

#### Request
```http
DELETE /api/receiving/grns/grn_123/items/grni_123?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {},
  "message": "Item removed from GRN successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### GET /receiving/locations
Retrieve available receiving locations.

#### Request
```http
GET /api/receiving/locations?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| businessUnit | string | Filter by business unit |
| type | string | Filter by location type (warehouse, store, kitchen) |
| active | boolean | Filter by active status |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "locations": [
      {
        "id": "loc_123",
        "name": "Main Store",
        "code": "MS001",
        "type": "store",
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        },
        "address": "123 Marina Bay, Singapore",
        "capacity": {
          "maxVolume": 1000.0,
          "currentVolume": 650.0,
          "unit": "cubic_meters"
        },
        "active": true,
        "manager": {
          "id": "user_789",
          "name": "Carol Manager"
        }
      }
    ]
  },
  "message": "Receiving locations retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Data Models

### GRN Object
```typescript
interface GRN {
  id: string;
  grnNumber: string;
  status: 'draft' | 'completed' | 'cancelled';
  purchaseOrder: {
    id: string;
    poNumber: string;
    orderDate: string;
  };
  businessUnit: {
    id: string;
    name: string;
  };
  vendor: {
    id: string;
    name: string;
    code: string;
  };
  deliveryNote?: string;
  deliveryDate: string;
  receivedBy: {
    id: string;
    name: string;
    email: string;
  };
  itemCount: number;
  totalValue: number;
  currency: string;
  notes?: string;
  attachments?: Attachment[];
  auditTrail?: AuditEntry[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  completedBy?: User;
  cancelledAt?: string;
  cancelledBy?: User;
  cancellationReason?: string;
  inventoryUpdated?: boolean;
}
```

### GRN Item Object
```typescript
interface GRNItem {
  id: string;
  purchaseOrderItem: {
    id: string;
    orderedQuantity: number;
    unitPrice: number;
  };
  item: {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category: string;
    unit: string;
    currentStock?: number;
  };
  receivedQuantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  location: {
    id: string;
    name: string;
    code: string;
  };
  condition: 'good' | 'damaged' | 'expired' | 'rejected';
  expiryDate?: string;
  batchNumber?: string;
  notes?: string;
  variance: {
    quantityVariance: number;
    priceVariance: number;
    hasVariance: boolean;
    varianceReason?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Purchase Order Object
```typescript
interface PurchaseOrder {
  id: string;
  poNumber: string;
  status: 'pending' | 'partial' | 'completed' | 'cancelled';
  vendor: {
    id: string;
    name: string;
    code: string;
    contact?: {
      email: string;
      phone: string;
    };
  };
  businessUnit: {
    id: string;
    name: string;
  };
  orderDate: string;
  expectedDeliveryDate: string;
  totalValue: number;
  currency: string;
  itemCount: number;
  receivedItemCount: number;
  receivingStatus: 'not_started' | 'in_progress' | 'completed';
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}
```

## Error Codes

### Receiving Specific Errors
| Code | Message | Description |
|------|---------|-------------|
| RCV_001 | Purchase order not found | The specified PO ID does not exist |
| RCV_002 | GRN not found | The specified GRN ID does not exist |
| RCV_003 | Cannot modify completed GRN | GRN cannot be modified after completion |
| RCV_004 | Invalid receiving quantity | Received quantity cannot exceed ordered quantity |
| RCV_005 | Location not available | The specified location is not available for receiving |
| RCV_006 | PO already fully received | Purchase order has been fully received |
| RCV_007 | Item not in purchase order | Item is not part of the specified purchase order |
| RCV_008 | Invalid item condition | Item condition must be one of: good, damaged, expired, rejected |
| RCV_009 | Duplicate GRN item | Item already exists in this GRN |
| RCV_010 | Inventory update failed | Failed to update inventory after GRN completion |
| RCV_011 | Invalid expiry date | Expiry date cannot be in the past |
| RCV_012 | Batch number required | Batch number is required for this item type |

## Rate Limiting
- **Standard endpoints**: 100 requests per minute per user
- **Bulk operations**: 10 requests per minute per user
- **File uploads**: 5 requests per minute per user

## Webhooks
Receiving API supports webhooks for real-time notifications:

### Supported Events
- `grn.created`
- `grn.updated`
- `grn.completed`
- `grn.cancelled`
- `grn.item_added`
- `grn.item_updated`
- `grn.item_removed`
- `purchase_order.receiving_started`
- `purchase_order.fully_received`

### Webhook Payload Example
```json
{
  "event": "grn.completed",
  "timestamp": "2024-01-15T11:30:00Z",
  "data": {
    "grn": {
      "id": "grn_123",
      "grnNumber": "GRN-2024-001",
      "status": "completed",
      "totalValue": 624.75,
      "completedBy": {
        "id": "user_456",
        "name": "Bob Receiver"
      }
    }
  }
}
```