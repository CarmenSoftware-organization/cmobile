# Physical Count API

## Overview
The Physical Count API manages comprehensive inventory counting sessions, item tracking, variance analysis, and approval workflows for complete location-based stock verification in the Carmen Supply Chain application.

## Base URL
```
/api/physical-count
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
GET /api/physical-count/sessions?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### GET /physical-count/sessions
Retrieve physical count sessions with filtering and pagination.

#### Request
```http
GET /api/physical-count/sessions?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 25, max: 100) |
| status | string | Filter by status (draft, in-progress, review, completed, cancelled) |
| location | string | Filter by location ID |
| businessUnit | string | Filter by business unit |
| period | string | Filter by counting period (YYYY-MM) |
| assignedTo | string | Filter by assigned user |
| dateFrom | string | Filter by date range (ISO 8601) |
| dateTo | string | Filter by date range (ISO 8601) |
| sort | string | Sort field (date, progress, location) |
| order | string | Sort order (asc, desc) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "pc_session_001",
        "name": "Main Store - January 2024",
        "description": "Monthly physical count for main storage location",
        "status": "in-progress",
        "type": "scheduled",
        "period": {
          "id": "period_2024_01",
          "name": "January 2024",
          "startDate": "2024-01-01T00:00:00Z",
          "endDate": "2024-01-31T23:59:59Z"
        },
        "location": {
          "id": "loc_001",
          "name": "Main Store",
          "type": "storage",
          "businessUnit": {
            "id": "bu_12345",
            "name": "Grand Hotel Singapore"
          }
        },
        "progress": {
          "totalItems": 150,
          "countedItems": 98,
          "percentage": 65.3,
          "varianceItems": 12,
          "accuracyRate": 87.8
        },
        "assignedUsers": [
          {
            "id": "user_123",
            "name": "John Doe",
            "role": "Store Clerk"
          },
          {
            "id": "user_456",
            "name": "Jane Smith",
            "role": "Store Manager"
          }
        ],
        "scheduledDate": "2024-01-15T09:00:00Z",
        "startedAt": "2024-01-15T09:15:00Z",
        "expectedCompletionDate": "2024-01-17T17:00:00Z",
        "lastActivity": "2024-01-15T14:30:00Z",
        "createdBy": {
          "id": "user_789",
          "name": "Inventory Manager"
        },
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-15T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 50,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "totalSessions": 50,
      "activeSessions": 8,
      "completedSessions": 35,
      "pendingSessions": 7,
      "averageAccuracy": 92.5,
      "totalVariances": 245
    }
  }
}
```

### POST /physical-count/sessions
Create a new physical count session.

#### Request
```http
POST /api/physical-count/sessions?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Kitchen Store - January 2024",
  "description": "Monthly physical count for kitchen storage area",
  "type": "scheduled",
  "locationId": "loc_002",
  "periodId": "period_2024_01",
  "scheduledDate": "2024-01-20T09:00:00Z",
  "expectedCompletionDate": "2024-01-22T17:00:00Z",
  "assignedUsers": ["user_123", "user_456"],
  "instructions": "Count all items in designated zones. Pay special attention to perishable items.",
  "countingMethod": "blind",
  "includeCategories": ["cat_001", "cat_002"],
  "excludeCategories": [],
  "includeZones": ["zone_001", "zone_002"],
  "businessUnit": "bu_12345",
  "tags": ["monthly", "kitchen", "perishables"]
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "session": {
      "id": "pc_session_002",
      "name": "Kitchen Store - January 2024",
      "status": "draft",
      "location": {
        "id": "loc_002",
        "name": "Kitchen Store"
      },
      "progress": {
        "totalItems": 89,
        "countedItems": 0,
        "percentage": 0
      },
      "scheduledDate": "2024-01-20T09:00:00Z",
      "createdAt": "2024-01-15T15:00:00Z",
      "createdBy": {
        "id": "user_789",
        "name": "Inventory Manager"
      }
    }
  },
  "message": "Physical count session created successfully"
}
```

### GET /physical-count/sessions/{id}
Get detailed information for a specific physical count session.

#### Request
```http
GET /api/physical-count/sessions/pc_session_001?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "session": {
      "id": "pc_session_001",
      "name": "Main Store - January 2024",
      "description": "Monthly physical count for main storage location",
      "status": "in-progress",
      "type": "scheduled",
      "countingMethod": "blind",
      "period": {
        "id": "period_2024_01",
        "name": "January 2024",
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-01-31T23:59:59Z",
        "isOpen": true
      },
      "location": {
        "id": "loc_001",
        "name": "Main Store",
        "type": "storage",
        "address": "Basement Level 1, Storage Room A",
        "zones": [
          {
            "id": "zone_001",
            "name": "Dry Goods",
            "itemCount": 75,
            "countedItems": 50
          },
          {
            "id": "zone_002",
            "name": "Refrigerated",
            "itemCount": 75,
            "countedItems": 48
          }
        ],
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        }
      },
      "progress": {
        "totalItems": 150,
        "countedItems": 98,
        "uncountedItems": 52,
        "percentage": 65.3,
        "varianceItems": 12,
        "accurateItems": 86,
        "accuracyRate": 87.8,
        "positiveVariances": 5,
        "negativeVariances": 7,
        "zeroVariances": 86
      },
      "statistics": {
        "totalValue": {
          "system": 125000.50,
          "actual": 123500.75,
          "variance": -1499.75,
          "currency": "SGD"
        },
        "categoryBreakdown": [
          {
            "categoryId": "cat_001",
            "categoryName": "Beverages",
            "totalItems": 45,
            "countedItems": 30,
            "varianceItems": 5,
            "accuracyRate": 83.3
          },
          {
            "categoryId": "cat_002",
            "categoryName": "Food Items",
            "totalItems": 105,
            "countedItems": 68,
            "varianceItems": 7,
            "accuracyRate": 89.7
          }
        ]
      },
      "assignedUsers": [
        {
          "id": "user_123",
          "name": "John Doe",
          "role": "Store Clerk",
          "assignedZones": ["zone_001"],
          "itemsCounted": 50,
          "lastActivity": "2024-01-15T14:30:00Z"
        },
        {
          "id": "user_456",
          "name": "Jane Smith",
          "role": "Store Manager",
          "assignedZones": ["zone_002"],
          "itemsCounted": 48,
          "lastActivity": "2024-01-15T14:15:00Z"
        }
      ],
      "timeline": {
        "scheduledDate": "2024-01-15T09:00:00Z",
        "startedAt": "2024-01-15T09:15:00Z",
        "expectedCompletionDate": "2024-01-17T17:00:00Z",
        "estimatedCompletionDate": "2024-01-16T15:30:00Z",
        "completedAt": null
      },
      "instructions": "Count all items in designated zones. Pay special attention to expiry dates.",
      "tags": ["monthly", "main-store", "scheduled"],
      "attachments": [
        {
          "id": "att_001",
          "filename": "counting-instructions.pdf",
          "size": 512000,
          "uploadedAt": "2024-01-10T10:30:00Z"
        }
      ],
      "createdBy": {
        "id": "user_789",
        "name": "Inventory Manager"
      },
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-15T14:30:00Z"
    }
  }
}
```

### PUT /physical-count/sessions/{id}
Update a physical count session.

#### Request
```http
PUT /api/physical-count/sessions/pc_session_001?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Main Store - January 2024 (Updated)",
  "description": "Updated monthly physical count for main storage location",
  "expectedCompletionDate": "2024-01-18T17:00:00Z",
  "assignedUsers": ["user_123", "user_456", "user_999"],
  "instructions": "Updated counting instructions with special focus on high-value items",
  "tags": ["monthly", "main-store", "scheduled", "high-priority"]
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "session": {
      "id": "pc_session_001",
      "name": "Main Store - January 2024 (Updated)",
      "expectedCompletionDate": "2024-01-18T17:00:00Z",
      "assignedUsers": [
        {
          "id": "user_123",
          "name": "John Doe"
        },
        {
          "id": "user_456",
          "name": "Jane Smith"
        },
        {
          "id": "user_999",
          "name": "Additional Counter"
        }
      ],
      "updatedAt": "2024-01-15T16:00:00Z"
    }
  },
  "message": "Physical count session updated successfully"
}
```

### POST /physical-count/sessions/{id}/start
Start a physical count session.

#### Request
```http
POST /api/physical-count/sessions/pc_session_001/start?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "startDate": "2024-01-15T09:00:00Z",
  "notes": "Starting count as scheduled. All team members present."
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "session": {
      "id": "pc_session_001",
      "status": "in-progress",
      "startedAt": "2024-01-15T09:00:00Z",
      "items": [
        {
          "id": "pci_001",
          "itemId": "item_123",
          "sku": "SKU001",
          "name": "Premium Coffee Beans",
          "systemQuantity": 50,
          "unit": "kg",
          "location": "zone_001",
          "status": "pending"
        }
      ]
    }
  },
  "message": "Physical count session started successfully"
}
```

### GET /physical-count/sessions/{id}/items
Get items for a physical count session.

#### Request
```http
GET /api/physical-count/sessions/pc_session_001/items?version=latest
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
        "id": "pci_001",
        "itemId": "item_123",
        "sku": "SKU001",
        "name": "Premium Coffee Beans",
        "description": "High-quality arabica coffee beans",
        "category": {
          "id": "cat_001",
          "name": "Beverages"
        },
        "systemQuantity": 50,
        "actualQuantity": null,
        "variance": 0,
        "unit": "kg",
        "availableUnits": ["kg", "g", "bag"],
        "location": {
          "zone": "zone_001",
          "shelf": "A-01",
          "bin": "001"
        },
        "status": "pending",
        "countedBy": null,
        "countedAt": null,
        "notes": "",
        "attachments": [],
        "lastSystemUpdate": "2024-01-14T10:00:00Z",
        "estimatedValue": {
          "unitPrice": 24.99,
          "systemValue": 1249.50,
          "actualValue": null,
          "currency": "SGD"
        }
      },
      {
        "id": "pci_002",
        "itemId": "item_124",
        "sku": "SKU002",
        "name": "Olive Oil",
        "description": "Extra virgin olive oil",
        "category": {
          "id": "cat_002",
          "name": "Food Items"
        },
        "systemQuantity": 20,
        "actualQuantity": 18,
        "variance": -2,
        "unit": "bottle",
        "availableUnits": ["bottle", "L", "mL"],
        "location": {
          "zone": "zone_001",
          "shelf": "A-02",
          "bin": "005"
        },
        "status": "counted",
        "countedBy": {
          "id": "user_123",
          "name": "John Doe"
        },
        "countedAt": "2024-01-15T10:30:00Z",
        "notes": "2 bottles missing - possible breakage",
        "attachments": [
          {
            "id": "att_002",
            "type": "photo",
            "filename": "olive-oil-count.jpg",
            "url": "https://cdn.carmen-supply.com/count-photos/olive-oil.jpg"
          }
        ],
        "lastSystemUpdate": "2024-01-14T10:00:00Z",
        "estimatedValue": {
          "unitPrice": 15.50,
          "systemValue": 310.00,
          "actualValue": 279.00,
          "currency": "SGD"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 150,
      "totalPages": 6
    },
    "summary": {
      "totalItems": 150,
      "countedItems": 98,
      "pendingItems": 52,
      "varianceItems": 12,
      "accuracyRate": 87.8
    }
  }
}
```

### PUT /physical-count/sessions/{id}/items
Update item counts in a physical count session.

#### Request
```http
PUT /api/physical-count/sessions/pc_session_001/items?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "items": [
    {
      "id": "pci_001",
      "actualQuantity": 48,
      "unit": "kg",
      "notes": "Found 2kg less than system quantity",
      "countedAt": "2024-01-15T11:00:00Z",
      "attachments": [
        {
          "type": "photo",
          "filename": "coffee-beans-count.jpg",
          "content": "base64_encoded_image_data",
          "contentType": "image/jpeg"
        }
      ]
    },
    {
      "id": "pci_003",
      "actualQuantity": 25,
      "unit": "bottle",
      "notes": "Count verified twice",
      "countedAt": "2024-01-15T11:15:00Z"
    }
  ],
  "batchUpdate": true,
  "autoSave": true
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "updatedItems": [
      {
        "id": "pci_001",
        "itemId": "item_123",
        "sku": "SKU001",
        "systemQuantity": 50,
        "actualQuantity": 48,
        "variance": -2,
        "status": "counted",
        "countedBy": {
          "id": "user_123",
          "name": "John Doe"
        },
        "countedAt": "2024-01-15T11:00:00Z"
      }
    ],
    "sessionProgress": {
      "totalItems": 150,
      "countedItems": 100,
      "percentage": 66.7,
      "varianceItems": 13
    }
  },
  "message": "Item counts updated successfully"
}
```

### POST /physical-count/sessions/{id}/submit
Submit physical count session for review.

#### Request
```http
POST /api/physical-count/sessions/pc_session_001/submit?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "completedAt": "2024-01-16T16:00:00Z",
  "finalNotes": "Count completed successfully. All variances documented with photos.",
  "reviewRequired": true,
  "submitToApproval": true,
  "notifyReviewers": ["user_789", "user_101"]
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "session": {
      "id": "pc_session_001",
      "status": "review",
      "completedAt": "2024-01-16T16:00:00Z",
      "submittedBy": {
        "id": "user_123",
        "name": "John Doe"
      },
      "submittedAt": "2024-01-16T16:05:00Z",
      "reviewers": [
        {
          "id": "user_789",
          "name": "Inventory Manager",
          "role": "reviewer"
        }
      ]
    },
    "summary": {
      "totalItems": 150,
      "countedItems": 150,
      "varianceItems": 15,
      "accuracyRate": 90.0,
      "totalVarianceValue": -1250.00,
      "currency": "SGD"
    }
  },
  "message": "Physical count session submitted for review"
}
```

### POST /physical-count/sessions/{id}/approve
Approve a physical count session.

#### Request
```http
POST /api/physical-count/sessions/pc_session_001/approve?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "approvalComments": "Count results reviewed and approved. Variances are within acceptable limits.",
  "adjustInventory": true,
  "approveVariances": [
    {
      "itemId": "pci_001",
      "approved": true,
      "adjustmentReason": "Physical count variance"
    }
  ],
  "postToInventory": true
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "session": {
      "id": "pc_session_001",
      "status": "completed",
      "approvedBy": {
        "id": "user_789",
        "name": "Inventory Manager"
      },
      "approvedAt": "2024-01-16T17:00:00Z",
      "inventoryAdjustments": [
        {
          "itemId": "item_123",
          "adjustmentId": "adj_001",
          "oldQuantity": 50,
          "newQuantity": 48,
          "variance": -2,
          "posted": true
        }
      ]
    }
  },
  "message": "Physical count session approved and inventory adjusted"
}
```

## Data Models

### Physical Count Session
```typescript
interface PhysicalCountSession {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  type: 'scheduled' | 'ad-hoc' | 'cycle' | 'audit';
  countingMethod: 'blind' | 'visible' | 'perpetual';
  period: CountingPeriod;
  location: Location;
  progress: SessionProgress;
  assignedUsers: AssignedUser[];
  timeline: SessionTimeline;
  instructions: string;
  tags: string[];
  attachments: Attachment[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}
```

### Physical Count Item
```typescript
interface PhysicalCountItem {
  id: string;
  itemId: string;
  sku: string;
  name: string;
  description: string;
  category: Category;
  systemQuantity: number;
  actualQuantity: number | null;
  variance: number;
  unit: string;
  availableUnits: string[];
  location: ItemLocation;
  status: 'pending' | 'counted' | 'verified' | 'adjusted';
  countedBy: User | null;
  countedAt: string | null;
  notes: string;
  attachments: Attachment[];
  estimatedValue: ValueInfo;
  lastSystemUpdate: string;
}
```

### Session Progress
```typescript
interface SessionProgress {
  totalItems: number;
  countedItems: number;
  uncountedItems: number;
  percentage: number;
  varianceItems: number;
  accurateItems: number;
  accuracyRate: number;
  positiveVariances: number;
  negativeVariances: number;
  zeroVariances: number;
}
```

## Error Codes

| Code | Description |
|------|-------------|
| PC_001 | Session not found |
| PC_002 | Invalid session status |
| PC_003 | Item not found in session |
| PC_004 | Invalid count data |
| PC_005 | Session already started |
| PC_006 | Insufficient permissions |
| PC_007 | Period not open |
| PC_008 | Location not available |
| PC_009 | User not assigned |
| PC_010 | Variance threshold exceeded |

## Business Rules

### Session Management
- Only one active session per location
- Sessions must be within open periods
- Assigned users must have location access
- Draft sessions can be modified

### Counting Rules
- Blind counts hide system quantities
- All items must be counted before submission
- Variances require documentation
- Photos required for significant variances

### Approval Process
- Review required for variance > 5%
- Manager approval for value variance > $1000
- Automatic inventory adjustment on approval
- Audit trail maintained for all changes

## Examples

### Create Count Session
```typescript
const createCountSession = async (sessionData: CreateSessionRequest) => {
  const response = await fetch('/api/physical-count/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sessionData)
  });
  
  return response.json();
};
```

### Update Item Counts
```typescript
const updateItemCounts = async (sessionId: string, items: CountUpdate[]) => {
  const response = await fetch(`/api/physical-count/sessions/${sessionId}/items`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items,
      batchUpdate: true,
      autoSave: true
    })
  });
  
  return response.json();
};
```

### Submit for Review
```typescript
const submitForReview = async (sessionId: string) => {
  const response = await fetch(`/api/physical-count/sessions/${sessionId}/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      completedAt: new Date().toISOString(),
      reviewRequired: true,
      submitToApproval: true
    })
  });
  
  return response.json();
};
```