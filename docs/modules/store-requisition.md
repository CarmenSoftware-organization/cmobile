# Store Requisition (SR) Module

## Overview
The Store Requisition (SR) module manages internal inventory requests between departments and storage locations within the organization. It provides a streamlined workflow for requesting items from central stores, tracking approvals, and managing item issuance with comprehensive business dimension tracking.

## Location
- **Primary Module**: `src/app/(mobile)/store-requisition/`
- **Workflow Configuration**: `src/lib/workflow.ts` (Store Requisition section)
- **Related Components**: Item management, approval workflows, business dimension tracking

## Key Features

### 1. Internal Request Management
- **Department-to-Store Requests**: Internal inventory transfers
- **Item Requisition**: Request specific items from central stores
- **Quantity Management**: Flexible quantity and unit handling
- **Purpose Classification**: Regular, Special Event, Emergency requests

### 2. Simplified Approval Workflow
- **Draft Stage**: Initial SR creation and preparation
- **Department Review**: Department head approval
- **Store Review**: Store manager validation and approval
- **Approved**: Ready for item issuance
- **Issued**: Items physically issued and transferred

### 3. Business Dimension Tracking
- **Project Code**: Link to specific projects
- **Market Segment**: Business segment classification
- **Event**: Special event association
- **Job Code**: Job or task code tracking
- **Cost Center**: Department cost allocation

### 4. Item Management
- **Item Selection**: Choose from available store inventory
- **Quantity Specification**: Request specific quantities
- **Unit Handling**: Multiple unit options per item
- **Purpose Documentation**: Reason for requisition
- **Notes and Comments**: Additional information

### 5. Store Operations Integration
- **Inventory Availability**: Real-time stock checking
- **Location Management**: Source and destination locations
- **Issue Tracking**: Physical item issuance
- **Transfer Documentation**: Complete transfer records

### 6. Save & Resume (Draft) Functionality
- **Save for Resume**: Users can save an in-progress SR as a draft at any time, preserving all entered data.
- **Resume Drafts**: Draft SRs are listed and can be resumed and completed later.
- **Save and Submit**: When all items are ready, users can submit the SR for approval directly from the detail view.
- **Unsaved Changes Indicator**: The UI shows when there are unsaved changes and the last saved time, similar to the Physical Count module.

## Module Structure

### Store Requisition List (`/store-requisition`)
Central dashboard showing:
- SR listing with status indicators
- Department and business unit filtering
- Workflow stage tracking
- Quick access to create new SRs

### SR Detail View (`/store-requisition/[id]`)
Comprehensive SR management interface:
- Item-level approval and issuance
- Inventory availability checking
- Business dimension management
- Approval workflow tracking

### SR Creation (`/store-requisition/create`)
New requisition creation interface:
- Item selection and specification
- Business dimension entry
- Department and location selection
- Purpose and notes documentation

## Data Models

### Store Requisition Interface
```typescript
interface StoreRequisition {
  id: number;
  number: string;
  status: string;
  workflowStage?: number;
  department: string;
  date: string;
  itemCount: number;
  business_unit: string;
  requester: string;
  items: string[];
  jobCode: string;
  marketSegment: string;
  event: string | null;
  notes: string;
  lastAction?: string;
}
```

### SR Item Interface
```typescript
interface Item {
  id: number;
  name: string;
  sku: string;
  requestedQty: number;
  unit: string;
  approvedQty: number | null;
  approvedUnit?: string;
  issuedQty: number | null;
  issuedUnit?: string;
  notes: string;
  status: "Pending" | "Approved" | "Rejected" | "Review";
  approvalNote?: string;
  approvedBy?: string;
  approvedAt?: string;
  price?: number;
  totalCost?: number;
  businessDimensions?: BusinessDimensions;
  unitOptions?: string[];
  purpose: "Regular" | "Special Event" | "Emergency" | "";
}
```

### Business Dimensions Interface
```typescript
interface BusinessDimensions {
  projectCode?: string;
  marketSegment?: string;
  event?: string;
  jobCode?: string;
  costCenter?: string;
  department?: string;
}
```

## Workflow Management

### Store Requisition Workflow Stages
1. **Draft (Stage 0)**: SR creation and preparation
   - **Roles**: Requestor
   - **Actions**: Create, edit, save as draft, resume, submit
   - **Status**: Draft

2. **Department Review (Stage 1)**: Department head approval
   - **Roles**: HOD (Head of Department)
   - **Actions**: Approve, reject, return for changes
   - **Status**: In-progress

3. **Store Review (Stage 2)**: Store manager validation
   - **Roles**: Store Manager
   - **Actions**: Approve, reject, check availability
   - **Status**: In-progress

4. **Approved (Stage 3)**: Ready for issuance
   - **Roles**: Store Staff
   - **Actions**: Prepare items for issuance
   - **Status**: Approved

5. **Issued (Stage 4)**: Items physically transferred
   - **Roles**: Store Staff
   - **Actions**: Record issuance, complete transfer
   - **Status**: Complete

### Terminal Stages
- **Rejected (Stage -1)**: SR rejected at any stage
- **Cancelled (Stage -2)**: SR cancelled by requestor

### Workflow Configuration
```typescript
const storeRequisitionWorkflowConfig = {
  stages: [
    { id: 0, name: "Draft", label: "Draft", roles: ["Requestor"] },
    { id: 1, name: "Department Review", label: "Dept Review", roles: ["HOD"] },
    { id: 2, name: "Store Review", label: "Store Review", roles: ["Store Manager"] },
    { id: 3, name: "Approved", label: "Approved", roles: [] },
    { id: 4, name: "Issued", label: "Issued", roles: [] },
    { id: -1, name: "Rejected", label: "Rejected", roles: [] },
    { id: -2, name: "Cancel", label: "Cancel", roles: [] }
  ]
};
```

## Item Management Features

### Inventory Integration
- **Real-Time Availability**: Check current stock levels
- **Location-Based Inventory**: Multi-location stock visibility
- **Reserved Quantities**: Track reserved vs. available stock
- **Minimum Stock Alerts**: Alert when requesting below minimum levels

### Request Processing
- **Item Selection**: Choose from available inventory
- **Quantity Validation**: Validate against available stock
- **Unit Conversions**: Handle different units of measure
- **Purpose Classification**: Categorize request purpose

### Approval Process
- **Department Validation**: Department head approval
- **Store Validation**: Store manager stock verification
- **Availability Checking**: Real-time stock availability
- **Alternative Suggestions**: Suggest alternatives for unavailable items

## Business Dimension Tracking

### Project Management
- **Project Code**: Link requisitions to specific projects
- **Cost Allocation**: Track costs by project
- **Project Reporting**: Generate project-specific reports
- **Budget Tracking**: Monitor project budget utilization

### Event Management
- **Event Association**: Link to specific events
- **Event Planning**: Support event planning workflows
- **Event Reporting**: Track event-related costs
- **Resource Planning**: Plan resources for events

### Financial Tracking
- **Cost Center**: Department cost allocation
- **Market Segment**: Business segment tracking
- **Job Code**: Specific job or task tracking
- **Financial Reporting**: Comprehensive financial reports

## Mobile Optimization

### Touch Interface
- **Large Touch Targets**: Optimized for mobile interaction
- **Swipe Navigation**: Navigate between items and sections
- **Quick Actions**: Fast approval and rejection actions
- **Responsive Design**: Adapts to various screen sizes

### Offline Capabilities
- **Local Storage**: Store draft requisitions locally
- **Offline Creation**: Create requisitions without network
- **Sync When Online**: Automatic synchronization
- **Conflict Resolution**: Handle offline conflicts

## Integration Points

### With Inventory Management
- **Stock Levels**: Real-time inventory checking
- **Item Master**: Consistent item information
- **Location Management**: Multi-location support
- **Stock Movements**: Track inventory transfers

### With Workflow Management Module
- **Approval Engine**: Core workflow processing
- **Status Transitions**: Document status management
- **Permission Control**: Role-based access
- **Audit Trail**: Complete action history

### With Authentication Module
- **User Context**: Current user and department
- **Permission Validation**: Role-based access control
- **Business Unit Access**: Multi-tenant support
- **Session Management**: Secure session handling

### With Financial Systems
- **Cost Tracking**: Track requisition costs
- **Budget Integration**: Check budget availability
- **Cost Center Allocation**: Allocate costs properly
- **Financial Reporting**: Generate cost reports

## Advanced Features

### Bulk Operations
- **Bulk Approval**: Approve multiple items simultaneously
- **Bulk Rejection**: Reject multiple items with reasons
- **Bulk Status Updates**: Update status for multiple items
- **Bulk Issuance**: Issue multiple items together

### Reporting and Analytics
- **Department Usage**: Track department requisition patterns
- **Item Popularity**: Identify frequently requested items
- **Cost Analysis**: Analyze requisition costs
- **Efficiency Metrics**: Measure approval and issuance times

### Automation Features
- **Auto-Approval**: Automatic approval for routine requests
- **Stock Alerts**: Automatic alerts for low stock
- **Recurring Requisitions**: Set up recurring requests
- **Smart Suggestions**: Suggest items based on history

## Usage Examples

### Creating a Store Requisition
```typescript
const createStoreRequisition = async (formData: SRFormData) => {
  const sr = await createSR({
    department: formData.requestingDepartment,
    sourceLocation: formData.sourceLocation,
    items: formData.items,
    businessDimensions: formData.businessDimensions,
    notes: formData.notes,
    requestor: currentUser.name
  });
  
  router.push(`/store-requisition/${sr.id}`);
};
```

### Checking Item Availability
```typescript
const checkAvailability = async (sku: string, requestedQty: number) => {
  const availability = await getItemAvailability(sku, sourceLocation);
  
  if (availability.available < requestedQty) {
    showAlert(`Only ${availability.available} units available. Requested: ${requestedQty}`);
    return false;
  }
  
  return true;
};
```

### Processing Approval
```typescript
const approveItems = async (itemIds: number[], approvalNote: string) => {
  const updates = itemIds.map(id => ({
    id,
    status: 'Approved',
    approvedBy: currentUser.name,
    approvedAt: new Date().toISOString(),
    approvalNote
  }));
  
  await updateSRItems(srId, updates);
  await advanceWorkflowStage(srId);
};
```

## Error Handling

### Validation Errors
- **Stock Availability**: Validate against available inventory
- **Required Fields**: Ensure all required fields are completed
- **Business Rules**: Enforce organizational policies
- **Quantity Limits**: Validate against maximum request limits

### Workflow Errors
- **Permission Errors**: Handle insufficient permissions
- **Stage Transition Errors**: Invalid workflow transitions
- **Concurrent Modifications**: Handle simultaneous edits
- **Approval Conflicts**: Resolve approval conflicts

### System Errors
- **Network Issues**: Handle connectivity problems
- **Data Synchronization**: Resolve sync conflicts
- **System Downtime**: Graceful degradation
- **Recovery Procedures**: Error recovery mechanisms

## Performance Considerations

### Data Loading
- **Lazy Loading**: Load item details on demand
- **Pagination**: Efficient loading of large SR lists
- **Caching**: Cache frequently accessed data
- **Background Sync**: Asynchronous data updates

### Mobile Performance
- **Optimized Rendering**: Efficient React rendering
- **Memory Management**: Prevent memory leaks
- **Battery Optimization**: Minimize battery usage
- **Network Efficiency**: Optimize API calls

## Future Enhancements

### Advanced Features
- **Barcode Scanning**: Scan items for quick selection
- **Voice Commands**: Voice-controlled requisition creation
- **AI Suggestions**: Smart item recommendations
- **Predictive Analytics**: Forecast requisition needs

### Integration Improvements
- **ERP Integration**: Direct integration with ERP systems
- **Supplier Integration**: Link to external suppliers
- **Asset Management**: Integration with asset tracking
- **Maintenance Integration**: Link to maintenance requests

### Workflow Enhancements
- **Parallel Approvals**: Support parallel approval paths
- **Conditional Routing**: Dynamic workflow routing
- **Escalation Rules**: Automatic escalation procedures
- **Workflow Analytics**: Detailed workflow analysis

## Dependencies
- Next.js for routing and navigation
- React for UI components
- TypeScript for type safety
- Workflow management library
- Authentication module
- Inventory management integration
- Business dimension tracking

## Testing Considerations

### Unit Testing
- Workflow logic validation
- Inventory availability checking
- Business rule enforcement
- Data validation accuracy

### Integration Testing
- Workflow stage transitions
- Inventory system integration
- Multi-user scenarios
- Data synchronization

### Performance Testing
- Large SR list handling
- Concurrent user operations
- Mobile device performance
- Network efficiency

## Security Considerations

### Data Protection
- **Access Control**: Role-based access to requisitions
- **Data Encryption**: Secure data transmission
- **Audit Logging**: Complete audit trail
- **Privacy Protection**: Protect sensitive information

### Business Logic Security
- **Approval Validation**: Validate all approval actions
- **Inventory Protection**: Prevent unauthorized access
- **Cost Control**: Monitor and control costs
- **Fraud Prevention**: Detect suspicious activities

## Related Documentation
- [Workflow Management Module](./workflow-management.md) - Core workflow engine
- [Authentication Module](./authentication.md) - User and security management
- [Dashboard Module](./dashboard.md) - Main application interface
- [PR Approval Module](./pr-approval.md) - Purchase request approvals

## API Integration

> **Note:** All Store Requisition API endpoints use the path pattern `/api/[resource]` (no `/v1`), and require the query parameter `version=latest` for compatibility with the latest API version. Example: `GET /api/store-requisitions?version=latest`

### Example Endpoints

- **List Store Requisitions:**
  `GET /api/store-requisitions?version=latest`

- **Get Store Requisition Details:**
  `GET /api/store-requisitions/{id}?version=latest`

- **Create Store Requisition:**
  `POST /api/store-requisitions?version=latest`

- **Update Store Requisition:**
  `PUT /api/store-requisitions/{id}?version=latest`

- **Submit Store Requisition:**
  `POST /api/store-requisitions/{id}/submit?version=latest`

- **Approve/Reject/Cancel:**
  - `POST /api/store-requisitions/{id}/approve?version=latest`
  - `POST /api/store-requisitions/{id}/reject?version=latest`
  - `POST /api/store-requisitions/{id}/cancel?version=latest`

- **Add/Update/Delete Items:**
  - `POST /api/store-requisitions/{id}/items?version=latest`
  - `PUT /api/store-requisitions/{id}/items/{itemId}?version=latest`
  - `DELETE /api/store-requisitions/{id}/items/{itemId}?version=latest`