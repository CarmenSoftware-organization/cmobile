# Carmen Supply Chain Mobile App - Data Models Reference

## Overview
This document provides a comprehensive reference for all data models and interfaces used in the Carmen Supply Chain Mobile App. All models are currently implemented as TypeScript interfaces with mock data for development.

## Core Business Entities

### Purchase Orders (PO)
**File**: `src/data/mockPOData.ts`

```typescript
interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  status: "Open" | "Sent" | "Partially Received" | "Received" | "Closed";
  orderDate: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  currency: string;
  businessUnit: string;
  items: POItem[];
  // ... additional fields
}
```

**Key Features**:
- Multi-currency support with exchange rates
- Status tracking through receiving workflow
- Business unit association
- Comprehensive item details with unit conversions

### Goods Receipt Notes (GRN)
**File**: `src/data/mockGRNData.ts`

```typescript
interface GRNItem {
  product: string;
  sku: string;
  orderedQty: number;
  receivedQty: number;
  focQty: number; // Free of charge quantity
  unit: string;
  unitPrice: number;
  totalAmount: number;
  // Quality control fields
  expiryDate?: string;
  batchNumber?: string;
  storeLocation: string;
  // Inventory management
  onHand: number;
  onOrder: number;
  reorderThreshold: number;
  // ... additional fields
}
```

**Key Features**:
- Complete receiving workflow support
- Quality control data capture
- Inventory level tracking
- Unit conversion handling
- Tax and discount calculations

### Purchase Requisitions (PR)
**File**: `src/lib/workflow.ts`

```typescript
interface PR {
  id: number;
  number: string;
  status: "Draft" | "In-progress" | "Returned" | "Completed" | "Rejected" | "Cancelled";
  workflowStage: number; // 0-4 for progression, negative for rejection/cancellation
  requestor: string;
  department: string;
  date: string;
  value: string;
  business_unit: string;
  role: string; // Required role for current stage
  // Multi-currency support
  currency: string;
  exchangeRate: number;
  baseCurrency: string;
  baseValue: string;
}
```

**Key Features**:
- Multi-stage approval workflow
- Role-based access control
- Multi-currency display
- Complete audit trail

## Authentication and User Management

### User Model
**File**: `src/lib/auth.ts`

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  businessUnits: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  selectedBusinessUnit: string | null;
  twoFactorVerified: boolean;
}
```

**Key Features**:
- Multi-business unit support
- Role-based permissions
- Two-factor authentication state
- Session management

## Inventory Management

### Physical Count Models
**File**: `src/mock/physicalCountData.ts`

```typescript
interface PhysicalCountSession {
  id: string;
  name: string;
  location: string;
  status: "Draft" | "In Progress" | "Completed";
  createdDate: string;
  items: PhysicalCountItem[];
}

interface PhysicalCountItem {
  sku: string;
  product: string;
  expectedQty: number;
  countedQty: number | null;
  unit: string;
  location: string;
  variance?: number;
  notes?: string;
}
```

**Key Features**:
- Session-based counting for audit compliance
- Variance tracking
- Location-specific counts
- Notes and comments support

### Spot Check Models
**File**: `src/mock/spotCheckData.ts`

```typescript
interface SpotCheckSession {
  id: string;
  location: string;
  method: "random" | "manual";
  itemCount: number;
  status: "active" | "completed";
  createdAt: string;
  items: SpotCheckItem[];
}

interface SpotCheckItem {
  sku: string;
  product: string;
  expectedQty: number;
  actualQty: number | null;
  unit: string;
  onHand: number;
  onOrder: number;
  variance?: number;
  notes?: string;
}
```

**Key Features**:
- Random or manual item selection
- Quality control compliance
- On-hand vs on-order tracking
- Variance analysis

## Workflow and Business Logic

### Workflow States
**File**: `src/lib/workflow.ts`

```typescript
// PR Workflow Stages
const WORKFLOW_STAGES = {
  DRAFT: 0,
  HOD_REVIEW: 1,
  FINANCE_REVIEW: 2,
  VENDOR_ALLOCATION: 3,
  APPROVED: 4,
  REJECTED: -1,
  CANCELLED: -3
};

// Document vs Item Status
type DocumentStatus = "Draft" | "In-progress" | "Returned" | "Completed" | "Rejected" | "Cancelled";
type ItemStatus = "Pending" | "Approved" | "Review" | "Rejected";
```

**Key Features**:
- Stage-based progression
- Role-based permissions at each stage
- Separate document and item status tracking
- Rejection and cancellation handling

## Multi-Currency Support

### Currency Configuration
**File**: `src/data/mockGRNData.ts`

```typescript
export const currencyOptions = ['SGD', 'IDR', 'THB', 'USD'] as const;

// Exchange rates to USD (base currency)
const exchangeRates = {
  SGD: 0.74,
  IDR: 0.000067,
  THB: 0.029,
  USD: 1.0
};
```

**Key Features**:
- Multi-property currency support
- USD as base currency for reporting
- Real-time exchange rate display
- Consistent currency formatting

## Business Units and Locations

### Business Unit Configuration
```typescript
const businessUnits = [
  "Grand Hotel Singapore",    // SGD currency
  "Business Hotel Jakarta",   // IDR currency
  "Boutique Hotel Bangkok"    // THB currency
];
```

### Location Types
- **Storage Locations**: Dry Store, Cold Store, Freezer, Bar Store
- **Operational Areas**: Kitchen, Restaurant, Housekeeping
- **Receiving Areas**: Loading Dock, Receiving Bay

## Data Validation Patterns

### Common Validation Rules
- **Quantities**: Must be positive numbers
- **Currencies**: Must match business unit currency
- **Dates**: ISO format strings, future dates for delivery
- **SKUs**: Alphanumeric with specific format patterns
- **Workflow Stages**: Sequential progression with role validation

### Required Fields by Entity
- **PO**: poNumber, vendor, businessUnit, items
- **GRN**: poNumber, receivedItems, totalAmount
- **PR**: number, requestor, department, value, businessUnit
- **User**: email, name, role, businessUnits

## Mock Data Characteristics

### Data Volume
- **Purchase Orders**: 50+ realistic hotel supply orders
- **GRN Items**: 100+ food and beverage items
- **Users**: 20+ users across different roles and business units
- **Inventory Items**: Comprehensive hotel F&B and housekeeping supplies

### Data Relationships
- POs link to specific vendors and business units
- GRN items reference PO items with quantity tracking
- PRs follow approval workflows with role-based routing
- Users have multi-business unit access with role permissions

### Realistic Business Context
- **Hotel-Specific Items**: F&B supplies, housekeeping items, engineering supplies
- **Vendor Relationships**: Realistic vendor names and specializations
- **Seasonal Patterns**: Order quantities and timing reflect hotel operations
- **Compliance Requirements**: Audit trails and approval workflows

## Integration Considerations

### Future API Integration
All current interfaces are designed to map directly to REST API responses:
- Consistent naming conventions
- Proper TypeScript typing
- Nullable fields for optional data
- Standardized date formats

### Database Mapping
Interfaces include fields that map to typical database schemas:
- Primary keys (id fields)
- Foreign key relationships (businessUnit, vendor references)
- Audit fields (createdDate, lastModified)
- Status enumerations

This reference serves as the authoritative guide for all data structures in the Carmen Supply Chain Mobile App, ensuring consistency across development and future API integration.