# Carmen Supply Chain API Documentation

## Overview
This directory contains comprehensive API documentation for the Carmen Supply Chain Mobile Application. The API follows RESTful principles with JSON payloads, JWT authentication, and comprehensive error handling.

## API Architecture

### Base URL
```
Production: https://api.carmen-supply.com/v1
Staging: https://staging-api.carmen-supply.com/v1
Development: http://localhost:3001/api/v1
```

### Authentication
All API endpoints require JWT authentication unless otherwise specified.

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response Format
All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

### Error Format
Error responses include detailed error information:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

## API Modules

### 1. [Authentication API](./authentication-api.md)
User authentication, session management, and security operations.

**Endpoints:**
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Password reset
- `GET /auth/me` - Current user info

### 2. [User Management API](./user-management-api.md)
User profile management, roles, and permissions.

**Endpoints:**
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/permissions` - Get user permissions
- `GET /users/business-units` - Get user business units

### 3. [Inventory Management API](./inventory-api.md)
Inventory operations, stock levels, and item management.

**Endpoints:**
- `GET /inventory/items` - List inventory items
- `GET /inventory/items/{id}` - Get item details
- `PUT /inventory/items/{id}/stock` - Update stock levels
- `GET /inventory/locations` - List locations
- `GET /inventory/availability` - Check availability

### 4. [Purchase Request API](./purchase-request-api.md)
Purchase request creation, approval workflow, and management.

**Endpoints:**
- `GET /purchase-requests` - List PRs
- `POST /purchase-requests` - Create PR
- `GET /purchase-requests/{id}` - Get PR details
- `PUT /purchase-requests/{id}` - Update PR
- `POST /purchase-requests/{id}/approve` - Approve PR
- `POST /purchase-requests/{id}/reject` - Reject PR

### 5. [Store Requisition API](./store-requisition-api.md)
Store requisition management and approval workflow.

**Endpoints:**
- `GET /store-requisitions` - List SRs
- `POST /store-requisitions` - Create SR
- `GET /store-requisitions/{id}` - Get SR details
- `PUT /store-requisitions/{id}` - Update SR
- `POST /store-requisitions/{id}/approve` - Approve SR
- `POST /store-requisitions/{id}/issue` - Issue items

### 6. [Receiving API](./receiving-api.md)
Goods receiving, GRN management, and PO processing.

**Endpoints:**
- `GET /receiving/purchase-orders` - List POs for receiving
- `GET /receiving/grns` - List GRNs
- `POST /receiving/grns` - Create GRN
- `PUT /receiving/grns/{id}` - Update GRN
- `POST /receiving/grns/{id}/complete` - Complete GRN

**Advanced Features:** See [Receiving Advanced API](./receiving-advanced-api.md) for batch operations, analytics, and reporting.

### 7. [Physical Count API](./physical-count-api.md)
Physical inventory counting sessions and variance management.

**Endpoints:**
- `GET /physical-count/sessions` - List count sessions
- `POST /physical-count/sessions` - Create session
- `GET /physical-count/sessions/{id}` - Get session details
- `PUT /physical-count/sessions/{id}/items` - Update item counts
- `POST /physical-count/sessions/{id}/submit` - Submit count

### 8. [Spot Check API](./spot-check-api.md)
Spot check operations and compliance verification.

**Endpoints:**
- `GET /spot-check/sessions` - List spot check sessions
- `POST /spot-check/sessions` - Create session
- `GET /spot-check/sessions/{id}` - Get session details
- `PUT /spot-check/sessions/{id}/items` - Update checks
- `POST /spot-check/sessions/{id}/complete` - Complete check

### 9. [Notifications API](./notifications-api.md)
Notification management and real-time updates.

**Endpoints:**
- `GET /notifications` - List notifications
- `PUT /notifications/{id}/read` - Mark as read
- `DELETE /notifications/{id}` - Delete notification
- `POST /notifications/mark-all-read` - Mark all as read

### 10. [Workflow API](./workflow-api.md)
Workflow management and approval processes.

**Endpoints:**
- `GET /workflow/stages` - Get workflow stages
- `POST /workflow/advance` - Advance workflow
- `GET /workflow/permissions` - Get permissions
- `POST /workflow/assign` - Assign workflow

### 11. [Business Units API](./business-units-api.md)
Business unit management and organizational structure.

**Endpoints:**
- `GET /business-units` - List business units
- `POST /business-units` - Create business unit
- `GET /business-units/{id}` - Get business unit details
- `GET /business-units/{id}/users` - Get unit users
- `GET /business-units/{id}/hierarchy` - Get unit hierarchy

### 12. [Reports API](./reports-api.md)
Reporting and analytics with comprehensive business intelligence.

**Endpoints:**
- `GET /reports/templates` - List report templates
- `POST /reports/generate` - Generate report
- `GET /reports/{id}` - Get report status
- `GET /reports/{id}/download` - Download report
- `POST /reports/schedule` - Schedule recurring reports

## Common Patterns

### Pagination
All list endpoints support pagination:

```http
GET /api/v1/inventory/items?page=1&limit=25&sort=name&order=asc
```

Response includes pagination metadata:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 150,
      "totalPages": 6,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Filtering
Most endpoints support filtering:

```http
GET /api/v1/purchase-requests?status=pending&department=F&B&businessUnit=hotel1
```

### Sorting
Sorting is supported with `sort` and `order` parameters:

```http
GET /api/v1/inventory/items?sort=name&order=asc
```

### Field Selection
Optimize responses by selecting specific fields:

```http
GET /api/v1/inventory/items?fields=id,name,stock,unit
```

## HTTP Status Codes

### Success Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content returned

### Client Error Codes
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `422 Unprocessable Entity` - Validation errors

### Server Error Codes
- `500 Internal Server Error` - Server error
- `502 Bad Gateway` - Gateway error
- `503 Service Unavailable` - Service temporarily unavailable

## Rate Limiting

API requests are rate limited to ensure fair usage:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Rate Limits
- **Authenticated users**: 1000 requests per hour
- **Public endpoints**: 100 requests per hour
- **Bulk operations**: 50 requests per hour

## Versioning

The API uses URL versioning:
- Current version: `v1`
- Version format: `/api/v{version}/`
- Backward compatibility maintained for at least 12 months

## Security

### Authentication
- JWT tokens with 30-minute expiration
- Refresh tokens with 7-day expiration
- Secure token storage requirements

### Authorization
- Role-based access control (RBAC)
- Business unit isolation
- Permission-based endpoint access

### Data Protection
- HTTPS required for all requests
- Request/response encryption
- PII data masking in logs

## Error Handling

### Error Codes
- `AUTH_001` - Invalid credentials
- `AUTH_002` - Token expired
- `PERM_001` - Insufficient permissions
- `VAL_001` - Validation error
- `BUS_001` - Business rule violation
- `SYS_001` - System error

### Retry Logic
- Implement exponential backoff
- Maximum 3 retry attempts
- Handle rate limiting gracefully

## WebSocket API

Real-time updates via WebSocket:

```javascript
const ws = new WebSocket('wss://api.carmen-supply.com/ws');
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'notifications',
  token: 'jwt_token'
}));
```

### Channels
- `notifications` - Real-time notifications
- `inventory` - Inventory updates
- `workflows` - Workflow status changes

## SDK and Libraries

### JavaScript/TypeScript SDK
```bash
npm install @carmen-supply/api-client
```

```typescript
import { CarmenAPI } from '@carmen-supply/api-client';

const api = new CarmenAPI({
  baseURL: 'https://api.carmen-supply.com/v1',
  token: 'your_jwt_token'
});

const items = await api.inventory.getItems();
```

### React Hooks
```bash
npm install @carmen-supply/react-hooks
```

```typescript
import { useInventoryItems } from '@carmen-supply/react-hooks';

const { data, loading, error } = useInventoryItems({
  page: 1,
  limit: 25
});
```

## Testing

### Test Environment
```
Base URL: https://test-api.carmen-supply.com/v1
Test Credentials: Available in developer portal
```

### Postman Collection
Download the complete Postman collection:
[Carmen Supply Chain API.postman_collection.json](./postman/carmen-api.postman_collection.json)

## Support

### Documentation
- API Reference: [https://docs.carmen-supply.com/api](https://docs.carmen-supply.com/api)
- Developer Portal: [https://developers.carmen-supply.com](https://developers.carmen-supply.com)

### Contact
- Technical Support: api-support@carmen-supply.com
- Developer Relations: developers@carmen-supply.com
- Emergency: +1-800-CARMEN-1