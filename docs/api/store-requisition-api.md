# Store Requisition API

## Overview
The Store Requisition API manages store requisition requests, workflow processing, approvals, and fulfillment tracking for the Carmen Supply Chain application. This API handles the complete lifecycle of store requisitions from creation to completion.

## Base URL
```
/api/store-requisition
```

## Endpoints

### GET /store-requisitions
Retrieve store requisitions with filtering and pagination.

#### Request
```http
GET /api/store-requisition?page=1&limit=25&status=pending&department=F&B&businessUnit=bu_12345
Authorization: Bearer <access_token>
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 25, max: 100) |
| status | string | Filter by status (draft, pending, approved, rejected, fulfilled, cancelled) |
| department | string | Filter by requesting department |
| businessUnit | string | Filter by business unit |
| requester | string | Filter by requester user ID |
| dateFrom | string | Filter from date (ISO 8601) |
| dateTo | string | Filter to date (ISO 8601) |
| jobCode | string | Filter by job code |
| marketSegment | string | Filter by market segment |
| priority | string | Filter by priority (low, medium, high, urgent) |
| sort | string | Sort field (date, number, status, department) |
| order | string | Sort order (asc, desc) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "storeRequisitions": [
      {
        "id": "sr_123",
        "number": "SR-001",
        "status": "pending",
        "workflowStage": 1,
        "department": "F&B",
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        },
        "requester": {
          "id": "user_123",
          "name": "Alice Lee",
          "email": "alice.lee@carmen.com"
        },
        "requestDate": "2024-01-15T10:30:00Z",
        "requiredDate": "2024-01-20T00:00:00Z",
        "jobCode": "JC-2025-001",
        "marketSegment": "F&B",
        "event": "Annual Gala Dinner",
        "priority": "medium",
        "itemCount": 5,
        "totalValue": 1250.00,
        "currency": "SGD",
        "notes": "For weekend coffee service",
        "attachments": [
          {
            "id": "att_123",
            "name": "menu_requirements.pdf",
            "url": "/api/v1/attachments/att_123",
            "size": 245760,
            "type": "application/pdf"
          }
        ],
        "workflow": {
          "currentStage": 1,
          "stages": [
            {
              "id": 0,
              "name": "Draft",
              "status": "completed",
              "completedAt": "2024-01-15T10:30:00Z",
              "completedBy": "user_123"
            },
            {
              "id": 1,
              "name": "Department Approval",
              "status": "pending",
              "assignedTo": "user_456",
              "dueDate": "2024-01-17T23:59:59Z"
            }
          ]
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 150,
      "pages": 6
    },
    "summary": {
      "totalCount": 150,
      "statusCounts": {
        "draft": 12,
        "pending": 45,
        "approved": 78,
        "rejected": 8,
        "fulfilled": 5,
        "cancelled": 2
      }
    }
  },
  "message": "Store requisitions retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /store-requisitions/{id}
Retrieve a specific store requisition by ID.

#### Request
```http
GET /api/store-requisition/sr_123
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "storeRequisition": {
      "id": "sr_123",
      "number": "SR-001",
      "status": "pending",
      "workflowStage": 1,
      "department": "F&B",
      "businessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "requester": {
        "id": "user_123",
        "name": "Alice Lee",
        "email": "alice.lee@carmen.com",
        "department": "F&B"
      },
      "requestDate": "2024-01-15T10:30:00Z",
      "requiredDate": "2024-01-20T00:00:00Z",
      "jobCode": "JC-2025-001",
      "marketSegment": "F&B",
      "event": "Annual Gala Dinner",
      "priority": "medium",
      "notes": "For weekend coffee service",
      "items": [
        {
          "id": "sri_123",
          "item": {
            "id": "item_123",
            "sku": "SKU001",
            "name": "Premium Coffee Beans",
            "description": "High-quality arabica coffee beans",
            "category": "Beverages",
            "unit": "kg"
          },
          "requestedQuantity": 25,
          "approvedQuantity": null,
          "unitCost": 24.99,
          "totalCost": 624.75,
          "currency": "SGD",
          "notes": "Premium grade required",
          "status": "pending"
        }
      ],
      "totalValue": 1250.00,
      "currency": "SGD",
      "attachments": [
        {
          "id": "att_123",
          "name": "menu_requirements.pdf",
          "url": "/api/v1/attachments/att_123",
          "size": 245760,
          "type": "application/pdf",
          "uploadedBy": "user_123",
          "uploadedAt": "2024-01-15T10:30:00Z"
        }
      ],
      "workflow": {
        "currentStage": 1,
        "stages": [
          {
            "id": 0,
            "name": "Draft",
            "status": "completed",
            "completedAt": "2024-01-15T10:30:00Z",
            "completedBy": {
              "id": "user_123",
              "name": "Alice Lee"
            },
            "comments": "Initial request created"
          },
          {
            "id": 1,
            "name": "Department Approval",
            "status": "pending",
            "assignedTo": {
              "id": "user_456",
              "name": "Bob Manager",
              "role": "Department Head"
            },
            "dueDate": "2024-01-17T23:59:59Z"
          }
        ]
      },
      "auditTrail": [
        {
          "id": "audit_123",
          "action": "created",
          "performedBy": {
            "id": "user_123",
            "name": "Alice Lee"
          },
          "timestamp": "2024-01-15T10:30:00Z",
          "details": "Store requisition created"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Store requisition retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /store-requisitions
Create a new store requisition.

#### Request
```http
POST /api/store-requisition
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "department": "F&B",
  "businessUnitId": "bu_12345",
  "requiredDate": "2024-01-20T00:00:00Z",
  "jobCode": "JC-2025-001",
  "marketSegment": "F&B",
  "event": "Annual Gala Dinner",
  "priority": "medium",
  "notes": "For weekend coffee service",
  "items": [
    {
      "itemId": "item_123",
      "requestedQuantity": 25,
      "unitCost": 24.99,
      "notes": "Premium grade required"
    },
    {
      "itemId": "item_124",
      "requestedQuantity": 100,
      "unitCost": 2.50,
      "notes": "Standard quality"
    }
  ],
  "attachments": ["att_123", "att_124"]
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "storeRequisition": {
      "id": "sr_123",
      "number": "SR-001",
      "status": "draft",
      "workflowStage": 0,
      "department": "F&B",
      "businessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "requester": {
        "id": "user_123",
        "name": "Alice Lee"
      },
      "requestDate": "2024-01-15T10:30:00Z",
      "requiredDate": "2024-01-20T00:00:00Z",
      "jobCode": "JC-2025-001",
      "marketSegment": "F&B",
      "event": "Annual Gala Dinner",
      "priority": "medium",
      "itemCount": 2,
      "totalValue": 874.75,
      "currency": "SGD",
      "notes": "For weekend coffee service",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Store requisition created successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### PUT /store-requisitions/{id}
Update an existing store requisition (only allowed in draft status).

#### Request
```http
PUT /api/store-requisition/sr_123
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "requiredDate": "2024-01-22T00:00:00Z",
  "priority": "high",
  "notes": "Updated requirements for weekend coffee service",
  "items": [
    {
      "id": "sri_123",
      "requestedQuantity": 30,
      "notes": "Increased quantity needed"
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
    "storeRequisition": {
      "id": "sr_123",
      "number": "SR-001",
      "status": "draft",
      "workflowStage": 0,
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  },
  "message": "Store requisition updated successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### POST /store-requisitions/{id}/submit
Submit a store requisition for approval.

#### Request
```http
POST /api/store-requisition/sr_123/submit
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "comments": "Ready for department approval"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "storeRequisition": {
      "id": "sr_123",
      "status": "pending",
      "workflowStage": 1,
      "workflow": {
        "currentStage": 1,
        "nextApprover": {
          "id": "user_456",
          "name": "Bob Manager",
          "role": "Department Head"
        }
      }
    }
  },
  "message": "Store requisition submitted for approval",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### POST /store-requisitions/{id}/approve
Approve a store requisition (requires appropriate permissions).

#### Request
```http
POST /api/store-requisition/sr_123/approve
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "comments": "Approved for procurement",
  "itemApprovals": [
    {
      "itemId": "sri_123",
      "approvedQuantity": 25,
      "comments": "Approved as requested"
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
    "storeRequisition": {
      "id": "sr_123",
      "status": "approved",
      "workflowStage": 2,
      "workflow": {
        "currentStage": 2,
        "approvedAt": "2024-01-16T09:00:00Z",
        "approvedBy": {
          "id": "user_456",
          "name": "Bob Manager"
        }
      }
    }
  },
  "message": "Store requisition approved successfully",
  "timestamp": "2024-01-16T09:00:00Z"
}
```

### POST /store-requisitions/{id}/reject
Reject a store requisition.

#### Request
```http
POST /api/store-requisition/sr_123/reject
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "reason": "Insufficient budget allocation",
  "comments": "Please revise quantities and resubmit"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "storeRequisition": {
      "id": "sr_123",
      "status": "rejected",
      "rejectedAt": "2024-01-16T09:00:00Z",
      "rejectedBy": {
        "id": "user_456",
        "name": "Bob Manager"
      },
      "rejectionReason": "Insufficient budget allocation"
    }
  },
  "message": "Store requisition rejected",
  "timestamp": "2024-01-16T09:00:00Z"
}
```

### POST /store-requisitions/{id}/cancel
Cancel a store requisition.

#### Request
```http
POST /api/store-requisition/sr_123/cancel
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "reason": "Event cancelled",
  "comments": "Annual Gala Dinner has been postponed"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "storeRequisition": {
      "id": "sr_123",
      "status": "cancelled",
      "cancelledAt": "2024-01-16T09:00:00Z",
      "cancelledBy": {
        "id": "user_123",
        "name": "Alice Lee"
      },
      "cancellationReason": "Event cancelled"
    }
  },
  "message": "Store requisition cancelled",
  "timestamp": "2024-01-16T09:00:00Z"
}
```

### GET /store-requisitions/{id}/items
Retrieve items for a specific store requisition.

#### Request
```http
GET /api/store-requisition/sr_123/items
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "sri_123",
        "item": {
          "id": "item_123",
          "sku": "SKU001",
          "name": "Premium Coffee Beans",
          "description": "High-quality arabica coffee beans",
          "category": "Beverages",
          "unit": "kg",
          "currentStock": 45.5,
          "reorderLevel": 20.0
        },
        "requestedQuantity": 25,
        "approvedQuantity": 25,
        "fulfilledQuantity": 0,
        "unitCost": 24.99,
        "totalCost": 624.75,
        "currency": "SGD",
        "notes": "Premium grade required",
        "status": "approved"
      }
    ],
    "summary": {
      "totalItems": 1,
      "totalValue": 624.75,
      "currency": "SGD"
    }
  },
  "message": "Store requisition items retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /store-requisitions/{id}/items
Add items to a store requisition (only allowed in draft status).

#### Request
```http
POST /api/store-requisition/sr_123/items
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "items": [
    {
      "itemId": "item_125",
      "requestedQuantity": 50,
      "unitCost": 1.25,
      "notes": "Additional requirement"
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
        "id": "sri_124",
        "item": {
          "id": "item_125",
          "sku": "SKU003",
          "name": "Paper Cups",
          "unit": "pack"
        },
        "requestedQuantity": 50,
        "unitCost": 1.25,
        "totalCost": 62.50,
        "currency": "SGD",
        "notes": "Additional requirement",
        "status": "draft"
      }
    ]
  },
  "message": "Items added to store requisition successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### PUT /store-requisitions/{id}/items/{itemId}
Update a specific item in a store requisition.

#### Request
```http
PUT /api/store-requisition/sr_123/items/sri_123
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "requestedQuantity": 30,
  "unitCost": 25.99,
  "notes": "Updated quantity and pricing"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "item": {
      "id": "sri_123",
      "requestedQuantity": 30,
      "unitCost": 25.99,
      "totalCost": 779.70,
      "notes": "Updated quantity and pricing",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  },
  "message": "Store requisition item updated successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### DELETE /store-requisitions/{id}/items/{itemId}
Remove an item from a store requisition (only allowed in draft status).

#### Request
```http
DELETE /api/store-requisition/sr_123/items/sri_123
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {},
  "message": "Item removed from store requisition successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### GET /store-requisitions/{id}/workflow
Retrieve workflow history and current status for a store requisition.

#### Request
```http
GET /api/store-requisition/sr_123/workflow
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "workflow": {
      "currentStage": 1,
      "status": "pending",
      "stages": [
        {
          "id": 0,
          "name": "Draft",
          "status": "completed",
          "completedAt": "2024-01-15T10:30:00Z",
          "completedBy": {
            "id": "user_123",
            "name": "Alice Lee"
          },
          "comments": "Initial request created",
          "duration": "00:30:00"
        },
        {
          "id": 1,
          "name": "Department Approval",
          "status": "pending",
          "assignedTo": {
            "id": "user_456",
            "name": "Bob Manager",
            "role": "Department Head",
            "email": "bob.manager@carmen.com"
          },
          "startedAt": "2024-01-15T11:00:00Z",
          "dueDate": "2024-01-17T23:59:59Z",
          "escalationDate": "2024-01-18T09:00:00Z"
        }
      ],
      "nextStages": [
        {
          "id": 2,
          "name": "Procurement",
          "assignedTo": {
            "id": "user_789",
            "name": "Carol Buyer",
            "role": "Procurement Officer"
          }
        }
      ]
    }
  },
  "message": "Store requisition workflow retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /store-requisitions/{id}/audit-trail
Retrieve audit trail for a store requisition.

#### Request
```http
GET /api/store-requisition/sr_123/audit-trail
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "auditTrail": [
      {
        "id": "audit_123",
        "action": "created",
        "performedBy": {
          "id": "user_123",
          "name": "Alice Lee",
          "email": "alice.lee@carmen.com"
        },
        "timestamp": "2024-01-15T10:30:00Z",
        "details": "Store requisition created",
        "changes": {
          "status": {
            "from": null,
            "to": "draft"
          }
        },
        "ipAddress": "192.168.1.100",
        "userAgent": "Carmen Mobile App v1.0"
      },
      {
        "id": "audit_124",
        "action": "submitted",
        "performedBy": {
          "id": "user_123",
          "name": "Alice Lee"
        },
        "timestamp": "2024-01-15T11:00:00Z",
        "details": "Store requisition submitted for approval",
        "changes": {
          "status": {
            "from": "draft",
            "to": "pending"
          },
          "workflowStage": {
            "from": 0,
            "to": 1
          }
        },
        "ipAddress": "192.168.1.100",
        "userAgent": "Carmen Mobile App v1.0"
      }
    ]
  },
  "message": "Audit trail retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Data Models

### Store Requisition Object
```typescript
interface StoreRequisition {
  id: string;
  number: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled';
  workflowStage: number;
  department: string;
  businessUnit: {
    id: string;
    name: string;
  };
  requester: {
    id: string;
    name: string;
    email: string;
    department?: string;
  };
  requestDate: string;
  requiredDate: string;
  jobCode?: string;
  marketSegment?: string;
  event?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  itemCount: number;
  totalValue: number;
  currency: string;
  notes?: string;
  attachments?: Attachment[];
  workflow: WorkflowStatus;
  auditTrail?: AuditEntry[];
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: User;
  rejectedAt?: string;
  rejectedBy?: User;
  rejectionReason?: string;
  cancelledAt?: string;
  cancelledBy?: User;
  cancellationReason?: string;
}
```

### Store Requisition Item Object
```typescript
interface StoreRequisitionItem {
  id: string;
  item: {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category: string;
    unit: string;
    currentStock?: number;
    reorderLevel?: number;
  };
  requestedQuantity: number;
  approvedQuantity?: number;
  fulfilledQuantity?: number;
  unitCost: number;
  totalCost: number;
  currency: string;
  notes?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'fulfilled';
  createdAt: string;
  updatedAt: string;
}
```

### Workflow Status Object
```typescript
interface WorkflowStatus {
  currentStage: number;
  stages: WorkflowStage[];
  nextStages?: WorkflowStage[];
}

interface WorkflowStage {
  id: number;
  name: string;
  status: 'pending' | 'completed' | 'rejected' | 'cancelled';
  assignedTo?: User;
  startedAt?: string;
  completedAt?: string;
  completedBy?: User;
  dueDate?: string;
  escalationDate?: string;
  comments?: string;
  duration?: string;
}
```

## Error Codes

### Store Requisition Specific Errors
| Code | Message | Description |
|------|---------|-------------|
| SR_001 | Store requisition not found | The specified store requisition ID does not exist |
| SR_002 | Invalid status transition | The requested status change is not allowed |
| SR_003 | Insufficient permissions | User lacks permission to perform this action |
| SR_004 | Cannot modify submitted requisition | Requisition cannot be modified after submission |
| SR_005 | Invalid workflow stage | The workflow stage is invalid for this action |
| SR_006 | Item not found | The specified item ID does not exist in this requisition |
| SR_007 | Duplicate item | Item already exists in this requisition |
| SR_008 | Invalid quantity | Requested quantity must be greater than zero |
| SR_009 | Budget limit exceeded | Total value exceeds department budget limit |
| SR_010 | Required date in past | Required date cannot be in the past |
| SR_011 | Invalid job code | Job code format is invalid or not found |
| SR_012 | Approval deadline exceeded | Approval deadline has passed |

## Rate Limiting
- **Standard endpoints**: 100 requests per minute per user
- **Bulk operations**: 10 requests per minute per user
- **File uploads**: 5 requests per minute per user

## Webhooks
Store Requisition API supports webhooks for real-time notifications:

### Supported Events
- `store_requisition.created`
- `store_requisition.submitted`
- `store_requisition.approved`
- `store_requisition.rejected`
- `store_requisition.cancelled`
- `store_requisition.fulfilled`
- `store_requisition.item_added`
- `store_requisition.item_updated`
- `store_requisition.item_removed`

### Webhook Payload Example
```json
{
  "event": "store_requisition.approved",
  "timestamp": "2024-01-16T09:00:00Z",
  "data": {
    "storeRequisition": {
      "id": "sr_123",
      "number": "SR-001",
      "status": "approved",
      "approvedBy": {
        "id": "user_456",
        "name": "Bob Manager"
      }
    }
  }
}
```