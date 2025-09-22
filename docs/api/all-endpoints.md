# Carmen API – Full Endpoint List with Examples

## Base URL
```
https://carmen-api.semapru.com/api
```

## Required Headers
```http
Authorization: Bearer <access_token>   # (where required)
Content-Type: application/json
x-tenant-id: <tenant_uuid>             # (if multi-tenant)
```
All endpoints require the query parameter `version=latest`.

---

## Authentication

### Login
- **POST** `/api/auth/login?version=latest`  
  Login to the application

**Request Example:**
```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

**Response Example:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "7mb7ddphq5it"
}
```

**Error Example:**
```json
{
  "status": 401,
  "message": "Invalid login credentials"
}
```

---

### Logout
- **POST** `/api/auth/logout?version=latest`  
  Logout from the application

**Request Example:**  
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
Body:
```json
{}
```

**Response Example:**
```json
{
  "response": {
    "status": 200,
    "message": "Logout successful"
  }
}
```

---

### Register
- **POST** `/api/auth/register?version=latest`  
  Register a new user

**Request Example:**
```json
{
  "email": "newuser@test.com",
  "password": "Password123!",
  "name": "New User"
}
```

**Response Example:**
```json
{
  "status": 200,
  "message": "Register successful"
}
```

---

### Invite User
- **POST** `/api/auth/invite-user?version=latest`  
  Invite a new user

**Request Example:**
```json
{
  "email": "invitee@test.com",
  "role": "user"
}
```

**Response Example:**
```json
{
  "status": 200,
  "message": "Invite user successful"
}
```

---

### Register Confirm
- **POST** `/api/auth/register-confirm?version=latest`  
  Confirm a new user

**Request Example:**
```json
{
  "email": "invitee@test.com",
  "confirmationCode": "123456"
}
```

**Response Example:**
```json
{
  "status": 200,
  "message": "Register confirm successful"
}
```

---

### Refresh Token
- **POST** `/api/auth/refresh-token?version=latest`  
  Refresh a token

**Request Example:**
```json
{
  "refresh_token": "7mb7ddphq5it"
}
```

**Response Example:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "new_refresh_token"
}
```

---

### Forgot Password
- **POST** `/api/auth/forgot-password?version=latest`  
  Forgot password

**Request Example:**
```json
{
  "email": "test@test.com"
}
```

**Response Example:**
```json
{
  "status": 200,
  "message": "Forgot password successful"
}
```

---

### Reset Password
- **POST** `/api/auth/reset-password?version=latest`  
  Reset password

**Request Example:**
```json
{
  "resetToken": "reset_token_123",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Response Example:**
```json
{
  "status": 200,
  "message": "Password reset successful"
}
```

---

### Change Password
- **POST** `/api/auth/change-password?version=latest`  
  Change password

**Request Example:**
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Response Example:**
```json
{
  "status": 200,
  "message": "Password changed successfully"
}
```

---

### Get Current User
- **GET** `/api/auth/me?version=latest`  
  Get current authenticated user info

**Request Example:**  
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "test@test.com",
      "name": "Test User"
    }
  }
}
```

---

## User Management

### Get User Profile
- **GET** `/api/users/profile?version=latest`

**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john.doe@hotel.com",
      "name": "John Doe"
    }
  }
}
```

### Update User Profile
- **PUT** `/api/users/profile?version=latest`

**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
Body:
```json
{
  "name": "John Doe Updated",
  "phone": "+65 9123 4567"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### Get User Permissions
- **GET** `/api/users/permissions?version=latest`

**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "permissions": ["inventory.read", "purchase-requests.approve"]
  }
}
```

### Get User Business Units
- **GET** `/api/users/business-units?version=latest`

**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "businessUnits": [
      {"id": "bu_12345", "name": "Grand Hotel Singapore"}
    ]
  }
}
```

### Get Active User Sessions
- **GET** `/api/users/sessions?version=latest`

**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {"sessionId": "session_123", "deviceInfo": {"deviceName": "iPhone 14"}}
    ]
  }
}
```

### Terminate User Session
- **DELETE** `/api/users/sessions/{sessionId}?version=latest`

**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```

**Response Example:**
```json
{
  "success": true,
  "message": "Session terminated successfully"
}
```

### Create Delegation
- **POST** `/api/users/delegate?version=latest`

**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
Body:
```json
{
  "delegateTo": "user_456",
  "workflowType": "purchase-request"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Delegation created successfully"
}
```

---

## Inventory Management

### List Inventory Items
- **GET** `/api/inventory/items?version=latest&page=1&limit=25`
**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
**Response Example:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "item_001",
        "name": "A4 Paper",
        "sku": "A4PAPER",
        "stock": 100,
        "unit": "ream"
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

### Create Inventory Item
- **POST** `/api/inventory/items?version=latest`
**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
Body:
```json
{
  "name": "A4 Paper",
  "sku": "A4PAPER",
  "stock": 100,
  "unit": "ream"
}
```
**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "item_001",
    "name": "A4 Paper",
    "sku": "A4PAPER",
    "stock": 100,
    "unit": "ream"
  },
  "message": "Item created successfully"
}
```

### Get Item Details
- **GET** `/api/inventory/items/{id}?version=latest`
**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "item_001",
    "name": "A4 Paper",
    "sku": "A4PAPER",
    "stock": 100,
    "unit": "ream"
  }
}
```

### Update Item
- **PUT** `/api/inventory/items/{id}?version=latest`
**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
Body:
```json
{
  "name": "A4 Paper Updated",
  "stock": 120
}
```
**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "item_001",
    "name": "A4 Paper Updated",
    "stock": 120
  },
  "message": "Item updated successfully"
}
```

### Delete Item
- **DELETE** `/api/inventory/items/{id}?version=latest`
**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
**Response Example:**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

## Physical Count

### List Physical Count Sessions
- **GET** `/api/physical-count/sessions?version=latest`
**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
**Response Example:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {"id": "pc_session_001", "status": "in-progress"}
    ]
  }
}
```

### Create Physical Count Session
- **POST** `/api/physical-count/sessions?version=latest`
**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
Body:
```json
{
  "location": "Main Store",
  "startedBy": "user_123"
}
```
**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "pc_session_002",
    "status": "in-progress"
  },
  "message": "Session created successfully"
}
```

### Get Physical Count Session Details
- **GET** `/api/physical-count/sessions/{id}?version=latest`
**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "pc_session_001",
    "location": "Main Store",
    "status": "in-progress"
  }
}
```

### Update Physical Count Session Items
- **PUT** `/api/physical-count/sessions/{id}/items?version=latest`
**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
Body:
```json
{
  "items": [
    {"id": "item_001", "counted": 100}
  ]
}
```
**Response Example:**
```json
{
  "success": true,
  "message": "Session items updated successfully"
}
```

### Complete Physical Count Session
- **POST** `/api/physical-count/sessions/{id}/complete?version=latest`
**Request Example:**
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```
Body:
```json
{
  "completedBy": "user_123"
}
```
**Response Example:**
```json
{
  "success": true,
  "message": "Session completed successfully"
}
```

---

## Spot Check
- **GET** `/api/spot-check/sessions?version=latest`  
  List spot check sessions
- **POST** `/api/spot-check/sessions?version=latest`  
  Create session
- **GET** `/api/spot-check/sessions/{id}?version=latest`  
  Get session details
- **PUT** `/api/spot-check/sessions/{id}/items?version=latest`  
  Update checks
- **POST** `/api/spot-check/sessions/{id}/complete?version=latest`  
  Complete check

---

## Notifications
- **GET** `/api/notifications?version=latest`  
  List notifications
- **PUT** `/api/notifications/{id}/read?version=latest`  
  Mark as read
- **DELETE** `/api/notifications/{id}?version=latest`  
  Delete notification
- **POST** `/api/notifications/mark-all-read?version=latest`  
  Mark all as read

---

## Workflow
- **GET** `/api/workflow/stages?version=latest`  
  Get workflow stages
- **POST** `/api/workflow/advance?version=latest`  
  Advance workflow
- **GET** `/api/workflow/permissions?version=latest`  
  Get permissions
- **POST** `/api/workflow/assign?version=latest`  
  Assign workflow

---

## Business Units

### List Business Units
- **GET** `/api/business-units?version=latest`

**Request Example:**  
Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "businessUnits": [
      {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore",
        "type": "hotel",
        "status": "active"
      }
    ]
  }
}
```

- **POST** `/api/business-units?version=latest`  
  Create business unit
- **GET** `/api/business-units/{id}?version=latest`  
  Get business unit details
- **GET** `/api/business-units/{id}/users?version=latest`  
  Get unit users
- **GET** `/api/business-units/{id}/hierarchy?version=latest`  
  Get unit hierarchy
- **POST** `/api/business-unit/default?version=latest`  
  Set default tenant

---

## Reports
- **GET** `/api/reports/templates?version=latest`  
  List report templates
- **POST** `/api/reports/generate?version=latest`  
  Generate report
- **GET** `/api/reports/{id}?version=latest`  
  Get report status
- **GET** `/api/reports/{id}/download?version=latest`  
  Download report
- **POST** `/api/reports/schedule?version=latest`  
  Schedule recurring reports
- **GET** `/api/reports/analytics/performance?version=latest`  
  Retrieve report performance analytics

---

## Receiving
- **GET** `/api/receiving/purchase-orders?version=latest`  
  List purchase orders for receiving
- **GET** `/api/receiving/grns?version=latest`  
  List GRNs
- **POST** `/api/receiving/grns?version=latest`  
  Create GRN
- **GET** `/api/receiving/grns/{id}?version=latest`  
  Get GRN details
- **PUT** `/api/receiving/grns/{id}?version=latest`  
  Update GRN
- **DELETE** `/api/receiving/grns/{id}?version=latest`  
  Delete GRN

---

## Store Requisition
- **GET** `/api/store-requisition?version=latest`  
  List store requisitions
- **POST** `/api/store-requisition?version=latest`  
  Create store requisition
- **GET** `/api/store-requisition/{id}?version=latest`  
  Get store requisition details
- **PUT** `/api/store-requisition/{id}?version=latest`  
  Update store requisition
- **DELETE** `/api/store-requisition/{id}?version=latest`  
  Delete store requisition

---

**Note:**
- All endpoints require `version=latest` as a query parameter.
- Most endpoints require `Authorization` and `x-tenant-id` headers.
- For full request/response schemas and additional endpoints, see the [Swagger JSON](https://carmen-api.semapru.com/swagger-json). 