# Receiving Advanced API

## Overview
The Receiving Advanced API provides extended functionality for the receiving module including batch operations, advanced search, reporting, analytics, variance management, and integration features for the Carmen Supply Chain application.

## Base URL
```
/api/v1/receiving/advanced
```

## Endpoints

### POST /receiving/advanced/batch-grns
Create multiple GRNs in a single batch operation.

#### Request
```http
POST /api/v1/receiving/advanced/batch-grns
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "grns": [
    {
      "purchaseOrderId": "po_123",
      "businessUnitId": "bu_12345",
      "deliveryNote": "DN-2024-001",
      "deliveryDate": "2024-01-15T10:30:00Z",
      "receivedBy": "user_456",
      "items": [
        {
          "purchaseOrderItemId": "poi_123",
          "receivedQuantity": 25,
          "locationId": "loc_123",
          "condition": "good"
        }
      ]
    },
    {
      "purchaseOrderId": "po_124",
      "businessUnitId": "bu_12345",
      "deliveryNote": "DN-2024-002",
      "deliveryDate": "2024-01-15T11:00:00Z",
      "receivedBy": "user_456",
      "items": [
        {
          "purchaseOrderItemId": "poi_125",
          "receivedQuantity": 50,
          "locationId": "loc_124",
          "condition": "good"
        }
      ]
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
    "batchId": "batch_123",
    "results": [
      {
        "purchaseOrderId": "po_123",
        "status": "success",
        "grn": {
          "id": "grn_123",
          "grnNumber": "GRN-2024-001",
          "status": "draft"
        }
      },
      {
        "purchaseOrderId": "po_124",
        "status": "success",
        "grn": {
          "id": "grn_124",
          "grnNumber": "GRN-2024-002",
          "status": "draft"
        }
      }
    ],
    "summary": {
      "total": 2,
      "successful": 2,
      "failed": 0
    }
  },
  "message": "Batch GRN creation completed",
  "timestamp": "2024-01-15T11:30:00Z"
}
```

### POST /receiving/advanced/search
Advanced search for receiving documents with complex filtering.

#### Request
```http
POST /api/v1/receiving/advanced/search
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "filters": {
    "dateRange": {
      "from": "2024-01-01T00:00:00Z",
      "to": "2024-01-31T23:59:59Z"
    },
    "businessUnits": ["bu_12345", "bu_67890"],
    "vendors": ["vendor_123", "vendor_456"],
    "statuses": ["completed", "draft"],
    "valueRange": {
      "min": 100.00,
      "max": 5000.00
    },
    "hasVariances": true,
    "itemCategories": ["Beverages", "Food"],
    "receivedBy": ["user_456", "user_789"],
    "locations": ["loc_123", "loc_124"]
  },
  "sort": {
    "field": "deliveryDate",
    "order": "desc"
  },
  "pagination": {
    "page": 1,
    "limit": 50
  },
  "includeItems": true,
  "includeVariances": true
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "grn_123",
        "grnNumber": "GRN-2024-001",
        "status": "completed",
        "purchaseOrder": {
          "id": "po_123",
          "poNumber": "PO-2024-001"
        },
        "vendor": {
          "id": "vendor_123",
          "name": "Fresh Foods Supplier"
        },
        "deliveryDate": "2024-01-15T10:30:00Z",
        "totalValue": 624.75,
        "hasVariances": true,
        "varianceSummary": {
          "quantityVariances": 1,
          "priceVariances": 0,
          "totalVarianceValue": -24.99
        },
        "items": [
          {
            "id": "grni_123",
            "item": {
              "sku": "SKU001",
              "name": "Premium Coffee Beans",
              "category": "Beverages"
            },
            "receivedQuantity": 24,
            "orderedQuantity": 25,
            "variance": {
              "quantityVariance": -1,
              "hasVariance": true
            }
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1,
      "pages": 1
    },
    "aggregations": {
      "totalValue": 624.75,
      "totalVarianceValue": -24.99,
      "statusCounts": {
        "completed": 1
      },
      "vendorCounts": {
        "vendor_123": 1
      }
    }
  },
  "message": "Advanced search completed",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### GET /receiving/advanced/variances
Retrieve variance analysis and reporting.

#### Request
```http
GET /api/v1/receiving/advanced/variances?dateFrom=2024-01-01&dateTo=2024-01-31&businessUnit=bu_12345&threshold=50
Authorization: Bearer <access_token>
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| dateFrom | string | Start date for variance analysis |
| dateTo | string | End date for variance analysis |
| businessUnit | string | Filter by business unit |
| vendor | string | Filter by vendor |
| threshold | number | Minimum variance value threshold |
| varianceType | string | Filter by variance type (quantity, price, both) |
| category | string | Filter by item category |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "summary": {
      "totalGRNs": 45,
      "grnsWithVariances": 12,
      "varianceRate": 26.67,
      "totalVarianceValue": -1250.75,
      "currency": "SGD"
    },
    "variancesByType": {
      "quantity": {
        "count": 8,
        "totalValue": -875.50,
        "averageValue": -109.44
      },
      "price": {
        "count": 4,
        "totalValue": -375.25,
        "averageValue": -93.81
      }
    },
    "variancesByVendor": [
      {
        "vendor": {
          "id": "vendor_123",
          "name": "Fresh Foods Supplier"
        },
        "varianceCount": 5,
        "totalVarianceValue": -625.00,
        "varianceRate": 41.67
      }
    ],
    "variancesByCategory": [
      {
        "category": "Beverages",
        "varianceCount": 3,
        "totalVarianceValue": -375.25,
        "averageVariance": -125.08
      }
    ],
    "topVariances": [
      {
        "grn": {
          "id": "grn_123",
          "grnNumber": "GRN-2024-001"
        },
        "item": {
          "sku": "SKU001",
          "name": "Premium Coffee Beans"
        },
        "varianceType": "quantity",
        "varianceValue": -249.90,
        "variancePercentage": -10.0,
        "reason": "Damaged packaging"
      }
    ]
  },
  "message": "Variance analysis retrieved successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### GET /receiving/advanced/reports/summary
Generate receiving summary reports.

#### Request
```http
GET /api/v1/receiving/advanced/reports/summary?period=monthly&year=2024&month=1&businessUnit=bu_12345
Authorization: Bearer <access_token>
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| period | string | Report period (daily, weekly, monthly, quarterly, yearly) |
| year | integer | Year for the report |
| month | integer | Month for the report (1-12) |
| quarter | integer | Quarter for the report (1-4) |
| businessUnit | string | Filter by business unit |
| vendor | string | Filter by vendor |
| category | string | Filter by item category |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "reportPeriod": {
      "type": "monthly",
      "year": 2024,
      "month": 1,
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z"
    },
    "summary": {
      "totalGRNs": 45,
      "completedGRNs": 42,
      "draftGRNs": 2,
      "cancelledGRNs": 1,
      "totalValue": 125750.00,
      "currency": "SGD",
      "averageGRNValue": 2794.44,
      "totalItems": 1250,
      "uniqueItems": 85,
      "uniqueVendors": 12
    },
    "trends": {
      "dailyVolume": [
        {
          "date": "2024-01-01",
          "grnCount": 2,
          "totalValue": 3500.00
        },
        {
          "date": "2024-01-02",
          "grnCount": 1,
          "totalValue": 1250.00
        }
      ],
      "weeklyTrend": {
        "currentWeek": 8,
        "previousWeek": 6,
        "changePercentage": 33.33
      }
    },
    "topVendors": [
      {
        "vendor": {
          "id": "vendor_123",
          "name": "Fresh Foods Supplier"
        },
        "grnCount": 12,
        "totalValue": 35750.00,
        "percentage": 28.42
      }
    ],
    "topCategories": [
      {
        "category": "Beverages",
        "grnCount": 15,
        "totalValue": 42500.00,
        "percentage": 33.79
      }
    ],
    "performance": {
      "averageProcessingTime": "02:30:00",
      "onTimeDeliveryRate": 89.5,
      "varianceRate": 12.3,
      "qualityIssueRate": 3.2
    }
  },
  "message": "Summary report generated successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### GET /receiving/advanced/reports/performance
Generate receiving performance reports.

#### Request
```http
GET /api/v1/receiving/advanced/reports/performance?dateFrom=2024-01-01&dateTo=2024-01-31&businessUnit=bu_12345
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "performanceMetrics": {
      "efficiency": {
        "averageProcessingTime": "02:30:00",
        "fastestProcessing": "00:45:00",
        "slowestProcessing": "04:15:00",
        "processingTimeTarget": "02:00:00",
        "targetAchievementRate": 65.5
      },
      "accuracy": {
        "varianceRate": 12.3,
        "quantityAccuracy": 94.2,
        "priceAccuracy": 98.7,
        "qualityIssueRate": 3.2,
        "accuracyTarget": 95.0
      },
      "timeliness": {
        "onTimeDeliveryRate": 89.5,
        "earlyDeliveryRate": 15.2,
        "lateDeliveryRate": 10.5,
        "averageDeliveryDelay": "1.2 days",
        "timelinessTarget": 92.0
      }
    },
    "receiverPerformance": [
      {
        "receiver": {
          "id": "user_456",
          "name": "Bob Receiver"
        },
        "grnCount": 15,
        "averageProcessingTime": "02:15:00",
        "varianceRate": 8.5,
        "qualityScore": 96.2
      }
    ],
    "vendorPerformance": [
      {
        "vendor": {
          "id": "vendor_123",
          "name": "Fresh Foods Supplier"
        },
        "deliveryCount": 12,
        "onTimeRate": 91.7,
        "qualityScore": 94.5,
        "varianceRate": 6.8
      }
    ],
    "trends": {
      "weeklyPerformance": [
        {
          "week": "2024-W01",
          "efficiency": 92.5,
          "accuracy": 94.8,
          "timeliness": 88.2
        }
      ]
    }
  },
  "message": "Performance report generated successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### POST /receiving/advanced/bulk-update
Bulk update multiple GRNs or GRN items.

#### Request
```http
POST /api/v1/receiving/advanced/bulk-update
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "operation": "complete_grns",
  "grnIds": ["grn_123", "grn_124", "grn_125"],
  "updateData": {
    "finalNotes": "Bulk completion - end of day processing",
    "updateInventory": true
  }
}
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "batchId": "bulk_123",
    "operation": "complete_grns",
    "results": [
      {
        "grnId": "grn_123",
        "status": "success",
        "message": "GRN completed successfully"
      },
      {
        "grnId": "grn_124",
        "status": "success",
        "message": "GRN completed successfully"
      },
      {
        "grnId": "grn_125",
        "status": "error",
        "message": "GRN already completed",
        "errorCode": "RCV_003"
      }
    ],
    "summary": {
      "total": 3,
      "successful": 2,
      "failed": 1
    }
  },
  "message": "Bulk update completed",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### GET /receiving/advanced/analytics/dashboard
Retrieve receiving analytics dashboard data.

#### Request
```http
GET /api/v1/receiving/advanced/analytics/dashboard?businessUnit=bu_12345&period=7d
Authorization: Bearer <access_token>
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| businessUnit | string | Filter by business unit |
| period | string | Time period (1d, 7d, 30d, 90d, 1y) |
| compareWith | string | Comparison period (previous, year_ago) |

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "period": {
      "type": "7d",
      "startDate": "2024-01-09T00:00:00Z",
      "endDate": "2024-01-15T23:59:59Z"
    },
    "kpis": {
      "totalGRNs": {
        "value": 12,
        "change": 20.0,
        "changeType": "increase",
        "target": 15
      },
      "totalValue": {
        "value": 35750.00,
        "currency": "SGD",
        "change": 15.5,
        "changeType": "increase"
      },
      "averageProcessingTime": {
        "value": "02:15:00",
        "change": -10.0,
        "changeType": "decrease",
        "target": "02:00:00"
      },
      "varianceRate": {
        "value": 8.5,
        "change": -2.5,
        "changeType": "decrease",
        "target": 5.0
      }
    },
    "charts": {
      "dailyVolume": [
        {
          "date": "2024-01-09",
          "grnCount": 2,
          "value": 5500.00
        },
        {
          "date": "2024-01-10",
          "grnCount": 1,
          "value": 2750.00
        }
      ],
      "vendorDistribution": [
        {
          "vendor": "Fresh Foods Supplier",
          "percentage": 35.5,
          "value": 12750.00
        }
      ],
      "categoryDistribution": [
        {
          "category": "Beverages",
          "percentage": 42.3,
          "value": 15125.00
        }
      ]
    },
    "alerts": [
      {
        "type": "high_variance",
        "severity": "warning",
        "message": "Variance rate above target for vendor Fresh Foods Supplier",
        "actionRequired": true
      }
    ]
  },
  "message": "Analytics dashboard data retrieved successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### POST /receiving/advanced/export
Export receiving data in various formats.

#### Request
```http
POST /api/v1/receiving/advanced/export
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "exportType": "grn_report",
  "format": "excel",
  "filters": {
    "dateFrom": "2024-01-01T00:00:00Z",
    "dateTo": "2024-01-31T23:59:59Z",
    "businessUnit": "bu_12345",
    "status": ["completed"]
  },
  "includeItems": true,
  "includeVariances": true,
  "groupBy": "vendor"
}
```

#### Response
```http
HTTP/1.1 202 Accepted
{
  "success": true,
  "data": {
    "exportId": "export_123",
    "status": "processing",
    "estimatedCompletionTime": "2024-01-15T12:05:00Z",
    "downloadUrl": null
  },
  "message": "Export request submitted successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### GET /receiving/advanced/export/{exportId}
Check export status and download when ready.

#### Request
```http
GET /api/v1/receiving/advanced/export/export_123
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "exportId": "export_123",
    "status": "completed",
    "format": "excel",
    "fileSize": 2457600,
    "recordCount": 45,
    "downloadUrl": "/api/v1/receiving/advanced/export/export_123/download",
    "expiresAt": "2024-01-22T12:00:00Z",
    "createdAt": "2024-01-15T12:00:00Z",
    "completedAt": "2024-01-15T12:03:00Z"
  },
  "message": "Export completed successfully",
  "timestamp": "2024-01-15T12:05:00Z"
}
```

### POST /receiving/advanced/templates
Create receiving templates for common scenarios.

#### Request
```http
POST /api/v1/receiving/advanced/templates
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Weekly Food Delivery",
  "description": "Standard template for weekly food deliveries",
  "businessUnitId": "bu_12345",
  "vendorId": "vendor_123",
  "defaultLocation": "loc_123",
  "items": [
    {
      "itemId": "item_123",
      "defaultQuantity": 25,
      "notes": "Check expiry date"
    },
    {
      "itemId": "item_124",
      "defaultQuantity": 50,
      "notes": "Verify packaging integrity"
    }
  ],
  "defaultNotes": "Standard weekly delivery - check all items for quality",
  "active": true
}
```

#### Response
```http
HTTP/1.1 201 Created
{
  "success": true,
  "data": {
    "template": {
      "id": "template_123",
      "name": "Weekly Food Delivery",
      "description": "Standard template for weekly food deliveries",
      "businessUnit": {
        "id": "bu_12345",
        "name": "Grand Hotel Singapore"
      },
      "vendor": {
        "id": "vendor_123",
        "name": "Fresh Foods Supplier"
      },
      "itemCount": 2,
      "active": true,
      "createdBy": {
        "id": "user_456",
        "name": "Bob Receiver"
      },
      "createdAt": "2024-01-15T12:00:00Z"
    }
  },
  "message": "Receiving template created successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### GET /receiving/advanced/templates
Retrieve receiving templates.

#### Request
```http
GET /api/v1/receiving/advanced/templates?businessUnit=bu_12345&active=true
Authorization: Bearer <access_token>
```

#### Response
```http
HTTP/1.1 200 OK
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template_123",
        "name": "Weekly Food Delivery",
        "description": "Standard template for weekly food deliveries",
        "vendor": {
          "id": "vendor_123",
          "name": "Fresh Foods Supplier"
        },
        "itemCount": 2,
        "usageCount": 15,
        "lastUsed": "2024-01-14T10:30:00Z",
        "active": true
      }
    ]
  },
  "message": "Templates retrieved successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### POST /receiving/advanced/templates/{id}/apply
Apply a template to create a new GRN.

#### Request
```http
POST /api/v1/receiving/advanced/templates/template_123/apply
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "purchaseOrderId": "po_123",
  "deliveryDate": "2024-01-15T10:30:00Z",
  "deliveryNote": "DN-2024-001",
  "overrides": {
    "items": [
      {
        "itemId": "item_123",
        "receivedQuantity": 30
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
    "grn": {
      "id": "grn_123",
      "grnNumber": "GRN-2024-001",
      "status": "draft",
      "templateUsed": {
        "id": "template_123",
        "name": "Weekly Food Delivery"
      },
      "itemCount": 2,
      "totalValue": 874.75
    }
  },
  "message": "GRN created from template successfully",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## Data Models

### Variance Analysis Object
```typescript
interface VarianceAnalysis {
  summary: {
    totalGRNs: number;
    grnsWithVariances: number;
    varianceRate: number;
    totalVarianceValue: number;
    currency: string;
  };
  variancesByType: {
    quantity: VarianceTypeStats;
    price: VarianceTypeStats;
  };
  variancesByVendor: VendorVarianceStats[];
  variancesByCategory: CategoryVarianceStats[];
  topVariances: VarianceDetail[];
}

interface VarianceTypeStats {
  count: number;
  totalValue: number;
  averageValue: number;
}
```

### Receiving Template Object
```typescript
interface ReceivingTemplate {
  id: string;
  name: string;
  description: string;
  businessUnit: {
    id: string;
    name: string;
  };
  vendor: {
    id: string;
    name: string;
  };
  defaultLocation: string;
  items: TemplateItem[];
  defaultNotes: string;
  active: boolean;
  usageCount: number;
  lastUsed?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

interface TemplateItem {
  itemId: string;
  defaultQuantity: number;
  notes?: string;
}
```

### Export Request Object
```typescript
interface ExportRequest {
  exportId: string;
  exportType: 'grn_report' | 'variance_report' | 'performance_report';
  format: 'excel' | 'csv' | 'pdf';
  status: 'processing' | 'completed' | 'failed';
  filters: Record<string, any>;
  fileSize?: number;
  recordCount?: number;
  downloadUrl?: string;
  expiresAt?: string;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}
```

## Error Codes

### Advanced Receiving Specific Errors
| Code | Message | Description |
|------|---------|-------------|
| ARCV_001 | Batch operation failed | One or more operations in the batch failed |
| ARCV_002 | Export generation failed | Failed to generate the requested export |
| ARCV_003 | Template not found | The specified template ID does not exist |
| ARCV_004 | Template application failed | Failed to apply template to create GRN |
| ARCV_005 | Invalid search criteria | Search criteria contains invalid parameters |
| ARCV_006 | Report generation timeout | Report generation exceeded time limit |
| ARCV_007 | Bulk update limit exceeded | Bulk operation exceeds maximum allowed items |
| ARCV_008 | Analytics data unavailable | Analytics data is not available for the requested period |
| ARCV_009 | Export file expired | The export file has expired and is no longer available |
| ARCV_010 | Template already exists | A template with this name already exists |

## Rate Limiting
- **Batch operations**: 5 requests per minute per user
- **Export operations**: 3 requests per minute per user
- **Analytics endpoints**: 20 requests per minute per user
- **Search operations**: 30 requests per minute per user

## Webhooks
Advanced Receiving API supports additional webhook events:

### Supported Events
- `receiving.batch_completed`
- `receiving.export_ready`
- `receiving.variance_threshold_exceeded`
- `receiving.template_created`
- `receiving.template_applied`
- `receiving.performance_alert`

### Webhook Payload Example
```json
{
  "event": "receiving.variance_threshold_exceeded",
  "timestamp": "2024-01-15T12:00:00Z",
  "data": {
    "grn": {
      "id": "grn_123",
      "grnNumber": "GRN-2024-001"
    },
    "variance": {
      "type": "quantity",
      "value": -249.90,
      "percentage": -10.0,
      "threshold": 5.0
    },
    "vendor": {
      "id": "vendor_123",
      "name": "Fresh Foods Supplier"
    }
  }
}
```