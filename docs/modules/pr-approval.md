# Purchase Request (PR) Approval Module

## Overview
The Purchase Request (PR) Approval module provides a comprehensive workflow management system for purchase request approvals. It supports multi-stage approval processes, role-based permissions, item-level management, and business dimension tracking for complete procurement control.

## Location
- **Primary Module**: `src/app/(mobile)/pr-approval/`
- **Workflow Configuration**: `src/lib/workflow.ts`
- **Related Components**: UI components for approval workflows

## Key Features

### 1. Multi-Stage Approval Workflow
- **Draft Stage**: Initial PR creation and preparation
- **HOD Review**: Head of Department approval
- **Finance Review**: Financial validation and approval
- **Vendor Allocation**: Purchasing department vendor selection
- **Final Approval**: Completion and conversion to Purchase Order

### 2. Role-Based Access Control
- **Requestor**: Create and edit draft PRs
- **HOD**: Review and approve department requests
- **Finance**: Financial validation and approval
- **Purchasing**: Vendor allocation and final processing

### 3. Item-Level Management
- Detailed item specifications and requirements
- Quantity and unit management with conversions
- Vendor price comparisons
- Business dimension tracking
- Approval status per item

### 4. Advanced Filtering and Search
- Multi-criteria filtering (status, business unit, department, role)
- Date range filtering
- Currency-based filtering
- Real-time search capabilities

### 5. Multi-Currency Support
- Local currency display with base currency conversion
- Exchange rate management
- Currency-specific formatting
- Cross-currency value comparisons

## Module Structure

### PR Approval List (`/pr-approval`)
Central dashboard showing:
- PR listing with status indicators
- Advanced filtering options
- Role-based action availability
- Multi-currency value display

### PR Detail View (`/pr-approval/[id]`)
Comprehensive PR management interface:
- Item-level approval workflow
- Vendor price comparison
- Inventory availability checking
- Business dimension management
- Bulk action capabilities

## Data Models

### Purchase Request Interface
```typescript
interface PR {
  id: number;
  number: string;
  status: string; // Document status
  workflowStage: number; // Workflow stage (0-4)
  requestor: string;
  department: string;
  date: string;
  value: string;
  business_unit: string;
  role: string; // Required role for current stage
  lastAction?: string;
  prType?: string; // "Market List" or "General"
  // Multi-currency support
  currency: string;
  exchangeRate: number;
  baseCurrency: string;
  baseValue: string;
}
```

### PR Item Interface
```typescript
interface Item {
  id: number;
  name: string;
  sku: string;
  status: "Pending" | "Approved" | "Review" | "Rejected" | "Converted";
  requested: number;
  unit: string;
  onHand: number;
  onOrder: number;
  comments: string;
  imageUrl: string;
  unitOptions?: string[];
  inventoryUnit: string;
  unitPrice: number;
  totalPrice: number;
  vendorPrices: VendorPrice[];
  selectedVendor: string;
  approvedQuantity: string;
  approvedUnit: string;
  currency: string;
  baseCurrencyPrice?: number;
  baseCurrencyTotal?: number;
  location?: string;
  requiredDate: string;
  vendor: string;
  pricelistNumber: string;
  businessDimensions?: BusinessDimensions;
}
```

### Business Dimensions Interface
```typescript
interface BusinessDimensions {
  projectCode?: string;
  costCenter?: string;
  marketSegment?: string;
  event?: string;
  department?: string;
  region?: string;
}
```

## Workflow Management

### Workflow Stages
1. **Draft (Stage 0)**: PR creation and preparation
   - **Roles**: Requestor
   - **Actions**: Create, edit, submit
   - **Status**: Draft

2. **HOD Review (Stage 1)**: Department head approval
   - **Roles**: HOD (Head of Department)
   - **Actions**: Approve, reject, return for changes
   - **Status**: In-progress, Returned

3. **Finance Review (Stage 2)**: Financial validation
   - **Roles**: Finance
   - **Actions**: Approve, reject, return for changes
   - **Status**: In-progress, Returned

4. **Vendor Allocation (Stage 3)**: Purchasing processing
   - **Roles**: Purchasing
   - **Actions**: Allocate vendors, approve, convert to PO
   - **Status**: In-progress, Returned

5. **Approved (Stage 4)**: Final approval
   - **Roles**: None (terminal stage)
   - **Actions**: View only
   - **Status**: Completed, Converted

### Terminal Stages
- **Rejected (Stage -1)**: PR rejected at any stage
- **Cancelled (Stage -3)**: PR cancelled by requestor

### Role Permissions Matrix
```typescript
const rolePermissions = {
  "Requestor": { 
    canView: [0, 1, 2, 3, 4], 
    canEdit: [0], 
    canApprove: [],
    canCreate: true
  },
  "HOD": { 
    canView: [0, 1, 2, 3, 4], 
    canEdit: [1], 
    canApprove: [1],
    canCreate: false
  },
  "Finance": { 
    canView: [0, 1, 2, 3, 4], 
    canEdit: [2], 
    canApprove: [2],
    canCreate: false
  },
  "Purchasing": {
    canView: [0, 1, 2, 3, 4],
    canEdit: [3],
    canApprove: [3],
    canCreate: false
  }
};
```

## Item Management Features

### Inventory Integration
- **On Hand Quantities**: Real-time inventory levels by location
- **On Order Tracking**: Purchase order status and delivery dates
- **Minimum/Maximum Levels**: Inventory control parameters
- **Location-Based Availability**: Multi-location inventory visibility

### Vendor Management
- **Price Comparison**: Multiple vendor pricing
- **Vendor Selection**: Purchasing team vendor allocation
- **Price History**: Historical pricing data
- **Vendor Performance**: Delivery and quality metrics

### Unit Management
- **Unit Conversions**: Flexible unit handling
- **Inventory Units**: System inventory unit tracking
- **Purchase Units**: Vendor-specific purchase units
- **Unit Options**: Available unit selections per item

## Advanced Features

### Bulk Operations
- **Bulk Selection**: Select all or filtered items
- **Bulk Approval**: Approve multiple items simultaneously
- **Bulk Rejection**: Reject multiple items with reasons
- **Bulk Status Updates**: Change status for multiple items

### Business Intelligence
- **Spending Analysis**: Department and category spending
- **Approval Metrics**: Approval time and efficiency
- **Vendor Performance**: Vendor comparison and analysis
- **Currency Impact**: Exchange rate impact analysis

### Audit Trail
- **Action Logging**: Complete audit trail of all actions
- **User Tracking**: Who performed what actions when
- **Status History**: Complete status change history
- **Comment Tracking**: All comments and justifications

## Mobile Optimization

### Touch Interface
- **Large Touch Targets**: Optimized for mobile interaction
- **Swipe Gestures**: Navigate between items and sections
- **Pull-to-Refresh**: Update data with pull gesture
- **Responsive Design**: Adapts to various screen sizes

### Performance Features
- **Lazy Loading**: Efficient loading of large PR lists
- **Caching**: Local caching for offline access
- **Optimized Rendering**: Smooth scrolling and interactions
- **Background Sync**: Automatic data synchronization

## Integration Points

### With Workflow Management Module
- **Workflow Engine**: Core workflow processing
- **Status Management**: Document status transitions
- **Permission Validation**: Role-based access control
- **Stage Progression**: Automatic stage advancement

### With Authentication Module
- **User Context**: Current user role and permissions
- **Business Unit Access**: Multi-tenant support
- **Session Management**: Secure session handling
- **Audit Logging**: User action tracking

### With Receiving Module
- **PO Conversion**: Convert approved PRs to Purchase Orders
- **Vendor Integration**: Shared vendor information
- **Item Specifications**: Consistent item data
- **Delivery Tracking**: Link to receiving processes

## Usage Examples

### Checking User Permissions
```typescript
import { canUserActOnPR, rolePermissions } from '@/lib/workflow';

const canApprove = canUserActOnPR(pr, currentUser.role);
const canEdit = rolePermissions[currentUser.role]?.canEdit.includes(pr.workflowStage);
```

### Filtering PRs by Role
```typescript
const filteredPRs = prApprovals.filter(pr => {
  const canView = canUserViewPR(pr, currentUser.role);
  const canAct = canUserActOnPR(pr, currentUser.role);
  
  return showOnlyActionable ? canAct : canView;
});
```

### Bulk Item Operations
```typescript
const handleBulkApproval = async (itemIds: number[], comments: string) => {
  const updates = itemIds.map(id => ({
    id,
    status: 'Approved',
    approvedBy: currentUser.name,
    approvedAt: new Date().toISOString(),
    comments
  }));
  
  await updateItems(updates);
  setSelectedItems([]);
};
```

## Error Handling

### Validation Errors
- **Required Field Validation**: Ensure all required fields are completed
- **Business Rule Validation**: Enforce business logic constraints
- **Permission Validation**: Verify user permissions for actions
- **Data Consistency**: Maintain data integrity across operations

### Network Errors
- **Offline Mode**: Continue working offline with local data
- **Retry Mechanisms**: Automatic retry for failed operations
- **Conflict Resolution**: Handle concurrent user modifications
- **Error Recovery**: Graceful recovery from network issues

### User Experience Errors
- **Clear Error Messages**: User-friendly error descriptions
- **Validation Feedback**: Real-time validation feedback
- **Recovery Options**: Provide options to resolve errors
- **Help Documentation**: Context-sensitive help

## Performance Considerations

### Data Loading
- **Pagination**: Efficient loading of large PR lists
- **Filtering**: Server-side filtering for performance
- **Caching**: Strategic caching of frequently accessed data
- **Lazy Loading**: Load item details on demand

### Mobile Performance
- **Optimized Rendering**: Efficient React rendering
- **Memory Management**: Prevent memory leaks
- **Battery Optimization**: Minimize battery usage
- **Network Efficiency**: Optimize API calls

## Future Enhancements

### Advanced Workflow Features
- **Parallel Approvals**: Support for parallel approval paths
- **Conditional Routing**: Dynamic workflow routing based on criteria
- **Escalation Rules**: Automatic escalation for delayed approvals
- **Workflow Templates**: Configurable workflow templates

### AI and Automation
- **Smart Vendor Selection**: AI-powered vendor recommendations
- **Predictive Analytics**: Forecast approval times and bottlenecks
- **Automated Categorization**: Auto-categorize items and PRs
- **Intelligent Routing**: Smart workflow routing

### Integration Enhancements
- **ERP Integration**: Direct integration with ERP systems
- **Supplier Portals**: Integration with supplier systems
- **Contract Management**: Link to contract management systems
- **Budget Integration**: Real-time budget checking and allocation

## Dependencies
- Next.js for routing and navigation
- React for UI components
- TypeScript for type safety
- Workflow management library
- Authentication module
- UI components library
- Multi-currency support utilities

## Testing Considerations

### Unit Testing
- Workflow logic validation
- Permission checking accuracy
- Data transformation correctness
- Business rule enforcement

### Integration Testing
- Workflow stage transitions
- Role-based access control
- Multi-user scenarios
- Data synchronization

### Performance Testing
- Large PR list handling
- Concurrent user operations
- Mobile device performance
- Network efficiency

## Security Considerations

### Data Protection
- **Sensitive Data Handling**: Secure handling of financial data
- **Access Control**: Strict role-based access control
- **Audit Logging**: Complete audit trail for compliance
- **Data Encryption**: Encrypt sensitive data in transit and at rest

### Business Logic Security
- **Approval Validation**: Validate all approval actions
- **Permission Enforcement**: Strict permission checking
- **Data Integrity**: Maintain data consistency and integrity
- **Fraud Prevention**: Detect and prevent fraudulent activities