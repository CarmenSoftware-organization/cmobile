# Business Units API

## Overview
The Business Units API manages business unit information, hierarchies, permissions, and organizational structure for the Carmen Supply Chain application. This API handles business unit operations, user assignments, and access control.

## Base URL
```
/api/business-units
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
GET /api/business-units?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### GET /business-units
Retrieve business units with filtering and pagination.

#### Request
```http
GET /api/business-units?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 25, max: 100) |
| type | string | Filter by business unit type (hotel, restaurant, office, warehouse) |
| region | string | Filter by region (APAC, EMEA, Americas) |
| country | string | Filter by country code |
| active | boolean | Filter by active status |
| parentId | string | Filter by parent business unit |
| search | string | Search by name or code |
| sort | string | Sort field (name, code, type, createdAt) |
| order | string | Sort order (asc, desc) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "businessUnits": [
      {
        "id": "bu_12345",
        "code": "GHS001",
        "name": "Grand Hotel Singapore",
        "type": "hotel",
        "description": "Luxury hotel in Marina Bay area",
        "region": "APAC",
        "country": "SG",
        "address": {
          "street": "123 Marina Bay Street",
          "city": "Singapore",
          "state": "Singapore",
          "postalCode": "018956",
          "country": "Singapore"
        },
        "contact": {
          "phone": "+65-6123-4567",
          "email": "info@grandhotel.sg",
          "website": "https://grandhotel.sg"
        },
        "parent": {
          "id": "bu_00001",
          "name": "Carmen Hotels Group",
          "code": "CHG001"
        },
        "hierarchy": {
          "level": 2,
          "path": "CHG001/GHS001"
        },
        "settings": {
          "currency": "SGD",
          "timezone": "Asia/Singapore",
          "language": "en",
          "fiscalYearStart": "01-01"
        },
        "features": {
          "inventory": true,
          "purchasing": true,
          "receiving": true,
          "physicalCount": true,
          "spotCheck": true,
          "storeRequisition": true
        },
        "limits": {
          "maxUsers": 100,
          "maxLocations": 20,
          "approvalLimit": 10000.00,
          "currency": "SGD"
        },
        "status": "active",
        "userCount": 45,
        "locationCount": 8,
        "createdAt": "2023-01-15T10:30:00Z",
        "updatedAt": "2024-01-10T15:45:00Z"
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
      "activeCount": 11,
      "inactiveCount": 1,
      "typeDistribution": {
        "hotel": 8,
        "restaurant": 3,
        "office": 1
      }
    }
  },
  "message": "Business units retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /business-units/{id}
Retrieve a specific business unit with full details.

#### Request
```http
GET /api/business-units/bu_12345?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "businessUnit": {
      "id": "bu_12345",
      "code": "GHS001",
      "name": "Grand Hotel Singapore",
      "type": "hotel",
      "description": "Luxury hotel in Marina Bay area",
      "region": "APAC",
      "country": "SG",
      "address": {
        "street": "123 Marina Bay Street",
        "city": "Singapore",
        "state": "Singapore",
        "postalCode": "018956",
        "country": "Singapore",
        "coordinates": {
          "latitude": 1.2966,
          "longitude": 103.8547
        }
      },
      "contact": {
        "phone": "+65-6123-4567",
        "email": "info@grandhotel.sg",
        "website": "https://grandhotel.sg",
        "manager": {
          "id": "user_123",
          "name": "Alice Manager",
          "email": "alice.manager@carmen.com",
          "phone": "+65-6123-4568"
        }
      },
      "parent": {
        "id": "bu_00001",
        "name": "Carmen Hotels Group",
        "code": "CHG001"
      },
      "children": [
        {
          "id": "bu_12346",
          "name": "Grand Hotel Singapore - Restaurant",
          "code": "GHS001-R",
          "type": "restaurant"
        }
      ],
      "hierarchy": {
        "level": 2,
        "path": "CHG001/GHS001",
        "fullPath": "Carmen Hotels Group / Grand Hotel Singapore"
      },
      "settings": {
        "currency": "SGD",
        "timezone": "Asia/Singapore",
        "language": "en",
        "fiscalYearStart": "01-01",
        "workingHours": {
          "start": "06:00",
          "end": "23:00"
        },
        "notifications": {
          "email": true,
          "sms": false,
          "push": true
        }
      },
      "features": {
        "inventory": true,
        "purchasing": true,
        "receiving": true,
        "physicalCount": true,
        "spotCheck": true,
        "storeRequisition": true,
        "reporting": true,
        "analytics": true
      },
      "limits": {
        "maxUsers": 100,
        "currentUsers": 45,
        "maxLocations": 20,
        "currentLocations": 8,
        "approvalLimit": 10000.00,
        "currency": "SGD",
        "storageQuota": 5000000000,
        "currentStorage": 2500000000
      },
      "compliance": {
        "certifications": ["ISO 9001", "HACCP"],
        "auditDate": "2023-12-15T00:00:00Z",
        "nextAuditDate": "2024-12-15T00:00:00Z",
        "complianceScore": 95.5
      },
      "statistics": {
        "userCount": 45,
        "locationCount": 8,
        "activeInventoryItems": 1250,
        "monthlyTransactions": 2450,
        "averageOrderValue": 875.50
      },
      "status": "active",
      "createdBy": {
        "id": "user_001",
        "name": "System Admin"
      },
      "createdAt": "2023-01-15T10:30:00Z",
      "updatedAt": "2024-01-10T15:45:00Z"
    }
  },
  "message": "Business unit retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /business-units
Create a new business unit.

#### Request
```http
POST /api/business-units?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "code": "BHJ001",
  "name": "Business Hotel Jakarta",
  "type": "hotel",
  "description": "Business hotel in Jakarta CBD",
  "region": "APAC",
  "country": "ID",
  "parentId": "bu_00001",
  "address": {
    "street": "456 Sudirman Street",
    "city": "Jakarta",
    "state": "DKI Jakarta",
    "postalCode": "12190",
    "country": "Indonesia"
  },
  "contact": {
    "phone": "+62-21-1234-5678",
    "email": "info@businesshotel.id",
    "website": "https://businesshotel.id"
  },
  "settings": {
    "currency": "IDR",
    "timezone": "Asia/Jakarta",
    "language": "id",
    "fiscalYearStart": "01-01"
  },
  "features": {
    "inventory": true,
    "purchasing": true,
    "receiving": true,
    "physicalCount": true,
    "spotCheck": true,
    "storeRequisition": true
  },
  "limits": {
    "maxUsers": 75,
    "maxLocations": 15,
    "approvalLimit": 50000000.00,
    "currency": "IDR"
  }
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "businessUnit": {
      "id": "bu_67890",
      "code": "BHJ001",
      "name": "Business Hotel Jakarta",
      "type": "hotel",
      "description": "Business hotel in Jakarta CBD",
      "region": "APAC",
      "country": "ID",
      "parent": {
        "id": "bu_00001",
        "name": "Carmen Hotels Group"
      },
      "hierarchy": {
        "level": 2,
        "path": "CHG001/BHJ001"
      },
      "settings": {
        "currency": "IDR",
        "timezone": "Asia/Jakarta",
        "language": "id"
      },
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Business unit created successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### PUT /business-units/{id}
Update an existing business unit.

#### Request
```http
PUT /api/business-units/bu_12345?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "description": "Premium luxury hotel in Marina Bay area",
  "contact": {
    "phone": "+65-6123-4567",
    "email": "info@grandhotel.sg",
    "website": "https://grandhotel.sg"
  },
  "limits": {
    "maxUsers": 120,
    "approvalLimit": 15000.00
  }
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "businessUnit": {
      "id": "bu_12345",
      "code": "GHS001",
      "name": "Grand Hotel Singapore",
      "description": "Premium luxury hotel in Marina Bay area",
      "limits": {
        "maxUsers": 120,
        "approvalLimit": 15000.00,
        "currency": "SGD"
      },
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  },
  "message": "Business unit updated successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### DELETE /business-units/{id}
Deactivate a business unit (soft delete).

#### Request
```http
DELETE /api/business-units/bu_12345?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "businessUnit": {
      "id": "bu_12345",
      "status": "inactive",
      "deactivatedAt": "2024-01-15T11:00:00Z",
      "deactivatedBy": {
        "id": "user_456",
        "name": "Admin User"
      }
    }
  },
  "message": "Business unit deactivated successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### GET /business-units/{id}/users
Retrieve users assigned to a business unit.

#### Request
```http
GET /api/business-units/bu_12345/users?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 25, max: 100) |
| role | string | Filter by user role |
| department | string | Filter by department |
| active | boolean | Filter by active status |
| search | string | Search by name or email |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "Alice Manager",
        "email": "alice.manager@carmen.com",
        "role": "manager",
        "department": "Operations",
        "permissions": [
          "inventory.read",
          "inventory.write",
          "purchasing.approve"
        ],
        "approvalLimit": 5000.00,
        "currency": "SGD",
        "status": "active",
        "lastLogin": "2024-01-14T16:30:00Z",
        "assignedAt": "2023-06-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 45,
      "pages": 2
    },
    "summary": {
      "totalUsers": 45,
      "activeUsers": 42,
      "inactiveUsers": 3,
      "roleDistribution": {
        "manager": 5,
        "supervisor": 12,
        "staff": 28
      }
    }
  },
  "message": "Business unit users retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /business-units/{id}/users
Assign users to a business unit.

#### Request
```http
POST /api/business-units/bu_12345/users?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "users": [
    {
      "userId": "user_789",
      "role": "staff",
      "department": "F&B",
      "permissions": [
        "inventory.read",
        "receiving.write"
      ],
      "approvalLimit": 1000.00
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
    "assignments": [
      {
        "userId": "user_789",
        "businessUnitId": "bu_12345",
        "role": "staff",
        "department": "F&B",
        "status": "active",
        "assignedAt": "2024-01-15T11:00:00Z"
      }
    ]
  },
  "message": "Users assigned to business unit successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### DELETE /business-units/{id}/users/{userId}
Remove user assignment from a business unit.

#### Request
```http
DELETE /api/business-units/bu_12345/users/user_789?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {},
  "message": "User removed from business unit successfully",
  "timestamp": "2024-01-15T11:00:00Z"
}
```

### GET /business-units/{id}/locations
Retrieve locations within a business unit.

#### Request
```http
GET /api/business-units/bu_12345/locations?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by location type (store, warehouse, kitchen, office) |
| active | boolean | Filter by active status |
| search | string | Search by name or code |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "locations": [
      {
        "id": "loc_123",
        "code": "MS001",
        "name": "Main Store",
        "type": "store",
        "description": "Primary storage location",
        "address": "Ground Floor, Main Building",
        "capacity": {
          "maxVolume": 1000.0,
          "currentVolume": 650.0,
          "unit": "cubic_meters",
          "utilizationRate": 65.0
        },
        "manager": {
          "id": "user_456",
          "name": "Bob Store Manager"
        },
        "features": {
          "temperatureControlled": true,
          "securityLevel": "high",
          "accessRestricted": true
        },
        "status": "active",
        "createdAt": "2023-01-15T10:30:00Z"
      }
    ],
    "summary": {
      "totalLocations": 8,
      "activeLocations": 7,
      "typeDistribution": {
        "store": 4,
        "warehouse": 2,
        "kitchen": 2
      }
    }
  },
  "message": "Business unit locations retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /business-units/{id}/hierarchy
Retrieve business unit hierarchy (parent and children).

#### Request
```http
GET /api/business-units/bu_12345/hierarchy?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| depth | integer | Maximum depth to retrieve (default: 2) |
| includeInactive | boolean | Include inactive business units |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "hierarchy": {
      "current": {
        "id": "bu_12345",
        "code": "GHS001",
        "name": "Grand Hotel Singapore",
        "level": 2
      },
      "parent": {
        "id": "bu_00001",
        "code": "CHG001",
        "name": "Carmen Hotels Group",
        "level": 1
      },
      "ancestors": [
        {
          "id": "bu_00000",
          "code": "ROOT",
          "name": "Carmen Corporation",
          "level": 0
        },
        {
          "id": "bu_00001",
          "code": "CHG001",
          "name": "Carmen Hotels Group",
          "level": 1
        }
      ],
      "children": [
        {
          "id": "bu_12346",
          "code": "GHS001-R",
          "name": "Grand Hotel Singapore - Restaurant",
          "level": 3,
          "type": "restaurant",
          "status": "active"
        },
        {
          "id": "bu_12347",
          "code": "GHS001-K",
          "name": "Grand Hotel Singapore - Kitchen",
          "level": 3,
          "type": "kitchen",
          "status": "active"
        }
      ],
      "descendants": [
        {
          "id": "bu_12346",
          "code": "GHS001-R",
          "name": "Grand Hotel Singapore - Restaurant",
          "level": 3,
          "children": []
        }
      ],
      "path": "ROOT/CHG001/GHS001",
      "fullPath": "Carmen Corporation / Carmen Hotels Group / Grand Hotel Singapore"
    }
  },
  "message": "Business unit hierarchy retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /business-units/{id}/permissions
Retrieve permissions and access control for a business unit.

#### Request
```http
GET /api/business-units/bu_12345/permissions?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "permissions": {
      "features": {
        "inventory": {
          "enabled": true,
          "permissions": ["read", "write", "delete"]
        },
        "purchasing": {
          "enabled": true,
          "permissions": ["read", "write", "approve"]
        },
        "receiving": {
          "enabled": true,
          "permissions": ["read", "write"]
        },
        "physicalCount": {
          "enabled": true,
          "permissions": ["read", "write", "approve"]
        },
        "spotCheck": {
          "enabled": true,
          "permissions": ["read", "write"]
        },
        "storeRequisition": {
          "enabled": true,
          "permissions": ["read", "write", "approve"]
        },
        "reporting": {
          "enabled": true,
          "permissions": ["read", "export"]
        },
        "analytics": {
          "enabled": true,
          "permissions": ["read"]
        }
      },
      "limits": {
        "approvalLimits": {
          "manager": 10000.00,
          "supervisor": 5000.00,
          "staff": 1000.00,
          "currency": "SGD"
        },
        "accessRestrictions": {
          "ipWhitelist": ["192.168.1.0/24"],
          "timeRestrictions": {
            "start": "06:00",
            "end": "23:00",
            "timezone": "Asia/Singapore"
          }
        }
      },
      "inheritance": {
        "inheritsFromParent": true,
        "parentId": "bu_00001",
        "overrides": ["approvalLimits", "timeRestrictions"]
      }
    }
  },
  "message": "Business unit permissions retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Data Models

### Business Unit Object
```typescript
interface BusinessUnit {
  id: string;
  code: string;
  name: string;
  type: 'hotel' | 'restaurant' | 'office' | 'warehouse' | 'kitchen';
  description?: string;
  region: 'APAC' | 'EMEA' | 'Americas';
  country: string;
  address: Address;
  contact: ContactInfo;
  parent?: BusinessUnitReference;
  children?: BusinessUnitReference[];
  hierarchy: HierarchyInfo;
  settings: BusinessUnitSettings;
  features: FeatureFlags;
  limits: BusinessUnitLimits;
  compliance?: ComplianceInfo;
  statistics?: BusinessUnitStatistics;
  status: 'active' | 'inactive' | 'suspended';
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  deactivatedAt?: string;
  deactivatedBy?: User;
}
```

### Business Unit Settings Object
```typescript
interface BusinessUnitSettings {
  currency: string;
  timezone: string;
  language: string;
  fiscalYearStart: string;
  workingHours?: {
    start: string;
    end: string;
  };
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}
```

### Business Unit Limits Object
```typescript
interface BusinessUnitLimits {
  maxUsers: number;
  currentUsers?: number;
  maxLocations: number;
  currentLocations?: number;
  approvalLimit: number;
  currency: string;
  storageQuota?: number;
  currentStorage?: number;
}
```

### Hierarchy Info Object
```typescript
interface HierarchyInfo {
  level: number;
  path: string;
  fullPath?: string;
}
```

### Feature Flags Object
```typescript
interface FeatureFlags {
  inventory: boolean;
  purchasing: boolean;
  receiving: boolean;
  physicalCount: boolean;
  spotCheck: boolean;
  storeRequisition: boolean;
  reporting?: boolean;
  analytics?: boolean;
}
```

## Error Codes

### Business Units Specific Errors
| Code | Message | Description |
|------|---------|-------------|
| BU_001 | Business unit not found | The specified business unit ID does not exist |
| BU_002 | Business unit code already exists | A business unit with this code already exists |
| BU_003 | Invalid parent business unit | The specified parent business unit is invalid |
| BU_004 | Circular hierarchy detected | The operation would create a circular hierarchy |
| BU_005 | Cannot delete business unit with children | Business unit has child units and cannot be deleted |
| BU_006 | User limit exceeded | Maximum number of users for this business unit exceeded |
| BU_007 | Location limit exceeded | Maximum number of locations for this business unit exceeded |
| BU_008 | Invalid business unit type | Business unit type is not valid |
| BU_009 | Permission denied | User lacks permission to access this business unit |
| BU_010 | Cannot modify system business unit | System business units cannot be modified |
| BU_011 | Invalid hierarchy level | Business unit hierarchy level is invalid |
| BU_012 | Feature not enabled | The requested feature is not enabled for this business unit |

## Rate Limiting
- **Standard endpoints**: 100 requests per minute per user
- **Hierarchy operations**: 50 requests per minute per user
- **User management**: 30 requests per minute per user

## Webhooks
Business Units API supports webhooks for real-time notifications:

### Supported Events
- `business_unit.created`
- `business_unit.updated`
- `business_unit.deactivated`
- `business_unit.user_assigned`
- `business_unit.user_removed`
- `business_unit.location_added`
- `business_unit.location_removed`
- `business_unit.limits_exceeded`

### Webhook Payload Example
```json
{
  "event": "business_unit.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "businessUnit": {
      "id": "bu_67890",
      "code": "BHJ001",
      "name": "Business Hotel Jakarta",
      "type": "hotel",
      "region": "APAC",
      "status": "active",
      "createdBy": {
        "id": "user_456",
        "name": "Admin User"
      }
    }
  }
}
```