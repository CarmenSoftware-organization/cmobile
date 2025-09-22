# Workflow API

## Overview
The Workflow API manages approval workflows, stage transitions, role-based permissions, and workflow configurations for the Carmen Supply Chain application. It provides the core engine for document approval processes across multiple modules.

## Base URL
```
/api/workflow
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
GET /api/workflow/stages?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### GET /workflow/stages
Get workflow stage definitions and configurations.

#### Request
```http
GET /api/workflow/stages?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| workflowType | string | Type of workflow (purchase-request, store-requisition) |
| businessUnit | string | Business unit ID |
| includeTerminal | boolean | Include terminal stages (default: true) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "workflowType": "purchase-request",
    "stages": [
      {
        "id": 0,
        "name": "Draft",
        "label": "Draft",
        "description": "Document preparation and initial creation",
        "type": "initial",
        "roles": ["Requestor"],
        "permissions": {
          "canView": ["Requestor", "HOD", "Finance", "Purchasing"],
          "canEdit": ["Requestor"],
          "canApprove": [],
          "canReject": [],
          "canReturn": []
        },
        "validStatuses": ["draft"],
        "nextStages": [1, -3],
        "estimatedDuration": "PT2H",
        "isRequired": true,
        "autoAdvance": false
      },
      {
        "id": 1,
        "name": "HOD Review",
        "label": "HOD Review",
        "description": "Head of Department review and approval",
        "type": "approval",
        "roles": ["HOD"],
        "permissions": {
          "canView": ["Requestor", "HOD", "Finance", "Purchasing"],
          "canEdit": ["HOD"],
          "canApprove": ["HOD"],
          "canReject": ["HOD"],
          "canReturn": ["HOD"]
        },
        "validStatuses": ["in-progress", "returned"],
        "nextStages": [2, 0, -1],
        "estimatedDuration": "P1D",
        "isRequired": true,
        "autoAdvance": false,
        "approvalLimits": {
          "SGD": 10000,
          "USD": 7500
        }
      },
      {
        "id": 2,
        "name": "Finance Review",
        "label": "Finance Review",
        "description": "Financial validation and budget approval",
        "type": "approval",
        "roles": ["Finance"],
        "permissions": {
          "canView": ["Requestor", "HOD", "Finance", "Purchasing"],
          "canEdit": ["Finance"],
          "canApprove": ["Finance"],
          "canReject": ["Finance"],
          "canReturn": ["Finance"]
        },
        "validStatuses": ["in-progress", "returned"],
        "nextStages": [3, 1, -1],
        "estimatedDuration": "P2D",
        "isRequired": true,
        "autoAdvance": false,
        "approvalLimits": {
          "SGD": 50000,
          "USD": 37500
        }
      },
      {
        "id": 3,
        "name": "Vendor Allocation",
        "label": "Vendor Allocation",
        "description": "Purchasing team vendor selection and allocation",
        "type": "processing",
        "roles": ["Purchasing"],
        "permissions": {
          "canView": ["Requestor", "HOD", "Finance", "Purchasing"],
          "canEdit": ["Purchasing"],
          "canApprove": ["Purchasing"],
          "canReject": ["Purchasing"],
          "canReturn": ["Purchasing"]
        },
        "validStatuses": ["in-progress", "returned"],
        "nextStages": [4, 2, -1],
        "estimatedDuration": "P3D",
        "isRequired": true,
        "autoAdvance": false
      },
      {
        "id": 4,
        "name": "Approved",
        "label": "Approved",
        "description": "Final approval - ready for conversion",
        "type": "terminal",
        "roles": [],
        "permissions": {
          "canView": ["Requestor", "HOD", "Finance", "Purchasing"],
          "canEdit": [],
          "canApprove": [],
          "canReject": [],
          "canReturn": []
        },
        "validStatuses": ["completed", "converted"],
        "nextStages": [],
        "isRequired": true,
        "autoAdvance": false
      }
    ],
    "terminalStages": [
      {
        "id": -1,
        "name": "Rejected",
        "label": "Rejected",
        "description": "Document rejected",
        "type": "terminal",
        "validStatuses": ["rejected"]
      },
      {
        "id": -3,
        "name": "Cancelled",
        "label": "Cancelled",
        "description": "Document cancelled",
        "type": "terminal",
        "validStatuses": ["cancelled"]
      }
    ]
  }
}
```

### POST /workflow/advance
Advance a document through the workflow.

#### Request
```http
POST /api/workflow/advance?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "documentId": "pr_123",
  "documentType": "purchase-request",
  "action": "approve",
  "targetStage": 2,
  "comments": "Approved for budget allocation",
  "conditions": [
    "Must obtain 3 quotes before purchase",
    "Delivery required by end of month"
  ],
  "itemActions": [
    {
      "itemId": "pri_001",
      "action": "approve",
      "approvedQuantity": 10,
      "approvedPrice": 500.00,
      "selectedVendor": "vendor_001",
      "notes": "Approved with vendor selection"
    }
  ],
  "attachments": [
    {
      "filename": "approval-memo.pdf",
      "content": "base64_encoded_content",
      "contentType": "application/pdf"
    }
  ],
  "notifyUsers": ["user_789"],
  "escalationDate": "2024-01-20T10:00:00Z"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "workflowAction": {
      "id": "wa_001",
      "documentId": "pr_123",
      "fromStage": 1,
      "toStage": 2,
      "action": "approve",
      "user": {
        "id": "user_456",
        "name": "Jane Smith",
        "role": "HOD"
      },
      "timestamp": "2024-01-15T12:00:00Z",
      "comments": "Approved for budget allocation",
      "conditions": [
        "Must obtain 3 quotes before purchase",
        "Delivery required by end of month"
      ]
    },
    "currentStage": {
      "stage": 2,
      "stageName": "Finance Review",
      "assignedTo": {
        "id": "user_789",
        "name": "Finance Manager",
        "role": "Finance"
      },
      "dueDate": "2024-01-17T12:00:00Z",
      "availableActions": ["approve", "reject", "return"]
    },
    "notifications": [
      {
        "userId": "user_789",
        "type": "workflow_assignment",
        "message": "PR-2024-001 assigned for Finance Review"
      }
    ]
  },
  "message": "Workflow advanced successfully"
}
```

### POST /workflow/reject
Reject a document in the workflow.

#### Request
```http
POST /api/workflow/reject?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "documentId": "pr_123",
  "documentType": "purchase-request",
  "reason": "budget_exceeded",
  "comments": "Request exceeds approved budget for this quarter",
  "suggestions": [
    "Consider phasing the purchase over two quarters",
    "Explore alternative vendors for better pricing"
  ],
  "returnToStage": null,
  "notifyUsers": ["user_123"]
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "workflowAction": {
      "id": "wa_002",
      "documentId": "pr_123",
      "fromStage": 1,
      "toStage": -1,
      "action": "reject",
      "user": {
        "id": "user_456",
        "name": "Jane Smith",
        "role": "HOD"
      },
      "timestamp": "2024-01-15T12:30:00Z",
      "reason": "budget_exceeded",
      "comments": "Request exceeds approved budget for this quarter"
    },
    "currentStage": {
      "stage": -1,
      "stageName": "Rejected",
      "isFinal": true
    }
  },
  "message": "Document rejected successfully"
}
```

### POST /workflow/return
Return a document to a previous stage.

#### Request
```http
POST /api/workflow/return?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "documentId": "pr_123",
  "documentType": "purchase-request",
  "returnToStage": 0,
  "reason": "additional_information_required",
  "comments": "Please provide detailed specifications and vendor quotes",
  "requiredActions": [
    "Add detailed technical specifications",
    "Obtain at least 3 vendor quotes",
    "Provide installation timeline"
  ],
  "dueDate": "2024-01-18T10:00:00Z"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "workflowAction": {
      "id": "wa_003",
      "documentId": "pr_123",
      "fromStage": 1,
      "toStage": 0,
      "action": "return",
      "user": {
        "id": "user_456",
        "name": "Jane Smith",
        "role": "HOD"
      },
      "timestamp": "2024-01-15T13:00:00Z",
      "reason": "additional_information_required",
      "comments": "Please provide detailed specifications and vendor quotes"
    },
    "currentStage": {
      "stage": 0,
      "stageName": "Draft",
      "assignedTo": {
        "id": "user_123",
        "name": "John Doe",
        "role": "Requestor"
      },
      "dueDate": "2024-01-18T10:00:00Z",
      "requiredActions": [
        "Add detailed technical specifications",
        "Obtain at least 3 vendor quotes",
        "Provide installation timeline"
      ]
    }
  },
  "message": "Document returned to previous stage"
}
```

### GET /workflow/permissions
Get workflow permissions for current user.

#### Request
```http
GET /api/workflow/permissions?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "permissions": {
      "documentId": "pr_123",
      "currentStage": 1,
      "userRole": "HOD",
      "canView": true,
      "canEdit": true,
      "canApprove": true,
      "canReject": true,
      "canReturn": true,
      "canCancel": false,
      "canReassign": true,
      "approvalLimits": {
        "SGD": 10000,
        "USD": 7500
      },
      "availableActions": [
        {
          "action": "approve",
          "label": "Approve",
          "description": "Approve and advance to next stage",
          "requiresComments": false,
          "requiresConditions": false
        },
        {
          "action": "reject",
          "label": "Reject",
          "description": "Reject the request",
          "requiresComments": true,
          "requiresReason": true
        },
        {
          "action": "return",
          "label": "Return for Changes",
          "description": "Return to previous stage for modifications",
          "requiresComments": true,
          "requiresActions": true
        }
      ],
      "delegations": [
        {
          "delegateId": "user_999",
          "delegateName": "Assistant Manager",
          "startDate": "2024-01-15T00:00:00Z",
          "endDate": "2024-01-20T00:00:00Z",
          "isActive": true
        }
      ]
    }
  }
}
```

### POST /workflow/assign
Assign or reassign a workflow stage to a user.

#### Request
```http
POST /api/workflow/assign?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "documentId": "pr_123",
  "documentType": "purchase-request",
  "stage": 1,
  "assignTo": "user_999",
  "reason": "delegation",
  "comments": "Assigning to assistant manager during vacation",
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-20T00:00:00Z",
  "notifyAssignee": true
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "assignment": {
      "id": "assign_001",
      "documentId": "pr_123",
      "stage": 1,
      "assignedFrom": "user_456",
      "assignedTo": "user_999",
      "reason": "delegation",
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-01-20T00:00:00Z",
      "isActive": true,
      "createdAt": "2024-01-15T14:00:00Z"
    }
  },
  "message": "Workflow stage assigned successfully"
}
```

### GET /workflow/history
Get workflow history for a document.

#### Request
```http
GET /api/workflow/history?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "history": [
      {
        "id": "wa_001",
        "stage": 0,
        "stageName": "Draft",
        "action": "created",
        "user": {
          "id": "user_123",
          "name": "John Doe",
          "role": "Requestor"
        },
        "timestamp": "2024-01-15T10:00:00Z",
        "comments": "Initial PR creation",
        "duration": "PT2H30M"
      },
      {
        "id": "wa_002",
        "stage": 0,
        "stageName": "Draft",
        "action": "submitted",
        "user": {
          "id": "user_123",
          "name": "John Doe",
          "role": "Requestor"
        },
        "timestamp": "2024-01-15T12:30:00Z",
        "comments": "Submitted for HOD approval",
        "attachments": [
          {
            "id": "att_001",
            "filename": "budget-justification.pdf"
          }
        ]
      },
      {
        "id": "wa_003",
        "stage": 1,
        "stageName": "HOD Review",
        "action": "approved",
        "user": {
          "id": "user_456",
          "name": "Jane Smith",
          "role": "HOD"
        },
        "timestamp": "2024-01-15T14:00:00Z",
        "comments": "Approved for budget allocation",
        "conditions": [
          "Must obtain 3 quotes before purchase"
        ],
        "duration": "PT1H30M"
      }
    ],
    "summary": {
      "totalStages": 5,
      "completedStages": 2,
      "currentStage": 2,
      "totalDuration": "PT4H",
      "averageStageTime": "PT2H",
      "isOnTime": true,
      "estimatedCompletion": "2024-01-20T10:00:00Z"
    }
  }
}
```

### GET /workflow/analytics
Get workflow analytics and performance metrics.

#### Request
```http
GET /api/workflow/analytics?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "analytics": {
      "period": {
        "from": "2024-01-01T00:00:00Z",
        "to": "2024-01-31T23:59:59Z"
      },
      "summary": {
        "totalDocuments": 150,
        "completed": 120,
        "inProgress": 25,
        "rejected": 5,
        "averageCompletionTime": "P5D",
        "onTimeCompletion": 85.5
      },
      "stageMetrics": [
        {
          "stage": 0,
          "stageName": "Draft",
          "averageDuration": "PT4H",
          "completionRate": 95.0,
          "bottleneckScore": 2
        },
        {
          "stage": 1,
          "stageName": "HOD Review",
          "averageDuration": "P1D",
          "completionRate": 90.0,
          "bottleneckScore": 5
        },
        {
          "stage": 2,
          "stageName": "Finance Review",
          "averageDuration": "P2D",
          "completionRate": 85.0,
          "bottleneckScore": 8
        }
      ],
      "userPerformance": [
        {
          "userId": "user_456",
          "userName": "Jane Smith",
          "role": "HOD",
          "documentsProcessed": 45,
          "averageProcessingTime": "PT18H",
          "approvalRate": 88.9,
          "onTimeRate": 92.3
        }
      ],
      "trends": {
        "volumeTrend": "increasing",
        "timeTrend": "stable",
        "rejectionTrend": "decreasing"
      }
    }
  }
}
```

## Data Models

### Workflow Stage
```typescript
interface WorkflowStage {
  id: number;
  name: string;
  label: string;
  description: string;
  type: 'initial' | 'approval' | 'processing' | 'terminal';
  roles: string[];
  permissions: StagePermissions;
  validStatuses: string[];
  nextStages: number[];
  estimatedDuration: string; // ISO 8601 duration
  isRequired: boolean;
  autoAdvance: boolean;
  approvalLimits?: Record<string, number>;
}
```

### Workflow Action
```typescript
interface WorkflowAction {
  id: string;
  documentId: string;
  documentType: string;
  fromStage: number;
  toStage: number;
  action: 'approve' | 'reject' | 'return' | 'assign' | 'cancel';
  user: User;
  timestamp: string;
  comments?: string;
  reason?: string;
  conditions?: string[];
  attachments?: Attachment[];
  duration?: string;
}
```

### Stage Permissions
```typescript
interface StagePermissions {
  canView: string[];
  canEdit: string[];
  canApprove: string[];
  canReject: string[];
  canReturn: string[];
}
```

### Workflow Assignment
```typescript
interface WorkflowAssignment {
  id: string;
  documentId: string;
  stage: number;
  assignedFrom: string;
  assignedTo: string;
  reason: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}
```

## Error Codes

| Code | Description |
|------|-------------|
| WF_001 | Invalid workflow stage |
| WF_002 | Unauthorized workflow action |
| WF_003 | Invalid stage transition |
| WF_004 | Document not found |
| WF_005 | Workflow configuration error |
| WF_006 | Approval limit exceeded |
| WF_007 | Required conditions not met |
| WF_008 | Invalid assignment |
| WF_009 | Workflow already completed |
| WF_010 | Delegation not allowed |

## Business Rules

### Stage Progression
- Documents must progress through stages sequentially
- Terminal stages cannot be changed
- Rejected documents cannot be reactivated
- Cancelled documents can be reactivated by requestor

### Approval Authority
- Users can only approve within their limits
- Delegations must be explicitly authorized
- Emergency approvals require special permissions
- Multi-approver required for high-value items

### Time Management
- Each stage has estimated duration
- Overdue items trigger escalation
- Automatic reminders sent before due dates
- Performance metrics tracked per user

## Examples

### Approve Document
```typescript
const approveDocument = async (documentId: string, approvalData: ApprovalData) => {
  const response = await fetch('/api/workflow/advance?version=latest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      documentId,
      documentType: 'purchase-request',
      action: 'approve',
      ...approvalData
    })
  });
  
  return response.json();
};
```

### Check User Permissions
```typescript
const checkPermissions = async (documentId: string) => {
  const response = await fetch(`/api/workflow/permissions?version=latest&documentId=${documentId}&documentType=purchase-request`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const { data } = await response.json();
  return data.permissions;
};
```

### Get Workflow History
```typescript
const getWorkflowHistory = async (documentId: string) => {
  const response = await fetch(`/api/workflow/history?version=latest&documentId=${documentId}&documentType=purchase-request`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const { data } = await response.json();
  return data.history;
};
```