# Spot Check API

## Overview
The Spot Check API manages targeted inventory verification for quality assurance and compliance checking. It provides flexible selection methods, quick verification processes, and comprehensive compliance tracking for the Carmen Supply Chain application.

## Base URL
```
/api/spot-check
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
GET /api/spot-check/sessions?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### GET /spot-check/sessions
Retrieve spot check sessions with filtering and pagination.

#### Request
```http
GET /api/spot-check/sessions?version=latest
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
| method | string | Filter by selection method (random, manual, high-value, category, risk-based) |
| businessUnit | string | Filter by business unit |
| assignedTo | string | Filter by assigned user |
| dateFrom | string | Filter by date range (ISO 8601) |
| dateTo | string | Filter by date range (ISO 8601) |
| sort | string | Sort field (date, progress, accuracy) |
| order | string | Sort order (asc, desc) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "sc_session_001",
        "name": "Main Store Random Check - January 2024",
        "description": "Random spot check for compliance verification",
        "status": "in-progress",
        "type": "compliance",
        "selectionMethod": "random",
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
          "totalItems": 20,
          "checkedItems": 12,
          "percentage": 60.0,
          "varianceItems": 2,
          "accuracyRate": 83.3,
          "complianceRate": 90.0
        },
        "selectionCriteria": {
          "method": "random",
          "itemCount": 20,
          "categories": ["cat_001", "cat_002"],
          "valueThreshold": null,
          "riskLevel": null
        },
        "assignedTo": {
          "id": "user_123",
          "name": "Quality Inspector",
          "role": "QA"
        },
        "scheduledDate": "2024-01-15T10:00:00Z",
        "startedAt": "2024-01-15T10:15:00Z",
        "expectedCompletionDate": "2024-01-15T16:00:00Z",
        "lastActivity": "2024-01-15T14:30:00Z",
        "createdBy": {
          "id": "user_456",
          "name": "QA Manager"
        },
        "createdAt": "2024-01-14T15:00:00Z",
        "updatedAt": "2024-01-15T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 35,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "totalSessions": 35,
      "activeSessions": 5,
      "completedSessions": 28,
      "pendingSessions": 2,
      "averageAccuracy": 94.2,
      "averageCompliance": 96.8
    }
  }
}
```

### POST /spot-check/sessions
Create a new spot check session.

#### Request
```http
POST /api/spot-check/sessions?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "High Value Items Check - January 2024",
  "description": "Spot check for high-value items compliance",
  "type": "audit",
  "locationId": "loc_001",
  "selectionMethod": "high-value",
  "selectionCriteria": {
    "itemCount": 15,
    "valueThreshold": 1000.00,
    "currency": "SGD",
    "categories": ["cat_001"],
    "includeExpiring": true,
    "daysTillExpiry": 30
  },
  "scheduledDate": "2024-01-20T09:00:00Z",
  "expectedCompletionDate": "2024-01-20T15:00:00Z",
  "assignedTo": "user_123",
  "instructions": "Focus on expiry dates and storage conditions for high-value items",
  "complianceChecks": [
    "expiry_date",
    "storage_condition",
    "labeling",
    "quantity_accuracy"
  ],
  "businessUnit": "bu_12345",
  "tags": ["high-value", "compliance", "audit"]
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "session": {
      "id": "sc_session_002",
      "name": "High Value Items Check - January 2024",
      "status": "draft",
      "selectionMethod": "high-value",
      "location": {
        "id": "loc_001",
        "name": "Main Store"
      },
      "progress": {
        "totalItems": 15,
        "checkedItems": 0,
        "percentage": 0
      },
      "scheduledDate": "2024-01-20T09:00:00Z",
      "createdAt": "2024-01-15T16:00:00Z",
      "createdBy": {
        "id": "user_456",
        "name": "QA Manager"
      }
    }
  },
  "message": "Spot check session created successfully"
}
```

### GET /spot-check/sessions/{id}
Get detailed information for a specific spot check session.

#### Request
```http
GET /api/spot-check/sessions/sc_session_001?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "session": {
      "id": "sc_session_001",
      "name": "Main Store Random Check - January 2024",
      "description": "Random spot check for compliance verification",
      "status": "in-progress",
      "type": "compliance",
      "selectionMethod": "random",
      "location": {
        "id": "loc_001",
        "name": "Main Store",
        "type": "storage",
        "address": "Basement Level 1, Storage Room A",
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        }
      },
      "selectionCriteria": {
        "method": "random",
        "itemCount": 20,
        "categories": ["cat_001", "cat_002"],
        "excludeCategories": [],
        "valueThreshold": null,
        "riskLevel": null,
        "includeExpiring": false,
        "seed": "random_seed_123"
      },
      "progress": {
        "totalItems": 20,
        "checkedItems": 12,
        "uncheckedItems": 8,
        "percentage": 60.0,
        "varianceItems": 2,
        "accurateItems": 10,
        "accuracyRate": 83.3,
        "complianceRate": 90.0,
        "issuesFound": 1
      },
      "complianceChecks": [
        {
          "id": "check_001",
          "name": "Expiry Date Verification",
          "description": "Check product expiry dates",
          "isRequired": true,
          "passRate": 95.0
        },
        {
          "id": "check_002",
          "name": "Storage Condition",
          "description": "Verify proper storage conditions",
          "isRequired": true,
          "passRate": 85.0
        },
        {
          "id": "check_003",
          "name": "Labeling Compliance",
          "description": "Check proper labeling",
          "isRequired": false,
          "passRate": 100.0
        }
      ],
      "assignedTo": {
        "id": "user_123",
        "name": "Quality Inspector",
        "role": "QA",
        "lastActivity": "2024-01-15T14:30:00Z"
      },
      "timeline": {
        "scheduledDate": "2024-01-15T10:00:00Z",
        "startedAt": "2024-01-15T10:15:00Z",
        "expectedCompletionDate": "2024-01-15T16:00:00Z",
        "estimatedCompletionDate": "2024-01-15T17:30:00Z",
        "completedAt": null
      },
      "instructions": "Focus on expiry dates and storage conditions. Document any issues with photos.",
      "tags": ["random", "compliance", "monthly"],
      "attachments": [
        {
          "id": "att_001",
          "filename": "spot-check-guidelines.pdf",
          "size": 256000,
          "uploadedAt": "2024-01-14T15:30:00Z"
        }
      ],
      "createdBy": {
        "id": "user_456",
        "name": "QA Manager"
      },
      "createdAt": "2024-01-14T15:00:00Z",
      "updatedAt": "2024-01-15T14:30:00Z"
    }
  }
}
```

### POST /spot-check/sessions/{id}/start
Start a spot check session and generate item list.

#### Request
```http
POST /api/spot-check/sessions/sc_session_001/start?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "startDate": "2024-01-15T10:00:00Z",
  "generateItems": true,
  "notes": "Starting spot check as scheduled. All compliance criteria reviewed."
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "session": {
      "id": "sc_session_001",
      "status": "in-progress",
      "startedAt": "2024-01-15T10:00:00Z",
      "selectedItems": [
        {
          "id": "sci_001",
          "itemId": "item_123",
          "sku": "SKU001",
          "name": "Premium Coffee Beans",
          "systemQuantity": 50,
          "unit": "kg",
          "status": "pending",
          "selectionReason": "random_selection"
        }
      ]
    }
  },
  "message": "Spot check session started and items generated"
}
```

### GET /spot-check/sessions/{id}/items
Get items for a spot check session.

#### Request
```http
GET /api/spot-check/sessions/sc_session_001/items?version=latest
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
        "id": "sci_001",
        "itemId": "item_123",
        "sku": "SKU001",
        "name": "Premium Coffee Beans",
        "description": "High-quality arabica coffee beans",
        "category": {
          "id": "cat_001",
          "name": "Beverages"
        },
        "systemQuantity": 50,
        "actualQuantity": 48,
        "variance": -2,
        "unit": "kg",
        "location": {
          "zone": "zone_001",
          "shelf": "A-01",
          "bin": "001"
        },
        "status": "checked",
        "selectionReason": "random_selection",
        "checkedBy": {
          "id": "user_123",
          "name": "Quality Inspector"
        },
        "checkedAt": "2024-01-15T11:30:00Z",
        "complianceChecks": [
          {
            "checkId": "check_001",
            "checkName": "Expiry Date Verification",
            "status": "pass",
            "notes": "Expiry date clearly visible: 2025-06-15",
            "checkedAt": "2024-01-15T11:30:00Z"
          },
          {
            "checkId": "check_002",
            "checkName": "Storage Condition",
            "status": "pass",
            "notes": "Stored in cool, dry conditions as required",
            "checkedAt": "2024-01-15T11:32:00Z"
          },
          {
            "checkId": "check_003",
            "checkName": "Labeling Compliance",
            "status": "fail",
            "notes": "Missing allergen information on label",
            "checkedAt": "2024-01-15T11:35:00Z",
            "correctionRequired": true
          }
        ],
        "overallCompliance": "partial",
        "notes": "Minor labeling issue identified - requires correction",
        "attachments": [
          {
            "id": "att_002",
            "type": "photo",
            "filename": "coffee-beans-label.jpg",
            "url": "https://cdn.carmen-supply.com/spot-check/coffee-beans-label.jpg",
            "description": "Photo of current labeling"
          }
        ],
        "estimatedValue": {
          "unitPrice": 24.99,
          "systemValue": 1249.50,
          "actualValue": 1199.52,
          "currency": "SGD"
        },
        "riskLevel": "low",
        "lastSystemUpdate": "2024-01-14T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 20,
      "totalPages": 1
    },
    "summary": {
      "totalItems": 20,
      "checkedItems": 12,
      "pendingItems": 8,
      "compliancePass": 10,
      "complianceFail": 1,
      "compliancePartial": 1,
      "varianceItems": 2,
      "accuracyRate": 83.3,
      "complianceRate": 90.0
    }
  }
}
```

### PUT /spot-check/sessions/{id}/items
Update item checks in a spot check session.

#### Request
```http
PUT /api/spot-check/sessions/sc_session_001/items?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "items": [
    {
      "id": "sci_002",
      "actualQuantity": 25,
      "unit": "bottle",
      "complianceChecks": [
        {
          "checkId": "check_001",
          "status": "pass",
          "notes": "Expiry date: 2025-12-31"
        },
        {
          "checkId": "check_002",
          "status": "pass",
          "notes": "Proper refrigeration maintained"
        }
      ],
      "overallCompliance": "pass",
      "notes": "All checks passed successfully",
      "checkedAt": "2024-01-15T12:00:00Z",
      "attachments": [
        {
          "type": "photo",
          "filename": "olive-oil-check.jpg",
          "content": "base64_encoded_image_data",
          "contentType": "image/jpeg",
          "description": "Compliance verification photo"
        }
      ]
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
        "id": "sci_002",
        "itemId": "item_124",
        "sku": "SKU002",
        "actualQuantity": 25,
        "variance": 0,
        "status": "checked",
        "overallCompliance": "pass",
        "checkedBy": {
          "id": "user_123",
          "name": "Quality Inspector"
        },
        "checkedAt": "2024-01-15T12:00:00Z"
      }
    ],
    "sessionProgress": {
      "totalItems": 20,
      "checkedItems": 13,
      "percentage": 65.0,
      "complianceRate": 92.3
    }
  },
  "message": "Item checks updated successfully"
}
```

### POST /spot-check/sessions/{id}/complete
Complete a spot check session.

#### Request
```http
POST /api/spot-check/sessions/sc_session_001/complete?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "completedAt": "2024-01-15T15:30:00Z",
  "finalNotes": "Spot check completed. Minor compliance issues identified and documented.",
  "overallCompliance": "pass",
  "recommendedActions": [
    "Update labeling for items with missing allergen information",
    "Review storage procedures for zone_002"
  ],
  "submitForReview": true,
  "notifyManagement": true
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "session": {
      "id": "sc_session_001",
      "status": "completed",
      "completedAt": "2024-01-15T15:30:00Z",
      "completedBy": {
        "id": "user_123",
        "name": "Quality Inspector"
      },
      "finalResults": {
        "totalItems": 20,
        "checkedItems": 20,
        "accuracyRate": 95.0,
        "complianceRate": 90.0,
        "overallCompliance": "pass",
        "issuesFound": 2,
        "correctiveActionsRequired": 1
      }
    },
    "complianceReport": {
      "id": "report_001",
      "sessionId": "sc_session_001",
      "generatedAt": "2024-01-15T15:35:00Z",
      "url": "https://cdn.carmen-supply.com/reports/spot-check-report-001.pdf"
    }
  },
  "message": "Spot check session completed successfully"
}
```

### GET /spot-check/methods
Get available spot check selection methods.

#### Request
```http
GET /api/spot-check/methods?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "methods": [
      {
        "id": "random",
        "name": "Random Selection",
        "description": "System-generated random item sampling for unbiased verification",
        "parameters": [
          {
            "name": "itemCount",
            "type": "integer",
            "required": true,
            "min": 1,
            "max": 100,
            "default": 20
          },
          {
            "name": "categories",
            "type": "array",
            "required": false,
            "description": "Limit selection to specific categories"
          }
        ],
        "advantages": [
          "Eliminates selection bias",
          "Statistically representative",
          "Quick to execute"
        ],
        "useCases": [
          "Regular compliance checks",
          "Audit preparation",
          "Quality assurance"
        ]
      },
      {
        "id": "high-value",
        "name": "High Value Selection",
        "description": "Focus on high-value inventory items for risk mitigation",
        "parameters": [
          {
            "name": "valueThreshold",
            "type": "number",
            "required": true,
            "min": 0,
            "description": "Minimum item value for selection"
          },
          {
            "name": "currency",
            "type": "string",
            "required": true,
            "default": "SGD"
          },
          {
            "name": "itemCount",
            "type": "integer",
            "required": true,
            "min": 1,
            "max": 50,
            "default": 15
          }
        ],
        "advantages": [
          "Protects high-value inventory",
          "Risk-focused approach",
          "Financial impact mitigation"
        ],
        "useCases": [
          "Financial audits",
          "Insurance verification",
          "Theft prevention"
        ]
      },
      {
        "id": "risk-based",
        "name": "Risk-Based Selection",
        "description": "Target items with historical variances or compliance issues",
        "parameters": [
          {
            "name": "riskLevel",
            "type": "string",
            "required": true,
            "enum": ["high", "medium", "low"],
            "default": "high"
          },
          {
            "name": "lookbackDays",
            "type": "integer",
            "required": false,
            "default": 90,
            "description": "Days to look back for variance history"
          }
        ],
        "advantages": [
          "Proactive problem identification",
          "Continuous improvement focus",
          "Historical data utilization"
        ],
        "useCases": [
          "Problem investigation",
          "Process improvement",
          "Variance reduction"
        ]
      }
    ]
  }
}
```

### GET /spot-check/compliance-checks
Get available compliance check types.

#### Request
```http
GET /api/spot-check/compliance-checks?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "complianceChecks": [
      {
        "id": "expiry_date",
        "name": "Expiry Date Verification",
        "description": "Check product expiry dates and shelf life",
        "category": "food-safety",
        "isRequired": true,
        "criteria": [
          "Expiry date clearly visible",
          "Product within expiry date",
          "Proper date format"
        ],
        "failureActions": [
          "Remove expired products",
          "Update inventory system",
          "Investigate supplier issues"
        ]
      },
      {
        "id": "storage_condition",
        "name": "Storage Condition Check",
        "description": "Verify proper storage conditions are maintained",
        "category": "food-safety",
        "isRequired": true,
        "criteria": [
          "Correct temperature range",
          "Proper humidity levels",
          "Clean storage environment"
        ],
        "failureActions": [
          "Adjust storage conditions",
          "Relocate affected items",
          "Maintenance request"
        ]
      },
      {
        "id": "labeling",
        "name": "Labeling Compliance",
        "description": "Check product labeling for compliance",
        "category": "regulatory",
        "isRequired": false,
        "criteria": [
          "All required information present",
          "Allergen information visible",
          "Nutritional facts accurate"
        ],
        "failureActions": [
          "Update product labels",
          "Contact supplier",
          "Regulatory notification"
        ]
      }
    ]
  }
}
```

## Data Models

### Spot Check Session
```typescript
interface SpotCheckSession {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  type: 'compliance' | 'audit' | 'quality' | 'investigation';
  selectionMethod: 'random' | 'manual' | 'high-value' | 'category' | 'risk-based';
  location: Location;
  selectionCriteria: SelectionCriteria;
  progress: SpotCheckProgress;
  complianceChecks: ComplianceCheck[];
  assignedTo: User;
  timeline: SessionTimeline;
  instructions: string;
  tags: string[];
  attachments: Attachment[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}
```

### Spot Check Item
```typescript
interface SpotCheckItem {
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
  location: ItemLocation;
  status: 'pending' | 'checked' | 'verified' | 'flagged';
  selectionReason: string;
  checkedBy: User | null;
  checkedAt: string | null;
  complianceChecks: ItemComplianceCheck[];
  overallCompliance: 'pass' | 'fail' | 'partial' | 'pending';
  notes: string;
  attachments: Attachment[];
  estimatedValue: ValueInfo;
  riskLevel: 'low' | 'medium' | 'high';
  lastSystemUpdate: string;
}
```

### Selection Criteria
```typescript
interface SelectionCriteria {
  method: string;
  itemCount: number;
  categories?: string[];
  excludeCategories?: string[];
  valueThreshold?: number;
  currency?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  includeExpiring?: boolean;
  daysTillExpiry?: number;
  seed?: string;
}
```

### Compliance Check
```typescript
interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  category: string;
  isRequired: boolean;
  criteria: string[];
  failureActions: string[];
  passRate?: number;
}
```

### Item Compliance Check
```typescript
interface ItemComplianceCheck {
  checkId: string;
  checkName: string;
  status: 'pass' | 'fail' | 'partial' | 'pending';
  notes: string;
  checkedAt: string;
  correctionRequired?: boolean;
  attachments?: Attachment[];
}
```

## Error Codes

| Code | Description |
|------|-------------|
| SC_001 | Session not found |
| SC_002 | Invalid selection method |
| SC_003 | Item not found in session |
| SC_004 | Invalid compliance check |
| SC_005 | Session already completed |
| SC_006 | Insufficient permissions |
| SC_007 | Selection criteria invalid |
| SC_008 | Location not available |
| SC_009 | User not assigned |
| SC_010 | Compliance threshold not met |

## Business Rules

### Session Management
- Only one active session per location per day
- Sessions must have valid selection criteria
- Assigned users must have location access
- Draft sessions can be modified before starting

### Item Selection
- Random selection uses cryptographic randomness
- High-value selection requires minimum threshold
- Risk-based selection uses historical data
- Manual selection limited to 50 items

### Compliance Checking
- Required checks must be completed
- Failed checks require corrective actions
- Photos required for compliance failures
- Overall compliance calculated automatically

### Approval Process
- Review required for compliance rate < 90%
- Management notification for critical failures
- Corrective action plans required
- Follow-up sessions may be triggered

## Examples

### Create Random Spot Check
```typescript
const createRandomSpotCheck = async (locationId: string, itemCount: number) => {
  const response = await fetch('/api/spot-check/sessions?version=latest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `Random Check - ${new Date().toLocaleDateString()}`,
      type: 'compliance',
      locationId,
      selectionMethod: 'random',
      selectionCriteria: {
        method: 'random',
        itemCount
      },
      scheduledDate: new Date().toISOString()
    })
  });
  
  return response.json();
};
```

### Update Item Compliance
```typescript
const updateItemCompliance = async (sessionId: string, itemId: string, checks: ComplianceCheck[]) => {
  const response = await fetch(`/api/spot-check/sessions/${sessionId}/items?version=latest`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: [{
        id: itemId,
        complianceChecks: checks,
        checkedAt: new Date().toISOString()
      }]
    })
  });
  
  return response.json();
};
```

### Complete Spot Check
```typescript
const completeSpotCheck = async (sessionId: string, finalNotes: string) => {
  const response = await fetch(`/api/spot-check/sessions/${sessionId}/complete?version=latest`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      completedAt: new Date().toISOString(),
      finalNotes,
      submitForReview: true
    })
  });
  
  return response.json();
};
```