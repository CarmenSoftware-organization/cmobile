# User Management API

## Overview
The User Management API handles user profiles, role management, business unit assignments, preferences, and user-related operations for the Carmen Supply Chain application.

## Base URL
```
/api/v1/users
```

## Endpoints

### GET /users/profile
Get current user's profile information.

#### Request
```http
GET /api/v1/users/profile
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john.doe@hotel.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+65 9123 4567",
      "role": "HOD",
      "department": "F&B",
      "jobTitle": "Food & Beverage Manager",
      "employeeId": "EMP001",
      "businessUnits": [
        {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore",
          "role": "Manager",
          "permissions": [
            "inventory.read",
            "purchase-requests.approve",
            "store-requisitions.create"
          ],
          "approvalLimits": {
            "SGD": 10000,
            "USD": 7500
          },
          "isPrimary": true
        }
      ],
      "currentBusinessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "profile": {
        "avatar": "https://cdn.carmen-supply.com/avatars/user_123.jpg",
        "bio": "Experienced F&B manager with 10+ years in hospitality",
        "location": "Singapore",
        "timezone": "Asia/Singapore",
        "language": "en",
        "joinDate": "2023-01-15T00:00:00Z",
        "lastLogin": "2024-01-15T09:30:00Z",
        "status": "active"
      },
      "preferences": {
        "theme": "dark",
        "notifications": {
          "email": true,
          "push": true,
          "sms": false
        },
        "dashboard": {
          "defaultView": "summary",
          "refreshInterval": 300
        }
      },
      "workflowStages": [
        {
          "workflowType": "purchase-request",
          "stage": 1,
          "stageName": "HOD Review"
        },
        {
          "workflowType": "store-requisition",
          "stage": 1,
          "stageName": "Department Review"
        }
      ],
      "permissions": [
        "inventory.read",
        "inventory.write",
        "purchase-requests.create",
        "purchase-requests.approve",
        "store-requisitions.create",
        "store-requisitions.approve",
        "users.read",
        "reports.read"
      ],
      "createdAt": "2023-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T09:30:00Z"
    }
  }
}
```

### PUT /users/profile
Update current user's profile information.

#### Request
```http
PUT /api/v1/users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+65 9123 4567",
  "profile": {
    "bio": "Experienced F&B manager with 12+ years in hospitality",
    "location": "Singapore",
    "timezone": "Asia/Singapore",
    "language": "en"
  },
  "preferences": {
    "theme": "light",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "dashboard": {
      "defaultView": "detailed",
      "refreshInterval": 180
    }
  }
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "phone": "+65 9123 4567",
      "preferences": {
        "theme": "light",
        "notifications": {
          "email": true,
          "push": true,
          "sms": false
        }
      },
      "updatedAt": "2024-01-15T11:30:00Z"
    }
  },
  "message": "Profile updated successfully"
}
```

### POST /users/profile/avatar
Upload user avatar image.

#### Request
```http
POST /api/v1/users/profile/avatar
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "avatar": <file_data>
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "avatar": {
      "url": "https://cdn.carmen-supply.com/avatars/user_123.jpg",
      "thumbnailUrl": "https://cdn.carmen-supply.com/avatars/user_123_thumb.jpg",
      "uploadedAt": "2024-01-15T12:00:00Z"
    }
  },
  "message": "Avatar uploaded successfully"
}
```

### GET /users/permissions
Get current user's permissions.

#### Request
```http
GET /api/v1/users/permissions?businessUnit=bu_12345
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "permissions": {
      "businessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "role": "HOD",
      "permissions": [
        {
          "module": "inventory",
          "actions": ["read", "write"],
          "scope": "business_unit"
        },
        {
          "module": "purchase-requests",
          "actions": ["create", "read", "approve"],
          "scope": "department",
          "limits": {
            "SGD": 10000,
            "USD": 7500
          }
        },
        {
          "module": "store-requisitions",
          "actions": ["create", "read", "approve"],
          "scope": "department"
        },
        {
          "module": "users",
          "actions": ["read"],
          "scope": "department"
        },
        {
          "module": "reports",
          "actions": ["read"],
          "scope": "business_unit"
        }
      ],
      "workflowStages": [
        {
          "workflowType": "purchase-request",
          "stage": 1,
          "stageName": "HOD Review",
          "canApprove": true,
          "canReject": true,
          "canReturn": true
        }
      ],
      "specialPermissions": [
        "emergency_approval",
        "delegate_authority"
      ]
    }
  }
}
```

### GET /users/business-units
Get user's business unit assignments.

#### Request
```http
GET /api/v1/users/business-units
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "businessUnits": [
      {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore",
        "code": "GHS",
        "type": "hotel",
        "role": "Manager",
        "department": "F&B",
        "permissions": [
          "inventory.read",
          "inventory.write",
          "purchase-requests.approve"
        ],
        "approvalLimits": {
          "SGD": 10000,
          "USD": 7500
        },
        "assignedDate": "2023-01-15T00:00:00Z",
        "isPrimary": true,
        "isActive": true,
        "locations": [
          {
            "id": "loc_001",
            "name": "Main Store",
            "type": "storage"
          },
          {
            "id": "loc_002",
            "name": "Kitchen Store",
            "type": "storage"
          }
        ]
      },
      {
        "id": "bu_67890",
        "name": "Business Hotel Jakarta",
        "code": "BHJ",
        "type": "hotel",
        "role": "Assistant Manager",
        "department": "F&B",
        "permissions": [
          "inventory.read",
          "purchase-requests.create"
        ],
        "approvalLimits": {
          "IDR": 50000000,
          "USD": 3500
        },
        "assignedDate": "2023-06-01T00:00:00Z",
        "isPrimary": false,
        "isActive": true
      }
    ],
    "currentBusinessUnit": {
      "id": "bu_12345",
      "name": "Grand Hotel Singapore"
    }
  }
}
```

### PUT /users/business-unit
Switch current business unit context.

#### Request
```http
PUT /api/v1/users/business-unit
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "businessUnitId": "bu_67890"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "currentBusinessUnit": {
      "id": "bu_67890",
      "name": "Business Hotel Jakarta",
      "role": "Assistant Manager",
      "permissions": [
        "inventory.read",
        "purchase-requests.create"
      ]
    }
  },
  "message": "Business unit context switched successfully"
}
```

### GET /users/activity
Get user activity history.

#### Request
```http
GET /api/v1/users/activity?page=1&limit=25&dateFrom=2024-01-01&type=login
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity_001",
        "type": "login",
        "description": "User logged in",
        "timestamp": "2024-01-15T09:30:00Z",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
        "location": "Singapore",
        "deviceInfo": {
          "deviceType": "mobile",
          "platform": "iOS",
          "browser": "Safari"
        },
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        }
      },
      {
        "id": "activity_002",
        "type": "document_action",
        "description": "Approved purchase request PR-2024-001",
        "timestamp": "2024-01-15T10:15:00Z",
        "metadata": {
          "documentId": "pr_123",
          "documentType": "purchase-request",
          "action": "approve",
          "workflowStage": 1
        }
      },
      {
        "id": "activity_003",
        "type": "profile_update",
        "description": "Updated profile preferences",
        "timestamp": "2024-01-15T11:30:00Z",
        "changes": [
          {
            "field": "theme",
            "oldValue": "dark",
            "newValue": "light"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 150,
      "totalPages": 6
    }
  }
}
```

### GET /users/sessions
Get active user sessions.

#### Request
```http
GET /api/v1/users/sessions
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "sessions": [
      {
        "sessionId": "session_123",
        "deviceInfo": {
          "deviceName": "iPhone 14",
          "platform": "iOS",
          "browser": "Safari",
          "version": "16.0"
        },
        "location": {
          "country": "Singapore",
          "city": "Singapore",
          "ipAddress": "192.168.1.100"
        },
        "createdAt": "2024-01-15T09:30:00Z",
        "lastActivity": "2024-01-15T11:45:00Z",
        "expiresAt": "2024-01-15T12:00:00Z",
        "isCurrent": true,
        "isActive": true
      },
      {
        "sessionId": "session_124",
        "deviceInfo": {
          "deviceName": "MacBook Pro",
          "platform": "macOS",
          "browser": "Chrome",
          "version": "120.0"
        },
        "location": {
          "country": "Singapore",
          "city": "Singapore",
          "ipAddress": "192.168.1.101"
        },
        "createdAt": "2024-01-14T14:00:00Z",
        "lastActivity": "2024-01-14T18:30:00Z",
        "expiresAt": "2024-01-14T19:00:00Z",
        "isCurrent": false,
        "isActive": false
      }
    ],
    "summary": {
      "totalSessions": 2,
      "activeSessions": 1,
      "currentSession": "session_123"
    }
  }
}
```

### DELETE /users/sessions/{sessionId}
Terminate a specific user session.

#### Request
```http
DELETE /api/v1/users/sessions/session_124
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "sessionId": "session_124",
    "terminatedAt": "2024-01-15T12:00:00Z"
  },
  "message": "Session terminated successfully"
}
```

### POST /users/delegate
Create delegation for workflow approvals.

#### Request
```http
POST /api/v1/users/delegate
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "delegateToUserId": "user_999",
  "workflowTypes": ["purchase-request", "store-requisition"],
  "stages": [1, 2],
  "startDate": "2024-01-20T00:00:00Z",
  "endDate": "2024-01-25T23:59:59Z",
  "reason": "Vacation delegation",
  "approvalLimits": {
    "SGD": 5000,
    "USD": 3750
  },
  "notifyDelegate": true
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "delegation": {
      "id": "delegation_001",
      "delegateFrom": "user_123",
      "delegateTo": "user_999",
      "workflowTypes": ["purchase-request", "store-requisition"],
      "stages": [1, 2],
      "startDate": "2024-01-20T00:00:00Z",
      "endDate": "2024-01-25T23:59:59Z",
      "reason": "Vacation delegation",
      "approvalLimits": {
        "SGD": 5000,
        "USD": 3750
      },
      "isActive": false,
      "createdAt": "2024-01-15T12:30:00Z"
    }
  },
  "message": "Delegation created successfully"
}
```

### GET /users/delegations
Get user's delegations (given and received).

#### Request
```http
GET /api/v1/users/delegations?type=given&status=active
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "delegations": {
      "given": [
        {
          "id": "delegation_001",
          "delegateTo": {
            "id": "user_999",
            "name": "Assistant Manager",
            "email": "assistant@hotel.com"
          },
          "workflowTypes": ["purchase-request"],
          "stages": [1],
          "startDate": "2024-01-20T00:00:00Z",
          "endDate": "2024-01-25T23:59:59Z",
          "reason": "Vacation delegation",
          "status": "pending",
          "documentsProcessed": 0
        }
      ],
      "received": [
        {
          "id": "delegation_002",
          "delegateFrom": {
            "id": "user_456",
            "name": "Senior Manager",
            "email": "senior@hotel.com"
          },
          "workflowTypes": ["store-requisition"],
          "stages": [2],
          "startDate": "2024-01-10T00:00:00Z",
          "endDate": "2024-01-15T23:59:59Z",
          "reason": "Business trip",
          "status": "active",
          "documentsProcessed": 5
        }
      ]
    }
  }
}
```

## Data Models

### User Profile
```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  department: string;
  jobTitle?: string;
  employeeId?: string;
  businessUnits: BusinessUnitAssignment[];
  currentBusinessUnit?: BusinessUnit;
  profile: ProfileDetails;
  preferences: UserPreferences;
  workflowStages: WorkflowStageAssignment[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Business Unit Assignment
```typescript
interface BusinessUnitAssignment {
  id: string;
  name: string;
  code: string;
  type: string;
  role: string;
  department: string;
  permissions: string[];
  approvalLimits: Record<string, number>;
  assignedDate: string;
  isPrimary: boolean;
  isActive: boolean;
  locations?: Location[];
}
```

### User Activity
```typescript
interface UserActivity {
  id: string;
  type: 'login' | 'logout' | 'document_action' | 'profile_update' | 'permission_change';
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  deviceInfo?: DeviceInfo;
  businessUnit?: BusinessUnit;
  metadata?: Record<string, any>;
  changes?: FieldChange[];
}
```

### Delegation
```typescript
interface Delegation {
  id: string;
  delegateFrom: string;
  delegateTo: string;
  workflowTypes: string[];
  stages: number[];
  startDate: string;
  endDate: string;
  reason: string;
  approvalLimits?: Record<string, number>;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  documentsProcessed: number;
  createdAt: string;
}
```

## Error Codes

| Code | Description |
|------|-------------|
| USER_001 | User not found |
| USER_002 | Invalid profile data |
| USER_003 | Permission denied |
| USER_004 | Business unit not accessible |
| USER_005 | Invalid delegation |
| USER_006 | Session not found |
| USER_007 | Avatar upload failed |
| USER_008 | Invalid preferences |
| USER_009 | Delegation conflict |
| USER_010 | Activity log error |

## Business Rules

### Profile Management
- Email addresses must be unique
- Phone numbers must be valid format
- Profile updates require authentication
- Avatar images limited to 5MB

### Business Unit Access
- Users must have at least one business unit
- Primary business unit cannot be removed
- Role changes require admin approval
- Permission changes are audited

### Delegations
- Delegations cannot exceed original authority
- Overlapping delegations not allowed
- Emergency delegations require approval
- Delegation history is maintained

## Examples

### Update User Profile
```typescript
const updateProfile = async (profileData: Partial<UserProfile>) => {
  const response = await fetch('/api/v1/users/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  
  return response.json();
};
```

### Switch Business Unit
```typescript
const switchBusinessUnit = async (businessUnitId: string) => {
  const response = await fetch('/api/v1/users/business-unit', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ businessUnitId })
  });
  
  return response.json();
};
```

### Create Delegation
```typescript
const createDelegation = async (delegationData: DelegationRequest) => {
  const response = await fetch('/api/v1/users/delegate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(delegationData)
  });
  
  return response.json();
};
```