# Purchase Request API

## Overview
The Purchase Request API manages the complete purchase request lifecycle including creation, approval workflow, item management, vendor selection, and conversion to purchase orders.

## Base URL
```
/api/purchase-request
```

## Endpoints

### GET /purchase-requests
Retrieve purchase requests with filtering and pagination.

#### Request
```http
GET /api/purchase-request?page=1&limit=25&status=pending&department=F&B&businessUnit=bu_12345&workflowStage=1&version=latest
Authorization: Bearer <access_token>
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 25, max: 100) |
| status | string | Filter by status (draft, in-progress, completed, rejected, cancelled) |
| workflowStage | integer | Filter by workflow stage (0-4) |
| department | string | Filter by department |
| businessUnit | string | Filter by business unit |
| requestor | string | Filter by requestor |
| dateFrom | string | Filter by date range (ISO 8601) |
| dateTo | string | Filter by date range (ISO 8601) |
| priority | string | Filter by priority (low, medium, high) |
| sort | string | Sort field (date, value, status) |
| order | string | Sort order (asc, desc) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "purchaseRequests": [
      {
        "id": "pr_123",
        "number": "PR-2024-001",
        "title": "Kitchen Equipment Purchase",
        "description": "Purchase of new kitchen equipment for main restaurant",
        "status": "in-progress",
        "workflowStage": 1,
        "priority": "medium",
        "requestor": {
          "id": "user_123",
          "name": "John Doe",
          "department": "F&B",
          "email": "john.doe@hotel.com"
        },
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        },
        "department": "F&B",
        "requestDate": "2024-01-15T10:00:00Z",
        "requiredDate": "2024-02-01T00:00:00Z",
        "totalValue": {
          "amount": 15000.00,
          "currency": "SGD",
          "baseCurrency": "USD",
          "baseAmount": 11100.00,
          "exchangeRate": 0.74
        },
        "itemCount": 5,
        "approvalHistory": [
          {
            "stage": 0,
            "action": "submitted",
            "user": {
              "id": "user_123",
              "name": "John Doe"
            },
            "date": "2024-01-15T10:00:00Z",
            "comments": "Urgent requirement for new restaurant opening"
          }
        ],
        "currentApprover": {
          "id": "user_456",
          "name": "Jane Smith",
          "role": "HOD"
        },
        "tags": ["urgent", "equipment", "restaurant"],
        "attachments": [
          {
            "id": "att_001",
            "filename": "equipment-specs.pdf",
            "size": 1024000,
            "uploadedAt": "2024-01-15T10:05:00Z"
          }
        ],
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "lastAction": "Submitted for HOD Review"
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
      "totalRequests": 150,
      "pendingApproval": 25,
      "approved": 100,
      "rejected": 15,
      "totalValue": 2500000.00
    }
  }
}
```

### POST /purchase-requests
Create a new purchase request.

#### Request
```http
POST /api/purchase-request
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Office Supplies Purchase",
  "description": "Monthly office supplies for administration department",
  "department": "Administration",
  "businessUnit": "bu_12345",
  "requiredDate": "2024-02-01T00:00:00Z",
  "priority": "medium",
  "justification": "Regular monthly supplies for office operations",
  "budgetCode": "ADMIN-2024-001",
  "items": [
    {
      "itemId": "item_123",
      "sku": "SKU001",
      "name": "A4 Paper",
      "description": "White A4 copy paper, 80gsm",
      "quantity": 100,
      "unit": "ream",
      "estimatedPrice": 5.50,
      "currency": "SGD",
      "requiredDate": "2024-02-01T00:00:00Z",
      "justification": "Monthly paper requirement",
      "specifications": {
        "brand": "Any",
        "quality": "Standard",
        "packaging": "Ream of 500 sheets"
      },
      "preferredVendors": ["vendor_001", "vendor_002"]
    }
  ],
  "businessDimensions": {
    "projectCode": "PROJ-2024-001",
    "costCenter": "CC-ADMIN-001",
    "marketSegment": "Operations",
    "department": "Administration"
  },
  "attachments": [
    {
      "filename": "budget-approval.pdf",
      "content": "base64_encoded_content",
      "contentType": "application/pdf"
    }
  ],
  "tags": ["office", "supplies", "monthly"]
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "purchaseRequest": {
      "id": "pr_124",
      "number": "PR-2024-002",
      "title": "Office Supplies Purchase",
      "status": "draft",
      "workflowStage": 0,
      "requestor": {
        "id": "user_123",
        "name": "John Doe"
      },
      "totalValue": {
        "amount": 550.00,
        "currency": "SGD"
      },
      "itemCount": 1,
      "createdAt": "2024-01-15T11:00:00Z"
    }
  },
  "message": "Purchase request created successfully"
}
```

### GET /purchase-requests/{id}
Get detailed information for a specific purchase request.

#### Request
```http
GET /api/purchase-request/pr_123?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "purchaseRequest": {
      "id": "pr_123",
      "number": "PR-2024-001",
      "title": "Kitchen Equipment Purchase",
      "description": "Purchase of new kitchen equipment for main restaurant",
      "status": "in-progress",
      "workflowStage": 1,
      "priority": "medium",
      "requestor": {
        "id": "user_123",
        "name": "John Doe",
        "department": "F&B",
        "email": "john.doe@hotel.com"
      },
      "businessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "department": "F&B",
      "requestDate": "2024-01-15T10:00:00Z",
      "requiredDate": "2024-02-01T00:00:00Z",
      "justification": "Equipment replacement due to wear and tear",
      "budgetCode": "F&B-2024-EQUIP",
      "totalValue": {
        "amount": 15000.00,
        "currency": "SGD",
        "baseCurrency": "USD",
        "baseAmount": 11100.00,
        "exchangeRate": 0.74
      },
      "items": [
        {
          "id": "pri_001",
          "itemId": "item_456",
          "sku": "EQUIP001",
          "name": "Commercial Oven",
          "description": "6-burner commercial gas oven with convection",
          "quantity": 1,
          "unit": "unit",
          "estimatedPrice": 8000.00,
          "approvedPrice": null,
          "currency": "SGD",
          "requiredDate": "2024-02-01T00:00:00Z",
          "status": "pending",
          "justification": "Replace old oven that broke down",
          "specifications": {
            "brand": "Commercial Chef",
            "model": "CC-6B-CONV",
            "power": "Gas",
            "capacity": "6 burners + convection oven"
          },
          "preferredVendors": [
            {
              "vendorId": "vendor_001",
              "vendorName": "Kitchen Equipment Ltd",
              "price": 8000.00,
              "currency": "SGD",
              "leadTime": 14,
              "isPrimary": true
            }
          ],
          "approvalNotes": [],
          "attachments": [
            {
              "id": "att_002",
              "filename": "oven-specifications.pdf",
              "url": "https://cdn.carmen-supply.com/attachments/oven-specs.pdf"
            }
          ]
        }
      ],
      "workflowHistory": [
        {
          "stage": 0,
          "stageName": "Draft",
          "action": "created",
          "user": {
            "id": "user_123",
            "name": "John Doe",
            "role": "Requestor"
          },
          "date": "2024-01-15T10:00:00Z",
          "comments": "Initial PR creation"
        },
        {
          "stage": 0,
          "stageName": "Draft",
          "action": "submitted",
          "user": {
            "id": "user_123",
            "name": "John Doe",
            "role": "Requestor"
          },
          "date": "2024-01-15T10:30:00Z",
          "comments": "Submitted for HOD approval"
        }
      ],
      "currentStage": {
        "stage": 1,
        "stageName": "HOD Review",
        "assignedTo": {
          "id": "user_456",
          "name": "Jane Smith",
          "role": "HOD"
        },
        "dueDate": "2024-01-17T10:30:00Z",
        "actions": ["approve", "reject", "return"]
      },
      "businessDimensions": {
        "projectCode": "PROJ-2024-001",
        "costCenter": "CC-F&B-001",
        "marketSegment": "Restaurant",
        "event": "Restaurant Renovation",
        "department": "F&B"
      },
      "attachments": [
        {
          "id": "att_001",
          "filename": "budget-approval.pdf",
          "size": 1024000,
          "contentType": "application/pdf",
          "uploadedBy": "user_123",
          "uploadedAt": "2024-01-15T10:05:00Z",
          "url": "https://cdn.carmen-supply.com/attachments/budget-approval.pdf"
        }
      ],
      "tags": ["urgent", "equipment", "restaurant"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### PUT /purchase-requests/{id}
Update an existing purchase request.

#### Request
```http
PUT /api/purchase-request/pr_123?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Kitchen Equipment Purchase",
  "description": "Updated purchase of kitchen equipment",
  "requiredDate": "2024-02-15T00:00:00Z",
  "priority": "high",
  "items": [
    {
      "id": "pri_001",
      "quantity": 2,
      "estimatedPrice": 7500.00,
      "justification": "Need two ovens for increased capacity"
    }
  ],
  "updateReason": "Changed requirements based on kitchen layout review"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "purchaseRequest": {
      "id": "pr_123",
      "number": "PR-2024-001",
      "title": "Updated Kitchen Equipment Purchase",
      "status": "in-progress",
      "workflowStage": 1,
      "totalValue": {
        "amount": 15000.00,
        "currency": "SGD"
      },
      "updatedAt": "2024-01-15T11:30:00Z"
    }
  },
  "message": "Purchase request updated successfully"
}
```

### POST /purchase-requests/{id}/approve
Approve a purchase request at current workflow stage.

#### Request
```http
POST /api/purchase-request/pr_123/approve?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "comments": "Approved for kitchen renovation project",
  "conditions": [
    "Must obtain 3 quotes before purchase",
    "Installation must be completed by February 15th"
  ],
  "itemApprovals": [
    {
      "itemId": "pri_001",
      "approvedQuantity": 1,
      "approvedPrice": 7800.00,
      "selectedVendor": "vendor_001",
      "notes": "Approved with vendor selection"
    }
  ],
  "budgetApproval": {
    "budgetCode": "F&B-2024-EQUIP",
    "approvedAmount": 7800.00,
    "currency": "SGD"
  }
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "purchaseRequest": {
      "id": "pr_123",
      "number": "PR-2024-001",
      "status": "in-progress",
      "workflowStage": 2,
      "currentStage": {
        "stage": 2,
        "stageName": "Finance Review",
        "assignedTo": {
          "id": "user_789",
          "name": "Finance Manager",
          "role": "Finance"
        }
      },
      "lastAction": "Approved by HOD - Advanced to Finance Review"
    },
    "approvalRecord": {
      "id": "approval_001",
      "stage": 1,
      "action": "approved",
      "user": {
        "id": "user_456",
        "name": "Jane Smith"
      },
      "date": "2024-01-15T12:00:00Z",
      "comments": "Approved for kitchen renovation project"
    }
  },
  "message": "Purchase request approved and advanced to next stage"
}
```

### POST /purchase-requests/{id}/reject
Reject a purchase request.

#### Request
```http
POST /api/purchase-request/pr_123/reject?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "reason": "budget_exceeded",
  "comments": "Request exceeds approved budget for this quarter",
  "suggestions": [
    "Consider phasing the purchase over two quarters",
    "Explore alternative vendors for better pricing"
  ]
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "purchaseRequest": {
      "id": "pr_123",
      "number": "PR-2024-001",
      "status": "rejected",
      "workflowStage": -1,
      "lastAction": "Rejected by HOD - Budget exceeded"
    },
    "rejectionRecord": {
      "id": "rejection_001",
      "stage": 1,
      "action": "rejected",
      "user": {
        "id": "user_456",
        "name": "Jane Smith"
      },
      "date": "2024-01-15T12:00:00Z",
      "reason": "budget_exceeded",
      "comments": "Request exceeds approved budget for this quarter"
    }
  },
  "message": "Purchase request rejected"
}
```

### POST /purchase-requests/{id}/return
Return a purchase request to previous stage.

#### Request
```http
POST /api/purchase-request/pr_123/return?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "returnToStage": 0,
  "reason": "additional_information_required",
  "comments": "Please provide detailed specifications and vendor quotes",
  "requiredActions": [
    "Add detailed technical specifications",
    "Obtain at least 3 vendor quotes",
    "Provide installation timeline"
  ]
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "purchaseRequest": {
      "id": "pr_123",
      "number": "PR-2024-001",
      "status": "returned",
      "workflowStage": 0,
      "currentStage": {
        "stage": 0,
        "stageName": "Draft",
        "assignedTo": {
          "id": "user_123",
          "name": "John Doe",
          "role": "Requestor"
        }
      },
      "lastAction": "Returned by HOD for additional information"
    }
  },
  "message": "Purchase request returned to requestor"
}
```

### POST /purchase-requests/{id}/convert
Convert approved purchase request to purchase order.

#### Request
```http
POST /api/purchase-request/pr_123/convert?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "vendorId": "vendor_001",
  "deliveryDate": "2024-02-15T00:00:00Z",
  "deliveryAddress": {
    "name": "Grand Hotel Singapore",
    "address": "123 Hotel Street",
    "city": "Singapore",
    "postalCode": "123456",
    "country": "Singapore"
  },
  "terms": {
    "paymentTerms": "Net 30",
    "deliveryTerms": "FOB Destination",
    "warranty": "12 months"
  },
  "items": [
    {
      "itemId": "pri_001",
      "quantity": 1,
      "unitPrice": 7800.00,
      "currency": "SGD"
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
    "purchaseOrder": {
      "id": "po_001",
      "number": "PO-2024-001",
      "status": "draft",
      "vendor": {
        "id": "vendor_001",
        "name": "Kitchen Equipment Ltd"
      },
      "totalAmount": 7800.00,
      "currency": "SGD",
      "createdAt": "2024-01-15T13:00:00Z"
    },
    "purchaseRequest": {
      "id": "pr_123",
      "status": "converted",
      "workflowStage": 4,
      "convertedToPO": "po_001"
    }
  },
  "message": "Purchase request converted to purchase order successfully"
}
```

### GET /purchase-requests/{id}/workflow
Get workflow information for a purchase request.

#### Request
```http
GET /api/purchase-request/pr_123/workflow?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "workflow": {
      "currentStage": {
        "stage": 1,
        "stageName": "HOD Review",
        "description": "Head of Department review and approval",
        "assignedTo": {
          "id": "user_456",
          "name": "Jane Smith",
          "role": "HOD"
        },
        "dueDate": "2024-01-17T10:30:00Z",
        "availableActions": ["approve", "reject", "return"]
      },
      "stages": [
        {
          "stage": 0,
          "stageName": "Draft",
          "status": "completed",
          "completedAt": "2024-01-15T10:30:00Z"
        },
        {
          "stage": 1,
          "stageName": "HOD Review",
          "status": "active",
          "assignedTo": "user_456"
        },
        {
          "stage": 2,
          "stageName": "Finance Review",
          "status": "pending",
          "assignedTo": "user_789"
        },
        {
          "stage": 3,
          "stageName": "Vendor Allocation",
          "status": "pending",
          "assignedTo": "user_101"
        },
        {
          "stage": 4,
          "stageName": "Approved",
          "status": "pending"
        }
      ],
      "permissions": {
        "canView": true,
        "canEdit": false,
        "canApprove": true,
        "canReject": true,
        "canReturn": true
      }
    }
  }
}
```

## Data Models

### Purchase Request
```typescript
interface PurchaseRequest {
  id: string;
  number: string;
  title: string;
  description: string;
  status: 'draft' | 'in-progress' | 'completed' | 'rejected' | 'cancelled' | 'converted';
  workflowStage: number;
  priority: 'low' | 'medium' | 'high';
  requestor: User;
  businessUnit: BusinessUnit;
  department: string;
  requestDate: string;
  requiredDate: string;
  justification: string;
  budgetCode?: string;
  totalValue: MoneyAmount;
  itemCount: number;
  items: PurchaseRequestItem[];
  workflowHistory: WorkflowAction[];
  currentStage: WorkflowStage;
  businessDimensions: BusinessDimensions;
  attachments: Attachment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Purchase Request Item
```typescript
interface PurchaseRequestItem {
  id: string;
  itemId?: string;
  sku?: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  approvedPrice?: number;
  currency: string;
  requiredDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  justification: string;
  specifications: Record<string, any>;
  preferredVendors: VendorQuote[];
  approvalNotes: string[];
  attachments: Attachment[];
}
```

### Workflow Action
```typescript
interface WorkflowAction {
  stage: number;
  stageName: string;
  action: 'created' | 'submitted' | 'approved' | 'rejected' | 'returned' | 'converted';
  user: User;
  date: string;
  comments?: string;
  conditions?: string[];
  attachments?: Attachment[];
}
```

## Error Codes

| Code | Description |
|------|-------------|
| PR_001 | Purchase request not found |
| PR_002 | Invalid workflow stage |
| PR_003 | Insufficient permissions |
| PR_004 | Invalid approval action |
| PR_005 | Budget validation failed |
| PR_006 | Required date in past |
| PR_007 | Invalid item specification |
| PR_008 | Vendor not found |
| PR_009 | Duplicate PR number |
| PR_010 | Workflow transition not allowed |

## Business Rules

### Workflow Rules
- PRs must progress through stages sequentially
- Only assigned users can approve at each stage
- Rejected PRs cannot be reactivated
- Converted PRs cannot be modified

### Approval Limits
- HOD: Up to $10,000
- Finance: Up to $50,000
- General Manager: Unlimited
- Multi-approver required for amounts > $100,000

### Budget Validation
- All PRs must have valid budget codes
- Budget availability checked at approval
- Budget reservations created on approval
- Budget consumed on PO creation

### Item Requirements
- All items must have specifications
- Vendor quotes required for items > $1,000
- Technical specifications required for equipment
- Delivery dates must be realistic

## Examples

### Create Purchase Request
```typescript
const createPR = async (prData: CreatePRRequest) => {
  const response = await fetch('/api/purchase-request', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prData)
  });
  
  return response.json();
};
```

### Approve Purchase Request
```typescript
const approvePR = async (prId: string, approvalData: ApprovalData) => {
  const response = await fetch(`/api/purchase-request/${prId}/approve?version=latest`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(approvalData)
  });
  
  return response.json();
};
```

### Get PR Workflow Status
```typescript
const getWorkflowStatus = async (prId: string) => {
  const response = await fetch(`/api/purchase-request/${prId}/workflow?version=latest`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const { data } = await response.json();
  return data.workflow;
};
```