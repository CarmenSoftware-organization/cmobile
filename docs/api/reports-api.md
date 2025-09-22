# Reports API

## Overview
The Reports API provides comprehensive reporting and analytics capabilities for the Carmen Supply Chain application. This API handles report generation, data export, dashboard analytics, and business intelligence features across all modules.

## Base URL
```
/api/reports
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
GET /api/reports/summary?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### GET /reports/templates
Retrieve available report templates.

#### Request
```http
GET /api/reports/templates?version=latest&category=inventory&businessUnit=bu_12345
Authorization: Bearer <access_token>
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by report category (inventory, purchasing, receiving, financial) |
| businessUnit | string | Filter by business unit |
| type | string | Filter by report type (summary, detailed, analytics) |
| active | boolean | Filter by active status |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template_001",
        "name": "Inventory Summary Report",
        "description": "Summary of inventory levels and movements",
        "category": "inventory",
        "type": "summary",
        "parameters": [
          {
            "name": "dateRange",
            "type": "dateRange",
            "required": true,
            "description": "Report date range"
          },
          {
            "name": "businessUnit",
            "type": "businessUnit",
            "required": true,
            "description": "Business unit selection"
          },
          {
            "name": "category",
            "type": "multiSelect",
            "required": false,
            "options": ["Beverages", "Food", "Supplies"],
            "description": "Item categories to include"
          }
        ],
        "outputFormats": ["pdf", "excel", "csv"],
        "estimatedTime": "2-5 minutes",
        "active": true,
        "createdAt": "2023-01-15T10:30:00Z"
      }
    ]
  },
  "message": "Report templates retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /reports/generate
Generate a new report.

#### Request
```http
POST /api/reports/generate?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "templateId": "template_001",
  "name": "Monthly Inventory Report - January 2024",
  "parameters": {
    "dateRange": {
      "from": "2024-01-01T00:00:00Z",
      "to": "2024-01-31T23:59:59Z"
    },
    "businessUnit": "bu_12345",
    "category": ["Beverages", "Food"],
    "includeVariances": true,
    "groupBy": "category"
  },
  "format": "pdf",
  "schedule": {
    "type": "once",
    "deliveryMethod": "email",
    "recipients": ["manager@carmen.com"]
  }
}
```

#### Response
```http
HTTP/1.1 202 Accepted
{
  "success": true,
  "data": {
    "reportId": "report_123",
    "status": "queued",
    "estimatedCompletionTime": "2024-01-15T10:35:00Z",
    "template": {
      "id": "template_001",
      "name": "Inventory Summary Report"
    },
    "parameters": {
      "dateRange": {
        "from": "2024-01-01T00:00:00Z",
        "to": "2024-01-31T23:59:59Z"
      },
      "businessUnit": "bu_12345"
    },
    "format": "pdf"
  },
  "message": "Report generation queued successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /reports/{id}
Retrieve report status and details.

#### Request
```http
GET /api/reports/report_123?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "report": {
      "id": "report_123",
      "name": "Monthly Inventory Report - January 2024",
      "status": "completed",
      "template": {
        "id": "template_001",
        "name": "Inventory Summary Report",
        "category": "inventory"
      },
      "parameters": {
        "dateRange": {
          "from": "2024-01-01T00:00:00Z",
          "to": "2024-01-31T23:59:59Z"
        },
        "businessUnit": {
          "id": "bu_12345",
          "name": "Grand Hotel Singapore"
        },
        "category": ["Beverages", "Food"]
      },
      "format": "pdf",
      "fileSize": 2457600,
      "pageCount": 15,
      "recordCount": 1250,
      "downloadUrl": "/api/reports/report_123/download",
      "previewUrl": "/api/reports/report_123/preview",
      "expiresAt": "2024-01-22T10:30:00Z",
      "generatedBy": {
        "id": "user_123",
        "name": "Alice Manager"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "completedAt": "2024-01-15T10:33:00Z",
      "processingTime": "00:03:15"
    }
  },
  "message": "Report retrieved successfully",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### GET /reports/{id}/download
Download a completed report.

#### Request
```http
GET /api/reports/report_123/download?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="Monthly_Inventory_Report_January_2024.pdf"
Content-Length: 2457600

[Binary PDF content]
```

### GET /reports/{id}/preview
Get a preview of the report (first page or summary).

#### Request
```http
GET /api/reports/report_123/preview?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "preview": {
      "type": "summary",
      "data": {
        "title": "Monthly Inventory Report - January 2024",
        "period": "2024-01-01 to 2024-01-31",
        "businessUnit": "Grand Hotel Singapore",
        "summary": {
          "totalItems": 1250,
          "totalValue": 125750.00,
          "currency": "SGD",
          "categories": 8,
          "lowStockItems": 25,
          "expiringSoon": 12
        },
        "charts": [
          {
            "type": "pie",
            "title": "Inventory by Category",
            "data": [
              {"category": "Beverages", "value": 45750.00, "percentage": 36.4},
              {"category": "Food", "value": 52500.00, "percentage": 41.8}
            ]
          }
        ]
      }
    }
  },
  "message": "Report preview retrieved successfully",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### DELETE /reports/{id}
Delete a report.

#### Request
```http
DELETE /api/reports/report_123?version=latest
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {},
  "message": "Report deleted successfully",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### GET /reports
Retrieve user's reports with filtering and pagination.

#### Request
```http
GET /api/reports?version=latest&page=1&limit=25&status=completed&category=inventory&dateFrom=2024-01-01
Authorization: Bearer <access_token>
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 25, max: 100) |
| status | string | Filter by status (queued, processing, completed, failed, expired) |
| category | string | Filter by report category |
| templateId | string | Filter by template ID |
| businessUnit | string | Filter by business unit |
| dateFrom | string | Filter from creation date |
| dateTo | string | Filter to creation date |
| generatedBy | string | Filter by user who generated the report |
| sort | string | Sort field (createdAt, completedAt, name) |
| order | string | Sort order (asc, desc) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "report_123",
        "name": "Monthly Inventory Report - January 2024",
        "status": "completed",
        "template": {
          "id": "template_001",
          "name": "Inventory Summary Report",
          "category": "inventory"
        },
        "format": "pdf",
        "fileSize": 2457600,
        "recordCount": 1250,
        "generatedBy": {
          "id": "user_123",
          "name": "Alice Manager"
        },
        "createdAt": "2024-01-15T10:30:00Z",
        "completedAt": "2024-01-15T10:33:00Z",
        "expiresAt": "2024-01-22T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 45,
      "pages": 2
    },
    "summary": {
      "totalReports": 45,
      "statusCounts": {
        "completed": 38,
        "processing": 2,
        "failed": 3,
        "expired": 2
      }
    }
  },
  "message": "Reports retrieved successfully",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### POST /reports/schedule
Schedule a recurring report.

#### Request
```http
POST /api/reports/schedule?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "templateId": "template_001",
  "name": "Weekly Inventory Report",
  "parameters": {
    "businessUnit": "bu_12345",
    "category": ["Beverages", "Food"],
    "includeVariances": true
  },
  "format": "excel",
  "schedule": {
    "type": "weekly",
    "dayOfWeek": 1,
    "time": "09:00",
    "timezone": "Asia/Singapore",
    "startDate": "2024-01-22T00:00:00Z",
    "endDate": "2024-12-31T23:59:59Z"
  },
  "delivery": {
    "method": "email",
    "recipients": [
      "manager@carmen.com",
      "supervisor@carmen.com"
    ],
    "subject": "Weekly Inventory Report - {{date}}",
    "message": "Please find attached the weekly inventory report."
  },
  "active": true
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "schedule": {
      "id": "schedule_123",
      "name": "Weekly Inventory Report",
      "template": {
        "id": "template_001",
        "name": "Inventory Summary Report"
      },
      "schedule": {
        "type": "weekly",
        "dayOfWeek": 1,
        "time": "09:00",
        "timezone": "Asia/Singapore",
        "nextRun": "2024-01-22T09:00:00Z"
      },
      "delivery": {
        "method": "email",
        "recipientCount": 2
      },
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Report schedule created successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /reports/schedules
Retrieve scheduled reports.

#### Request
```http
GET /api/reports/schedules?version=latest&active=true&businessUnit=bu_12345
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "schedules": [
      {
        "id": "schedule_123",
        "name": "Weekly Inventory Report",
        "template": {
          "id": "template_001",
          "name": "Inventory Summary Report",
          "category": "inventory"
        },
        "schedule": {
          "type": "weekly",
          "dayOfWeek": 1,
          "time": "09:00",
          "timezone": "Asia/Singapore",
          "nextRun": "2024-01-22T09:00:00Z",
          "lastRun": "2024-01-15T09:00:00Z"
        },
        "delivery": {
          "method": "email",
          "recipientCount": 2
        },
        "status": "active",
        "runCount": 15,
        "successRate": 93.3,
        "createdAt": "2023-10-15T10:30:00Z"
      }
    ]
  },
  "message": "Scheduled reports retrieved successfully",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### GET /reports/analytics/dashboard
Retrieve analytics dashboard data.

#### Request
```http
GET /api/reports/analytics/dashboard?version=latest&businessUnit=bu_12345&period=30d
Authorization: Bearer <access_token>
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| businessUnit | string | Filter by business unit |
| period | string | Time period (7d, 30d, 90d, 1y) |
| category | string | Filter by category |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "dashboard": {
      "period": {
        "type": "30d",
        "startDate": "2023-12-16T00:00:00Z",
        "endDate": "2024-01-15T23:59:59Z"
      },
      "kpis": {
        "totalReports": {
          "value": 125,
          "change": 15.5,
          "changeType": "increase"
        },
        "averageGenerationTime": {
          "value": "00:03:45",
          "change": -12.3,
          "changeType": "decrease"
        },
        "successRate": {
          "value": 94.2,
          "change": 2.1,
          "changeType": "increase",
          "target": 95.0
        },
        "storageUsed": {
          "value": 15.2,
          "unit": "GB",
          "change": 8.7,
          "changeType": "increase"
        }
      },
      "charts": {
        "reportsByCategory": [
          {
            "category": "inventory",
            "count": 45,
            "percentage": 36.0
          },
          {
            "category": "purchasing",
            "count": 32,
            "percentage": 25.6
          },
          {
            "category": "receiving",
            "count": 28,
            "percentage": 22.4
          },
          {
            "category": "financial",
            "count": 20,
            "percentage": 16.0
          }
        ],
        "dailyGeneration": [
          {
            "date": "2024-01-01",
            "count": 8,
            "successCount": 7,
            "failureCount": 1
          }
        ],
        "popularTemplates": [
          {
            "templateId": "template_001",
            "name": "Inventory Summary Report",
            "usageCount": 25,
            "successRate": 96.0
          }
        ]
      },
      "alerts": [
        {
          "type": "storage_warning",
          "severity": "medium",
          "message": "Report storage usage approaching limit (85%)",
          "actionRequired": true
        }
      ]
    }
  },
  "message": "Analytics dashboard retrieved successfully",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### GET /reports/analytics/performance
Retrieve report performance analytics.

#### Request
```http
GET /api/reports/analytics/performance?version=latest&period=90d&businessUnit=bu_12345
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "performance": {
      "overview": {
        "totalReports": 385,
        "successfulReports": 362,
        "failedReports": 23,
        "successRate": 94.0,
        "averageGenerationTime": "00:03:45",
        "totalProcessingTime": "24:05:30"
      },
      "trends": {
        "weeklyGeneration": [
          {
            "week": "2024-W01",
            "reportCount": 28,
            "averageTime": "00:03:30",
            "successRate": 96.4
          }
        ],
        "performanceByTemplate": [
          {
            "templateId": "template_001",
            "name": "Inventory Summary Report",
            "usageCount": 85,
            "averageTime": "00:02:15",
            "successRate": 97.6,
            "trend": "improving"
          }
        ]
      },
      "bottlenecks": [
        {
          "type": "template",
          "templateId": "template_005",
          "name": "Detailed Financial Report",
          "averageTime": "00:12:30",
          "recommendation": "Consider optimizing query performance"
        }
      ],
      "resourceUsage": {
        "peakHours": ["09:00", "14:00", "17:00"],
        "averageConcurrentReports": 3.2,
        "maxConcurrentReports": 8,
        "storageGrowthRate": 12.5
      }
    }
  },
  "message": "Performance analytics retrieved successfully",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### POST /reports/custom
Create a custom report with SQL query.

#### Request
```http
POST /api/reports/custom?version=latest
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Custom Inventory Analysis",
  "description": "Custom analysis of inventory turnover by category",
  "query": {
    "sql": "SELECT category, SUM(quantity) as total_quantity, AVG(unit_cost) as avg_cost FROM inventory_items WHERE business_unit_id = ? AND created_at >= ? GROUP BY category",
    "parameters": [
      {
        "name": "business_unit_id",
        "type": "string",
        "value": "bu_12345"
      },
      {
        "name": "start_date",
        "type": "date",
        "value": "2024-01-01"
      }
    ]
  },
  "format": "excel",
  "visualization": {
    "charts": [
      {
        "type": "bar",
        "xAxis": "category",
        "yAxis": "total_quantity",
        "title": "Inventory Quantity by Category"
      }
    ]
  }
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "customReport": {
      "id": "custom_123",
      "name": "Custom Inventory Analysis",
      "status": "processing",
      "estimatedCompletionTime": "2024-01-15T10:40:00Z",
      "securityValidated": true,
      "queryComplexity": "medium"
    }
  },
  "message": "Custom report queued successfully",
  "timestamp": "2024-01-15T10:35:00Z"
}
```

## Data Models

### Report Object
```typescript
interface Report {
  id: string;
  name: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'expired';
  template: {
    id: string;
    name: string;
    category: string;
  };
  parameters: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  fileSize?: number;
  pageCount?: number;
  recordCount?: number;
  downloadUrl?: string;
  previewUrl?: string;
  expiresAt?: string;
  generatedBy: User;
  createdAt: string;
  completedAt?: string;
  processingTime?: string;
  errorMessage?: string;
}
```

### Report Template Object
```typescript
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'inventory' | 'purchasing' | 'receiving' | 'financial' | 'analytics';
  type: 'summary' | 'detailed' | 'analytics' | 'custom';
  parameters: ReportParameter[];
  outputFormats: string[];
  estimatedTime: string;
  complexity: 'low' | 'medium' | 'high';
  permissions: string[];
  active: boolean;
  version: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'dateRange' | 'boolean' | 'select' | 'multiSelect' | 'businessUnit';
  required: boolean;
  description: string;
  defaultValue?: any;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
```

### Report Schedule Object
```typescript
interface ReportSchedule {
  id: string;
  name: string;
  template: {
    id: string;
    name: string;
  };
  parameters: Record<string, any>;
  format: string;
  schedule: {
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone: string;
    startDate: string;
    endDate?: string;
    nextRun: string;
    lastRun?: string;
  };
  delivery: {
    method: 'email' | 'webhook' | 'ftp';
    recipients: string[];
    subject?: string;
    message?: string;
  };
  status: 'active' | 'paused' | 'expired';
  runCount: number;
  successRate: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}
```

## Error Codes

### Reports Specific Errors
| Code | Message | Description |
|------|---------|-------------|
| RPT_001 | Report template not found | The specified template ID does not exist |
| RPT_002 | Report not found | The specified report ID does not exist |
| RPT_003 | Invalid report parameters | One or more report parameters are invalid |
| RPT_004 | Report generation failed | Failed to generate the report |
| RPT_005 | Report expired | The report has expired and is no longer available |
| RPT_006 | Unsupported output format | The requested output format is not supported |
| RPT_007 | Report size limit exceeded | The generated report exceeds size limits |
| RPT_008 | Concurrent report limit exceeded | Maximum concurrent reports limit reached |
| RPT_009 | Custom query not allowed | Custom SQL queries are not permitted |
| RPT_010 | Schedule conflict | The schedule conflicts with existing schedules |
| RPT_011 | Insufficient permissions | User lacks permission to generate this report |
| RPT_012 | Report storage full | Report storage quota exceeded |

## Rate Limiting
- **Report generation**: 10 requests per hour per user
- **Report downloads**: 50 requests per hour per user
- **Analytics endpoints**: 100 requests per hour per user
- **Custom reports**: 5 requests per hour per user

## Webhooks
Reports API supports webhooks for real-time notifications:

### Supported Events
- `report.completed`
- `report.failed`
- `report.expired`
- `report.schedule_executed`
- `report.storage_warning`
- `report.template_updated`

### Webhook Payload Example
```json
{
  "event": "report.completed",
  "timestamp": "2024-01-15T10:33:00Z",
  "data": {
    "report": {
      "id": "report_123",
      "name": "Monthly Inventory Report - January 2024",
      "status": "completed",
      "format": "pdf",
      "fileSize": 2457600,
      "downloadUrl": "/api/reports/report_123/download",
      "generatedBy": {
        "id": "user_123",
        "name": "Alice Manager"
      }
    }
  }
}
```