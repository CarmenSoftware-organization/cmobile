# Carmen Supply Chain Mobile App - Workflow Implementation Guide

## Overview
This document details the implementation of business workflows in the Carmen Supply Chain Mobile App, including approval processes, state management, and role-based access control. All workflows are currently implemented with mock data and comprehensive TypeScript interfaces.

## Core Workflow Engine

### Workflow Configuration
**File**: `src/lib/workflow.ts`

The workflow engine implements a stage-based approval system with role-based access control:

```typescript
// Workflow stage definitions
const WORKFLOW_STAGES = {
  DRAFT: 0,           // Initial creation
  HOD_REVIEW: 1,      // Head of Department review
  FINANCE_REVIEW: 2,  // Finance team review
  VENDOR_ALLOCATION: 3, // Purchasing/vendor allocation
  APPROVED: 4,        // Final approval
  REJECTED: -1,       // Rejected at any stage
  CANCELLED: -3       // Cancelled by requestor
};
```

### Role-Based Access Control
```typescript
// User roles and their workflow permissions
const USER_ROLES = {
  REQUESTOR: "Requestor",     // Can create and edit drafts
  HOD: "HOD",                 // Can approve at stage 1
  FINANCE: "Finance",         // Can approve at stage 2
  PURCHASING: "Purchasing",   // Can approve at stage 3
  ADMIN: "Admin"              // Can act at any stage
};
```

## Purchase Requisition (PR) Workflow

### PR Lifecycle States
**Document Status** (PR-level):
- `Draft`: Initial creation, editable by requestor
- `In-progress`: Submitted for approval, in workflow
- `Returned`: Sent back for corrections
- `Completed`: Fully approved and converted to PO
- `Rejected`: Rejected at any approval stage
- `Cancelled`: Cancelled by requestor or admin

**Item Status** (individual items within PR):
- `Pending`: Awaiting review/approval
- `Approved`: Approved by current stage reviewer
- `Review`: Requires additional review
- `Rejected`: Rejected by current stage reviewer

### Workflow Stage Progression
```typescript
function determineWorkflowAction(pr: PR, items: PRItem[], currentUser: User): WorkflowAction {
  // Priority 1: Check for pending items (highest priority)
  const pendingItems = items.filter(item => item.status === 'Pending');
  if (pendingItems.length > 0) {
    return {
      action: 'review_required',
      message: 'Review Required',
      canSubmit: false,
      reason: 'All items must be reviewed before submission'
    };
  }

  // Priority 2: Check for partial approvals
  const approvedItems = items.filter(item => item.status === 'Approved');
  const rejectedItems = items.filter(item => item.status === 'Rejected');
  
  if (approvedItems.length > 0 && rejectedItems.length > 0) {
    return {
      action: 'partial_approval',
      message: 'Partial Approval',
      canSubmit: true,
      reason: 'Some items approved, some rejected'
    };
  }

  // Priority 3: Check for complete approval/rejection
  if (approvedItems.length === items.length) {
    return {
      action: 'approve_all',
      message: 'Approve All Items',
      canSubmit: true,
      reason: 'All items approved'
    };
  }

  if (rejectedItems.length === items.length) {
    return {
      action: 'reject_all',
      message: 'Reject All Items',
      canSubmit: true,
      reason: 'All items rejected'
    };
  }

  return {
    action: 'review_required',
    message: 'Review Required',
    canSubmit: false,
    reason: 'Items need review'
  };
}
```

### Multi-Currency PR Support
**Implementation**: Complete multi-currency support showing both document currency and base currency:

```typescript
interface PR {
  // Document currency (local business unit currency)
  currency: string;        // "SGD", "IDR", "THB", "USD"
  value: string;          // "S$1,200.00"
  
  // Base currency conversion (USD for reporting)
  exchangeRate: number;    // 0.74 for SGD to USD
  baseCurrency: string;    // "USD"
  baseValue: string;       // "$888.00"
}
```

**Display Logic**:
- **PR List View**: Shows document currency with base currency indicator
- **PR Detail Header**: Shows both values with exchange rate
- **Item Details**: Displays prices in both currencies
- **Approval Summary**: Comprehensive currency breakdown

## Receiving Workflow

### Purchase Order to GRN Process
**Entry Points**:
1. **Pending POs List**: `src/app/(mobile)/receiving/page.tsx`
2. **PO Scanning**: QR code or manual PO number entry
3. **Direct GRN Creation**: For urgent deliveries

### GRN Creation Workflow
```typescript
// GRN workflow states
type GRNStatus = "Draft" | "In Progress" | "Completed" | "Cancelled";

interface GRNWorkflow {
  // Step 1: PO Selection
  selectedPOs: string[];
  
  // Step 2: Business Unit Confirmation
  businessUnit: string;
  
  // Step 3: Location Selection
  receivingLocation: string;
  
  // Step 4: Item Processing
  items: GRNItem[];
  
  // Step 5: Quality Control
  photos: string[];
  notes: string;
  
  // Step 6: Final Review and Submission
  totalAmount: number;
  discrepancies: GRNDiscrepancy[];
}
```

### Unit Conversion Logic
**Implementation**: Automatic conversion between order units and inventory units:

```typescript
interface UnitConversion {
  orderUnit: string;      // "Case"
  inventoryUnit: string;  // "Bottle"
  conversionRate: number; // 24 (bottles per case)
  
  // Calculated fields
  orderedQty: number;     // 2 cases
  baseQty: number;        // 48 bottles (2 × 24)
}
```

## Physical Count Workflow

### Session-Based Counting
**File**: `src/mock/physicalCountData.ts`

Physical counts use locked sessions for audit compliance:

```typescript
interface PhysicalCountSession {
  id: string;
  name: string;
  location: string;
  status: "Draft" | "In Progress" | "Completed";
  createdDate: string;
  items: PhysicalCountItem[];
  
  // Audit trail
  createdBy: string;
  lockedAt?: string;      // When session was locked
  completedAt?: string;   // When counting finished
  reviewedBy?: string;    // Who reviewed the count
}
```

### Count Process Flow
1. **Session Creation**: Select location and create count session
2. **Item Selection**: System generates item list (random or manual)
3. **Session Lock**: Items locked to prevent changes during count
4. **Counting Phase**: Count each item with variance tracking
5. **Review Phase**: Review variances and add notes
6. **Submission**: Submit completed count for processing

### Variance Tracking
```typescript
interface PhysicalCountItem {
  sku: string;
  product: string;
  expectedQty: number;    // System expected quantity
  countedQty: number | null; // Actual counted quantity
  variance?: number;      // Calculated difference
  variancePercent?: number; // Percentage variance
  notes?: string;         // Explanation for variances
}
```

## Spot Check Workflow

### Quality Control Process
**File**: `src/mock/spotCheckData.ts`

Spot checks implement random quality control audits:

```typescript
interface SpotCheckSession {
  id: string;
  location: string;
  method: "random" | "manual";
  itemCount: number;      // Number of items to check
  status: "active" | "completed";
  items: SpotCheckItem[];
  
  // Compliance tracking
  randomSeed?: number;    // For reproducible random selection
  auditTrail: SpotCheckAudit[];
}
```

### Random Item Selection
```typescript
// Random selection algorithm for compliance
function generateRandomItems(location: string, count: number): SpotCheckItem[] {
  const availableItems = getItemsByLocation(location);
  const randomSeed = Date.now(); // Stored for audit trail
  
  // Use seeded random for reproducible results
  const selectedItems = seededRandomSelection(availableItems, count, randomSeed);
  
  return selectedItems.map(item => ({
    ...item,
    expectedQty: item.onHand,
    actualQty: null, // To be filled during count
    variance: undefined
  }));
}
```

## Store Requisition Workflow

### SR Creation and Approval
**File**: `src/app/(mobile)/store-requisition/page.tsx`

Store requisitions follow a simplified approval workflow:

```typescript
interface StoreRequisition {
  id: string;
  number: string;
  status: "Draft" | "Submitted" | "Approved" | "Rejected" | "Fulfilled";
  requestor: string;
  department: string;
  requestDate: string;
  requiredDate: string;
  items: SRItem[];
  
  // Approval workflow
  approver?: string;
  approvalDate?: string;
  rejectionReason?: string;
}
```

### SR Item Management
```typescript
interface SRItem {
  sku: string;
  product: string;
  requestedQty: number;
  approvedQty?: number;   // May differ from requested
  unit: string;
  purpose: string;        // Why item is needed
  priority: "Low" | "Medium" | "High" | "Urgent";
  
  // Inventory context
  onHand: number;
  available: number;      // Available for requisition
  allocated: number;      // Already allocated to other SRs
}
```

## State Persistence and Recovery

### Session Management
**Implementation**: Browser storage for workflow state persistence:

```typescript
// Workflow state persistence
class WorkflowStateManager {
  // Save workflow state
  saveState(workflowType: string, sessionId: string, state: any): void {
    const key = `workflow_${workflowType}_${sessionId}`;
    localStorage.setItem(key, JSON.stringify({
      ...state,
      lastSaved: Date.now(),
      version: "1.0"
    }));
  }

  // Restore workflow state
  restoreState(workflowType: string, sessionId: string): any | null {
    const key = `workflow_${workflowType}_${sessionId}`;
    const saved = localStorage.getItem(key);
    
    if (!saved) return null;
    
    try {
      const state = JSON.parse(saved);
      
      // Check if state is too old (24 hours)
      if (Date.now() - state.lastSaved > 24 * 60 * 60 * 1000) {
        this.clearState(workflowType, sessionId);
        return null;
      }
      
      return state;
    } catch (error) {
      console.error("Failed to restore workflow state:", error);
      return null;
    }
  }
}
```

### Auto-Save Implementation
```typescript
// Auto-save workflow progress
useEffect(() => {
  const autoSaveInterval = setInterval(() => {
    if (workflowState.isDirty) {
      workflowStateManager.saveState(
        workflowType,
        sessionId,
        workflowState
      );
      setWorkflowState(prev => ({ ...prev, isDirty: false }));
    }
  }, 30000); // Auto-save every 30 seconds

  return () => clearInterval(autoSaveInterval);
}, [workflowState.isDirty]);
```

## Error Handling and Validation

### Workflow Validation Rules
```typescript
interface ValidationRule {
  field: string;
  rule: (value: any) => boolean;
  message: string;
}

// Example validation rules
const prValidationRules: ValidationRule[] = [
  {
    field: "items",
    rule: (items) => items.length > 0,
    message: "PR must contain at least one item"
  },
  {
    field: "totalValue",
    rule: (value) => value > 0,
    message: "Total value must be greater than zero"
  },
  {
    field: "businessUnit",
    rule: (bu) => businessUnits.includes(bu),
    message: "Valid business unit must be selected"
  }
];
```

### Error Recovery Patterns
```typescript
// Workflow error recovery
function handleWorkflowError(error: WorkflowError): void {
  switch (error.type) {
    case "VALIDATION_ERROR":
      // Show validation messages
      setValidationErrors(error.details);
      break;
      
    case "PERMISSION_ERROR":
      // Redirect to appropriate page
      router.push("/unauthorized");
      break;
      
    case "SESSION_EXPIRED":
      // Save current state and redirect to login
      workflowStateManager.saveState(workflowType, sessionId, currentState);
      router.push("/login");
      break;
      
    case "NETWORK_ERROR":
      // Show retry option
      setShowRetryDialog(true);
      break;
      
    default:
      // Generic error handling
      setErrorMessage("An unexpected error occurred");
  }
}
```

## Performance Optimization

### Workflow State Optimization
- **Lazy Loading**: Load workflow data only when needed
- **Debounced Saves**: Prevent excessive auto-save operations
- **State Chunking**: Split large workflows into manageable chunks
- **Memory Management**: Clean up completed workflow states

### Mobile-Specific Optimizations
- **Offline Support**: Cache workflow states for offline operation
- **Background Sync**: Sync completed workflows when connection restored
- **Progressive Loading**: Load workflow steps progressively
- **Touch Optimization**: Optimize for touch interactions

## Future Integration Considerations

### API Integration Points
All workflow implementations are designed for easy API integration:
- **RESTful Endpoints**: Standard CRUD operations for each workflow
- **WebSocket Support**: Real-time updates for collaborative workflows
- **Batch Operations**: Efficient bulk operations for large datasets
- **Audit Logging**: Complete audit trail for compliance

### Scalability Considerations
- **Workflow Engine**: Pluggable workflow engine for complex business rules
- **State Management**: Global state management for complex workflows
- **Caching Strategy**: Intelligent caching for frequently accessed data
- **Background Processing**: Async processing for long-running workflows

This document provides comprehensive guidance for implementing and extending business workflows in the Carmen Supply Chain Mobile App, ensuring consistency and maintainability across all workflow implementations.