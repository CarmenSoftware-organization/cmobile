# Notifications API

## Overview
The Notifications API manages real-time notifications, alerts, and messaging for the Carmen Supply Chain application. It supports multiple notification types, priority levels, and delivery channels with comprehensive filtering and management capabilities.

## Base URL
```
/api/notifications
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
GET /api/notifications?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### GET /notifications
Retrieve notifications with filtering and pagination.

#### Request
```http
GET /api/notifications?version=latest&page=1&limit=25&type=inventory&priority=high&isRead=false&dateFrom=2024-01-01
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 25, max: 100) |
| type | string | Filter by type (info, warning, success, error, system, inventory, user) |
| priority | string | Filter by priority (low, medium, high) |
| isRead | boolean | Filter by read status |
| dateFrom | string | Filter by date range (ISO 8601) |
| dateTo | string | Filter by date range (ISO 8601) |
| search | string | Search in title and message |
| sort | string | Sort field (date, priority, type) |
| order | string | Sort order (asc, desc) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123",
        "type": "inventory",
        "title": "Low Stock Alert",
        "message": "Premium Coffee Beans is running low (5 units remaining)",
        "priority": "high",
        "isRead": false,
        "timestamp": "2024-01-15T10:30:00Z",
        "actionUrl": "/inventory/items/item_123",
        "metadata": {
          "itemId": "item_123",
          "itemName": "Premium Coffee Beans",
          "currentStock": 5,
          "minimumStock": 25,
          "locationId": "loc_001",
          "locationName": "Main Store"
        },
        "channels": ["app", "email"],
        "deliveryStatus": {
          "app": "delivered",
          "email": "pending"
        },
        "expiresAt": "2024-01-22T10:30:00Z",
        "createdBy": "system",
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        }
      },
      {
        "id": "notif_124",
        "type": "success",
        "title": "GRN Completed",
        "message": "Purchase Order #PO-2024-001 has been successfully received",
        "priority": "medium",
        "isRead": true,
        "timestamp": "2024-01-15T09:00:00Z",
        "actionUrl": "/receiving/grn-detail?po=PO-2024-001",
        "metadata": {
          "poNumber": "PO-2024-001",
          "grnNumber": "GRN-2024-001",
          "vendorName": "Premium Suppliers Ltd",
          "totalValue": 15000.00,
          "currency": "SGD"
        },
        "channels": ["app"],
        "deliveryStatus": {
          "app": "delivered"
        },
        "readAt": "2024-01-15T09:15:00Z",
        "createdBy": "user_456"
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
      "totalNotifications": 150,
      "unreadCount": 25,
      "highPriorityCount": 5,
      "typeBreakdown": {
        "inventory": 45,
        "system": 30,
        "user": 25,
        "success": 20,
        "warning": 15,
        "error": 10,
        "info": 5
      }
    }
  }
}
```

### POST /notifications
Create a new notification.

#### Request
```http
POST /api/notifications?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "type": "warning",
  "title": "Delivery Delay",
  "message": "Expected delivery for PO-2024-002 has been delayed by 2 days",
  "priority": "medium",
  "recipients": [
    {
      "userId": "user_123",
      "channels": ["app", "email"]
    },
    {
      "role": "purchasing",
      "businessUnit": "bu_12345",
      "channels": ["app"]
    }
  ],
  "actionUrl": "/purchasing/orders/PO-2024-002",
  "metadata": {
    "poNumber": "PO-2024-002",
    "originalDate": "2024-01-20T00:00:00Z",
    "newDate": "2024-01-22T00:00:00Z",
    "vendorName": "Supplier ABC"
  },
  "expiresAt": "2024-01-25T00:00:00Z",
  "businessUnit": "bu_12345",
  "tags": ["delivery", "delay", "purchasing"]
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "notification": {
      "id": "notif_125",
      "type": "warning",
      "title": "Delivery Delay",
      "message": "Expected delivery for PO-2024-002 has been delayed by 2 days",
      "priority": "medium",
      "timestamp": "2024-01-15T11:00:00Z",
      "recipients": [
        {
          "userId": "user_123",
          "deliveryStatus": {
            "app": "pending",
            "email": "pending"
          }
        }
      ],
      "createdBy": "user_456"
    }
  },
  "message": "Notification created and queued for delivery"
}
```

### GET /notifications/{id}
Get detailed information for a specific notification.

#### Request
```http
GET /api/notifications/notif_123?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "notification": {
      "id": "notif_123",
      "type": "inventory",
      "title": "Low Stock Alert",
      "message": "Premium Coffee Beans is running low (5 units remaining)",
      "priority": "high",
      "isRead": false,
      "timestamp": "2024-01-15T10:30:00Z",
      "actionUrl": "/inventory/items/item_123",
      "metadata": {
        "itemId": "item_123",
        "itemName": "Premium Coffee Beans",
        "sku": "SKU001",
        "currentStock": 5,
        "minimumStock": 25,
        "locationId": "loc_001",
        "locationName": "Main Store",
        "lastRestockDate": "2024-01-10T00:00:00Z"
      },
      "channels": ["app", "email"],
      "deliveryStatus": {
        "app": "delivered",
        "email": "failed"
      },
      "deliveryAttempts": [
        {
          "channel": "app",
          "status": "delivered",
          "timestamp": "2024-01-15T10:30:01Z"
        },
        {
          "channel": "email",
          "status": "failed",
          "timestamp": "2024-01-15T10:30:05Z",
          "error": "Invalid email address"
        }
      ],
      "relatedNotifications": [
        {
          "id": "notif_120",
          "title": "Stock Level Warning",
          "timestamp": "2024-01-10T10:00:00Z"
        }
      ],
      "actions": [
        {
          "id": "action_001",
          "label": "Reorder Now",
          "url": "/purchase-requests/create?item=item_123",
          "type": "primary"
        },
        {
          "id": "action_002",
          "label": "View Item Details",
          "url": "/inventory/items/item_123",
          "type": "secondary"
        }
      ],
      "expiresAt": "2024-01-22T10:30:00Z",
      "createdBy": "system",
      "businessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "tags": ["inventory", "low-stock", "urgent"]
    }
  }
}
```

### PUT /notifications/{id}/read
Mark a notification as read.

#### Request
```http
PUT /api/notifications/notif_123/read?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "readAt": "2024-01-15T11:30:00Z"
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "notification": {
      "id": "notif_123",
      "isRead": true,
      "readAt": "2024-01-15T11:30:00Z"
    }
  },
  "message": "Notification marked as read"
}
```

### PUT /notifications/{id}/unread
Mark a notification as unread.

#### Request
```http
PUT /api/notifications/notif_123/unread?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "notification": {
      "id": "notif_123",
      "isRead": false,
      "readAt": null
    }
  },
  "message": "Notification marked as unread"
}
```

### DELETE /notifications/{id}
Delete a notification.

#### Request
```http
DELETE /api/notifications/notif_123?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "deletedId": "notif_123"
  },
  "message": "Notification deleted successfully"
}
```

### POST /notifications/mark-all-read
Mark all notifications as read for the current user.

#### Request
```http
POST /api/notifications/mark-all-read?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "filter": {
    "type": "inventory",
    "priority": "high"
  }
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "markedCount": 15,
    "timestamp": "2024-01-15T12:00:00Z"
  },
  "message": "All notifications marked as read"
}
```

### POST /notifications/bulk-delete
Delete multiple notifications.

#### Request
```http
POST /api/notifications/bulk-delete?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "notificationIds": ["notif_123", "notif_124", "notif_125"],
  "filter": {
    "isRead": true,
    "olderThan": "2024-01-01T00:00:00Z"
  }
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "deletedCount": 3,
    "deletedIds": ["notif_123", "notif_124", "notif_125"]
  },
  "message": "Notifications deleted successfully"
}
```

### GET /notifications/unread-count
Get count of unread notifications.

#### Request
```http
GET /api/notifications/unread-count?version=latest&type=inventory&priority=high
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "unreadCount": 25,
    "breakdown": {
      "high": 5,
      "medium": 15,
      "low": 5
    },
    "typeBreakdown": {
      "inventory": 10,
      "system": 5,
      "user": 3,
      "warning": 4,
      "error": 2,
      "success": 1
    }
  }
}
```

### GET /notifications/preferences
Get user notification preferences.

#### Request
```http
GET /api/notifications/preferences?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "preferences": {
      "channels": {
        "app": true,
        "email": true,
        "sms": false,
        "push": true
      },
      "types": {
        "inventory": {
          "enabled": true,
          "priority": "medium",
          "channels": ["app", "email"]
        },
        "system": {
          "enabled": true,
          "priority": "low",
          "channels": ["app"]
        },
        "user": {
          "enabled": true,
          "priority": "medium",
          "channels": ["app", "email"]
        },
        "warning": {
          "enabled": true,
          "priority": "high",
          "channels": ["app", "email", "push"]
        },
        "error": {
          "enabled": true,
          "priority": "high",
          "channels": ["app", "email", "push"]
        },
        "success": {
          "enabled": true,
          "priority": "low",
          "channels": ["app"]
        }
      },
      "quietHours": {
        "enabled": true,
        "start": "22:00",
        "end": "08:00",
        "timezone": "Asia/Singapore"
      },
      "digest": {
        "enabled": true,
        "frequency": "daily",
        "time": "09:00",
        "types": ["inventory", "system"]
      }
    }
  }
}
```

### PUT /notifications/preferences
Update user notification preferences.

#### Request
```http
PUT /api/notifications/preferences?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "channels": {
    "app": true,
    "email": true,
    "sms": false,
    "push": true
  },
  "types": {
    "inventory": {
      "enabled": true,
      "priority": "high",
      "channels": ["app", "email", "push"]
    }
  },
  "quietHours": {
    "enabled": true,
    "start": "23:00",
    "end": "07:00",
    "timezone": "Asia/Singapore"
  }
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "preferences": {
      "channels": {
        "app": true,
        "email": true,
        "sms": false,
        "push": true
      },
      "updatedAt": "2024-01-15T12:30:00Z"
    }
  },
  "message": "Notification preferences updated successfully"
}
```

### POST /notifications/test
Send a test notification.

#### Request
```http
POST /api/notifications/test?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "type": "info",
  "title": "Test Notification",
  "message": "This is a test notification to verify delivery",
  "channels": ["app", "email"]
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "notification": {
      "id": "notif_test_001",
      "deliveryStatus": {
        "app": "delivered",
        "email": "pending"
      }
    }
  },
  "message": "Test notification sent successfully"
}
```

## WebSocket API

### Real-time Notifications
Connect to receive real-time notifications via WebSocket.

#### Connection
```javascript
const ws = new WebSocket('wss://api.carmen-supply.com/ws/notifications');

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: 'your_jwt_token'
}));

// Subscribe to notifications
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'notifications',
  filters: {
    priority: ['high', 'medium'],
    types: ['inventory', 'warning', 'error']
  }
}));
```

#### Message Format
```javascript
// Incoming notification
{
  "type": "notification",
  "data": {
    "id": "notif_126",
    "type": "inventory",
    "title": "Stock Out Alert",
    "message": "Item XYZ is out of stock",
    "priority": "high",
    "timestamp": "2024-01-15T13:00:00Z",
    "actionUrl": "/inventory/items/xyz"
  }
}

// Notification update
{
  "type": "notification_update",
  "data": {
    "id": "notif_123",
    "isRead": true,
    "readAt": "2024-01-15T13:05:00Z"
  }
}

// Unread count update
{
  "type": "unread_count",
  "data": {
    "count": 24
  }
}
```

## Data Models

### Notification
```typescript
interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'system' | 'inventory' | 'user';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  timestamp: string;
  readAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  channels: NotificationChannel[];
  deliveryStatus: Record<string, DeliveryStatus>;
  expiresAt?: string;
  createdBy: string;
  businessUnit?: BusinessUnit;
  tags: string[];
  actions?: NotificationAction[];
}
```

### Notification Preferences
```typescript
interface NotificationPreferences {
  channels: {
    app: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  types: Record<string, TypePreference>;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  digest: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
    types: string[];
  };
}
```

### Notification Action
```typescript
interface NotificationAction {
  id: string;
  label: string;
  url: string;
  type: 'primary' | 'secondary' | 'danger';
  icon?: string;
}
```

## Error Codes

| Code | Description |
|------|-------------|
| NOTIF_001 | Notification not found |
| NOTIF_002 | Invalid notification type |
| NOTIF_003 | Invalid recipient |
| NOTIF_004 | Delivery failed |
| NOTIF_005 | Notification expired |
| NOTIF_006 | Invalid preferences |
| NOTIF_007 | Rate limit exceeded |
| NOTIF_008 | Channel not supported |
| NOTIF_009 | Template not found |
| NOTIF_010 | Subscription failed |

## Business Rules

### Notification Delivery
- High priority notifications bypass quiet hours
- System notifications cannot be disabled
- Failed deliveries are retried up to 3 times
- Notifications expire after 7 days by default

### Rate Limiting
- Maximum 100 notifications per user per hour
- Bulk operations limited to 1000 items
- WebSocket connections limited to 5 per user
- API calls limited to 1000 per hour per user

### Retention Policy
- Read notifications deleted after 30 days
- Unread notifications deleted after 90 days
- System notifications retained for 1 year
- Error notifications retained indefinitely

## Examples

### Create Low Stock Alert
```typescript
const createLowStockAlert = async (itemId: string, currentStock: number) => {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'inventory',
      title: 'Low Stock Alert',
      message: `Item is running low (${currentStock} units remaining)`,
      priority: 'high',
      recipients: [
        { role: 'store_manager', channels: ['app', 'email'] }
      ],
      actionUrl: `/inventory/items/${itemId}`,
      metadata: {
        itemId,
        currentStock,
        alertType: 'low_stock'
      }
    })
  });
  
  return response.json();
};
```

### Subscribe to Real-time Notifications
```typescript
const subscribeToNotifications = (token: string) => {
  const ws = new WebSocket('wss://api.carmen-supply.com/ws/notifications');
  
  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: 'auth',
      token
    }));
    
    ws.send(JSON.stringify({
      type: 'subscribe',
      channel: 'notifications'
    }));
  };
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.type === 'notification') {
      displayNotification(message.data);
    } else if (message.type === 'unread_count') {
      updateUnreadCount(message.data.count);
    }
  };
  
  return ws;
};
```

### Update Notification Preferences
```typescript
const updatePreferences = async (preferences: NotificationPreferences) => {
  const response = await fetch('/api/notifications/preferences', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(preferences)
  });
  
  return response.json();
};
```