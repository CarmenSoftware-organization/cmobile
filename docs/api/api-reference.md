# Carmen Supply Chain API Reference

## Overview
Complete API reference for the Carmen Supply Chain Mobile Application. This document provides a comprehensive guide to all available endpoints, data models, authentication, and integration patterns.

## Quick Start

### Base URLs
```
Production:  https://api.carmen-supply.com/api
Staging:     https://staging-api.carmen-supply.com/api
Development: http://localhost:3001/api
```

> **Note:** All endpoints require the query parameter `version=latest`.

### Authentication
```bash
# Get access token
curl -X POST https://api.carmen-supply.com/api/auth/login?version=latest \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "tenantId": "tenant_12345"
  }'

# Use token in requests
curl -X GET https://api.carmen-supply.com/api/inventory/items?version=latest \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## API Modules

### 🔐 Authentication & Security
- **[Authentication API](./authentication-api.md)** - User login, session management, 2FA
- **[User Management API](./user-management-api.md)** - Profile management, permissions, delegations

### 📦 Inventory Management
- **[Inventory API](./inventory-api.md)** - Items, stock levels, movements, locations
- **[Physical Count API](./physical-count-api.md)** - Count sessions, variance analysis
- **[Spot Check API](./spot-check-api.md)** - Quality verification, compliance checks

### 📋 Procurement & Approvals
- **[Purchase Request API](./purchase-request-api.md)** - PR creation, approval workflows
- **[Store Requisition API](./store-requisition-api.md)** - Internal transfers, approvals
- **[Receiving API](./receiving-api.md)** - GRN management, PO processing

### 🔄 Workflow & Notifications
- **[Workflow API](./workflow-api.md)** - Approval processes, stage management
- **[Notifications API](./notifications-api.md)** - Real-time alerts, messaging

### 🏢 Business Management
- **[Business Units API](./business-units-api.md)** - Multi-tenant operations
- **[Reports API](./reports-api.md)** - Analytics, reporting, exports

## Common Patterns

### Standard Request Format
```json
{
  "data": {
    // Request payload
  },
  "metadata": {
    "requestId": "req_123456789",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Standard Response Format
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "INVALID_FORMAT"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

### Pagination
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

## HTTP Status Codes

### Success Codes
| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 202 | Accepted | Request accepted for processing |
| 204 | No Content | Request successful, no content |

### Client Error Codes
| Code | Status | Description |
|------|--------|-------------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |

### Server Error Codes
| Code | Status | Description |
|------|--------|-------------|
| 500 | Internal Server Error | Server error |
| 502 | Bad Gateway | Gateway error |
| 503 | Service Unavailable | Service temporarily unavailable |
| 504 | Gateway Timeout | Gateway timeout |

## Error Codes Reference

### Authentication Errors (AUTH_xxx)
| Code | Description |
|------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Account locked |
| AUTH_003 | Token expired |
| AUTH_004 | Invalid token |
| AUTH_005 | Two-factor required |

### Inventory Errors (INV_xxx)
| Code | Description |
|------|-------------|
| INV_001 | Item not found |
| INV_002 | Insufficient stock |
| INV_003 | Invalid location |
| INV_004 | Invalid unit conversion |
| INV_005 | Stock adjustment failed |

### Workflow Errors (WF_xxx)
| Code | Description |
|------|-------------|
| WF_001 | Invalid workflow stage |
| WF_002 | Unauthorized workflow action |
| WF_003 | Invalid stage transition |
| WF_004 | Document not found |
| WF_005 | Workflow configuration error |

### Purchase Request Errors (PR_xxx)
| Code | Description |
|------|-------------|
| PR_001 | Purchase request not found |
| PR_002 | Invalid workflow stage |
| PR_003 | Insufficient permissions |
| PR_004 | Invalid approval action |
| PR_005 | Budget validation failed |

## Rate Limiting

### Default Limits
- **Authenticated users**: 1000 requests/hour
- **Public endpoints**: 100 requests/hour
- **Bulk operations**: 50 requests/hour
- **WebSocket connections**: 5 per user

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 3600
```

### Rate Limit Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 3600 seconds.",
    "retryAfter": 3600
  }
}
```

## Webhooks

### Webhook Events
- `inventory.stock_low` - Low stock alert
- `inventory.stock_out` - Out of stock alert
- `purchase_request.approved` - PR approved
- `purchase_request.rejected` - PR rejected
- `physical_count.completed` - Count completed
- `user.login` - User login event

### Webhook Payload
```json
{
  "event": "inventory.stock_low",
  "data": {
    "itemId": "item_123",
    "sku": "SKU001",
    "currentStock": 5,
    "minimumStock": 25,
    "locationId": "loc_001"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "webhookId": "webhook_123"
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { CarmenAPI } from '@carmen-supply/api-client';

const api = new CarmenAPI({
  baseURL: 'https://api.carmen-supply.com/api',
  token: 'your_jwt_token'
});

// Get inventory items
const items = await api.inventory.getItems({
  page: 1,
  limit: 25,
  category: 'beverages'
});

// Create purchase request
const pr = await api.purchaseRequests.create({
  title: 'Office Supplies',
  items: [
    {
      name: 'A4 Paper',
      quantity: 100,
      unit: 'ream'
    }
  ]
});

// Approve purchase request
await api.purchaseRequests.approve(pr.id, {
  comments: 'Approved for purchase'
});
```

### React Hooks
```typescript
import { useInventoryItems, usePurchaseRequests } from '@carmen-supply/react-hooks';

function InventoryPage() {
  const { data: items, loading, error } = useInventoryItems({
    page: 1,
    limit: 25
  });

  const { data: prs } = usePurchaseRequests({
    status: 'pending'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Inventory Items</h1>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Python
```python
from carmen_supply import CarmenAPI

api = CarmenAPI(
    base_url='https://api.carmen-supply.com/api',
    token='your_jwt_token'
)

# Get inventory items
items = api.inventory.get_items(
    page=1,
    limit=25,
    category='beverages'
)

# Create purchase request
pr = api.purchase_requests.create({
    'title': 'Office Supplies',
    'items': [
        {
            'name': 'A4 Paper',
            'quantity': 100,
            'unit': 'ream'
        }
    ]
})
```

## Testing

### Test Environment
```
Base URL: https://test-api.carmen-supply.com/api
```

### Test Credentials
```json
{
  "email": "test@carmen-supply.com",
  "password": "TestPassword123",
  "tenantId": "tenant_test_001"
}
```

### Postman Collection
Download the complete Postman collection with all endpoints:
- [Carmen Supply Chain API.postman_collection.json](./postman/carmen-api.postman_collection.json)

### Test Data
The test environment includes:
- 500+ inventory items
- 50+ purchase requests
- 25+ store requisitions
- 10+ physical count sessions
- 5+ business units

## Integration Examples

### Basic Authentication Flow
```typescript
// 1. Login and get token
const loginResponse = await fetch('/api/auth/login?version=latest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    tenantId: 'tenant_12345'
  })
});

const { data } = await loginResponse.json();
const token = data.tokens.accessToken;

// 2. Use token for API calls
const inventoryResponse = await fetch('/api/inventory/items?version=latest', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Error Handling
```typescript
async function apiCall(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error.error.code, error.error.message);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      // Handle specific API errors
      switch (error.code) {
        case 'AUTH_003':
          // Token expired, refresh token
          await refreshToken();
          break;
        case 'RATE_LIMIT_EXCEEDED':
          // Wait and retry
          await delay(error.retryAfter * 1000);
          break;
        default:
          console.error('API Error:', error.message);
      }
    }
    throw error;
  }
}
```

### Real-time Updates
```typescript
// WebSocket connection for real-time updates
const ws = new WebSocket('wss://api.carmen-supply.com/ws');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    token: accessToken
  }));
  
  // Subscribe to notifications
  ws.send(JSON.stringify({
    type: 'subscribe',
    channels: ['notifications', 'inventory']
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'notification':
      showNotification(message.data);
      break;
    case 'inventory_update':
      updateInventoryDisplay(message.data);
      break;
  }
};
```

## Best Practices

### API Design
- Use RESTful principles
- Implement proper HTTP status codes
- Provide comprehensive error messages
- Support pagination for large datasets
- Use consistent naming conventions

### Security
- Always use HTTPS in production
- Implement proper authentication
- Validate all input data
- Use rate limiting
- Log security events

### Performance
- Implement caching strategies
- Use compression (gzip/brotli)
- Optimize database queries
- Implement connection pooling
- Monitor API performance

### Error Handling
- Provide clear error messages
- Use consistent error formats
- Implement retry logic
- Log errors for debugging
- Handle edge cases gracefully

## Support

### Documentation
- **API Reference**: Complete endpoint documentation
- **SDK Documentation**: Language-specific guides
- **Integration Guides**: Step-by-step integration
- **Best Practices**: Recommended patterns

### Developer Resources
- **Developer Portal**: https://developers.carmen-supply.com
- **API Explorer**: Interactive API testing
- **Code Examples**: Sample implementations
- **Community Forum**: Developer discussions

### Support Channels
- **Technical Support**: api-support@carmen-supply.com
- **Developer Relations**: developers@carmen-supply.com
- **Emergency Support**: +1-800-CARMEN-1
- **Status Page**: https://status.carmen-supply.com

### SLA & Uptime
- **Availability**: 99.9% uptime guarantee
- **Response Time**: < 200ms average
- **Support Response**: < 4 hours
- **Maintenance Windows**: Announced 48 hours in advance

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Complete CRUD operations
- Workflow management
- Real-time notifications
- Multi-tenant support

### Upcoming Features
- GraphQL endpoint
- Bulk operations API
- Advanced analytics
- Mobile SDK
- Offline sync capabilities

---

*Last updated: January 15, 2024*
*API Version: 1.0.0*

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
POST /api/auth/login?version=latest
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```