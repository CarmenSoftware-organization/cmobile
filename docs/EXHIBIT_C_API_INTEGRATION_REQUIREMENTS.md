# EXHIBIT C: API DOCUMENTATION AND INTEGRATION REQUIREMENTS

**Carmen Supply Chain Mobile App Development Agreement**

---

## 1. API ARCHITECTURE OVERVIEW

### 1.1 API Provision by Client
The Client shall provide all backend APIs, database systems, and server infrastructure. The Developer's responsibility is limited to frontend API integration and data consumption only.

### 1.2 API Technology Standards
- **Protocol**: RESTful APIs over HTTPS
- **Authentication**: JWT (JSON Web Token) based authentication
- **Data Format**: JSON request/response format
- **Error Handling**: Standardized HTTP status codes and error messages
- **API Versioning**: Semantic versioning (v1, v2, etc.)

### 1.3 Client API Delivery Timeline
- **Week 1**: Authentication API endpoints
- **Week 2**: Dashboard and core data APIs
- **Week 4**: Receiving and GRN management APIs
- **Week 6**: Approval workflow and store requisition APIs
- **Week 8**: Inventory management and reporting APIs

---

## 2. AUTHENTICATION API REQUIREMENTS

### 2.1 Authentication Endpoints
**2.1.1 User Login**
```
POST /api/v1/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "userpassword",
  "businessUnit": "Grand Hotel Singapore"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "role": "HOD",
    "businessUnits": ["Grand Hotel Singapore"],
    "department": "F&B"
  },
  "expiresIn": 3600
}
```

**2.1.2 Token Refresh**
```
POST /api/v1/auth/refresh
Authorization: Bearer refresh_token

Response:
{
  "success": true,
  "token": "new_jwt_token",
  "expiresIn": 3600
}
```

**2.1.3 Two-Factor Authentication**
```
POST /api/v1/auth/2fa/verify
Content-Type: application/json

Request Body:
{
  "userId": "user_id",
  "code": "123456",
  "method": "sms" // or "email", "totp"
}
```

### 2.2 Business Unit Management
```
GET /api/v1/auth/business-units
Authorization: Bearer jwt_token

Response:
{
  "businessUnits": [
    {
      "id": "bu_1",
      "name": "Grand Hotel Singapore",
      "address": "123 Marina Bay",
      "currency": "SGD"
    }
  ]
}
```

---

## 3. CORE DATA API REQUIREMENTS

### 3.1 Dashboard APIs
**3.1.1 Dashboard Summary**
```
GET /api/v1/dashboard/summary
Authorization: Bearer jwt_token
Query Parameters: ?businessUnit=bu_1

Response:
{
  "priorityActions": {
    "pendingApprovals": 5,
    "pendingSRs": 3
  },
  "operations": {
    "pendingPOs": 12,
    "physicalCountSessions": 2
  },
  "qualityControl": {
    "activeSpotChecks": 1
  }
}
```

### 3.2 Purchase Order APIs
**3.2.1 PO Listing**
```
GET /api/v1/purchase-orders
Authorization: Bearer jwt_token
Query Parameters: ?businessUnit=bu_1&status=Sent&vendor=Aqua+Supplier

Response:
{
  "purchaseOrders": [
    {
      "id": 1,
      "number": "PO-1001",
      "vendor": "Aqua Supplier",
      "businessUnit": "Grand Hotel Singapore",
      "currency": "USD",
      "exchangeRate": 1.0,
      "itemCount": 10,
      "totalValue": "$1,295.00",
      "status": "Sent",
      "eta": "2024-06-01",
      "description": "Bottled water and supplies",
      "vendorId": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

**3.2.2 PO Details with Items**
```
GET /api/v1/purchase-orders/{po_id}
Authorization: Bearer jwt_token

Response:
{
  "purchaseOrder": {
    // Complete PO object with items array
    "items": [
      {
        "product": "Mineral Water 500ml",
        "sku": "SKU12345",
        "qty": 10,
        "orderUnit": "case",
        "price": 12.5,
        "totalAmount": 125.0,
        "itemDetail": {
          "storeLocation": "Main Store",
          "department": "F&B",
          "expiryDate": "2025-01-01"
          // ... complete item detail object
        }
      }
    ]
  }
}
```

---

## 4. GRN AND RECEIVING APIs

### 4.1 GRN Management
**4.1.1 Create GRN**
```
POST /api/v1/grns
Authorization: Bearer jwt_token
Content-Type: application/json

Request Body:
{
  "linkedPOs": ["PO-1001"],
  "vendorId": 1,
  "businessUnit": "Grand Hotel Singapore",
  "receiptLocation": "Main Warehouse",
  "priority": "Medium",
  "items": [
    {
      "sku": "SKU12345",
      "orderedQty": 10,
      "receivedQty": 10,
      "focQty": 0,
      "expiryDate": "2025-01-01",
      "batchNumber": "BT240601001"
    }
  ]
}
```

**4.1.2 Update GRN Status**
```
PUT /api/v1/grns/{grn_id}/status
Authorization: Bearer jwt_token

Request Body:
{
  "status": "Committed",
  "signature": {
    "receiverName": "John Smith",
    "receivedDate": "2024-06-01",
    "receivedTime": "14:30"
  }
}
```

### 4.2 GRN Search and Filtering
```
GET /api/v1/grns
Authorization: Bearer jwt_token
Query Parameters: ?status=Draft&businessUnit=bu_1&vendor=Aqua+Supplier&dateFrom=2024-06-01&dateTo=2024-06-30
```

---

## 5. APPROVAL WORKFLOW APIs

### 5.1 Purchase Request Approval
**5.1.1 PR Listing with Workflow Status**
```
GET /api/v1/purchase-requests
Authorization: Bearer jwt_token
Query Parameters: ?workflowStage=1&status=In-progress&role=HOD

Response:
{
  "purchaseRequests": [
    {
      "id": 1,
      "number": "PR-2024-001",
      "status": "In-progress",
      "workflowStage": 1,
      "requestor": "Alice Manager",
      "department": "F&B",
      "date": "2024-06-01",
      "value": "$1,500.00",
      "currency": "USD",
      "businessUnit": "Grand Hotel Singapore",
      "role": "HOD"
    }
  ]
}
```

**5.1.2 PR Approval Action**
```
POST /api/v1/purchase-requests/{pr_id}/approve
Authorization: Bearer jwt_token

Request Body:
{
  "action": "approve", // or "reject", "return"
  "comments": "Approved for procurement",
  "nextStage": 2
}
```

### 5.2 Store Requisition APIs
```
GET /api/v1/store-requisitions
POST /api/v1/store-requisitions
PUT /api/v1/store-requisitions/{sr_id}
POST /api/v1/store-requisitions/{sr_id}/approve
```

---

## 6. INVENTORY MANAGEMENT APIs

### 6.1 Physical Count APIs
**6.1.1 Count Session Management**
```
POST /api/v1/inventory/physical-count/sessions
GET /api/v1/inventory/physical-count/sessions
PUT /api/v1/inventory/physical-count/sessions/{session_id}
```

**6.1.2 Item Counting**
```
POST /api/v1/inventory/physical-count/sessions/{session_id}/items
PUT /api/v1/inventory/physical-count/sessions/{session_id}/items/{item_id}
```

### 6.2 Spot Check APIs
```
POST /api/v1/inventory/spot-check/sessions
GET /api/v1/inventory/spot-check/locations
POST /api/v1/inventory/spot-check/sessions/{session_id}/items
```

### 6.3 Inventory Data APIs
```
GET /api/v1/inventory/items
GET /api/v1/inventory/locations
GET /api/v1/inventory/categories
```

---

## 7. API INTEGRATION REQUIREMENTS

### 7.1 Authentication Implementation
**7.1.1 Token Management**
- Store JWT tokens securely in device keychain/keystore
- Implement automatic token refresh before expiration
- Handle token expiration gracefully with re-authentication
- Maintain session state across app restarts

**7.1.2 Security Requirements**
- Implement certificate pinning for API calls
- Use HTTPS for all API communications
- Validate SSL certificates
- Implement request/response encryption if required

### 7.2 Error Handling Standards
**7.2.1 HTTP Status Code Handling**
- **200**: Success - process response data
- **400**: Bad Request - show validation errors
- **401**: Unauthorized - redirect to login
- **403**: Forbidden - show access denied message
- **404**: Not Found - show appropriate not found message
- **500**: Server Error - show generic error message
- **503**: Service Unavailable - show maintenance message

**7.2.2 Error Response Format**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### 7.3 Offline Functionality Requirements
**7.3.1 Local Data Storage**
- Cache frequently accessed data locally
- Store draft forms and incomplete transactions
- Implement data synchronization when online
- Handle conflict resolution for simultaneous edits

**7.3.2 Sync Strategy**
- Implement background sync when network available
- Queue offline actions for later execution
- Provide sync status indicators to users
- Handle partial sync failures gracefully

---

## 8. PERFORMANCE AND OPTIMIZATION

### 8.1 API Call Optimization
- Implement request batching where possible
- Use pagination for large data sets
- Implement intelligent caching strategies
- Minimize API calls through efficient data management

### 8.2 Data Loading Strategies
- Implement lazy loading for large datasets
- Use progressive data loading for improved UX
- Cache static data (categories, locations) locally
- Implement data prefetching for predictable workflows

---

## 9. TESTING AND VALIDATION

### 9.1 API Integration Testing
- Unit tests for all API integration functions
- Mock API responses for testing scenarios
- Test error handling and edge cases
- Validate data transformation and parsing

### 9.2 End-to-End Testing
- Test complete user workflows with API integration
- Validate offline/online synchronization
- Test authentication flows and token management
- Verify data integrity across API operations

---

## 10. DOCUMENTATION REQUIREMENTS

### 10.1 Developer Documentation
- API integration architecture documentation
- Authentication flow documentation
- Error handling procedures
- Offline sync strategy documentation

### 10.2 Troubleshooting Guide
- Common API integration issues and solutions
- Network connectivity handling procedures
- Authentication troubleshooting steps
- Data synchronization debugging guide

---

This exhibit ensures proper API integration while maintaining clear separation between frontend and backend responsibilities.