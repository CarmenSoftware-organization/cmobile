# Workflow Management Module

## Overview
The Workflow Management module provides a comprehensive system for managing document approval workflows, particularly for Purchase Request (PR) approval processes in the Carmen Supply Chain application.

## Location
- **Primary Module**: `src/lib/workflow.ts`
- **Related Components**: `src/app/(mobile)/pr-approval/`

## Key Features

### 1. Workflow Stage Management
- Multi-stage approval process
- Role-based stage assignments
- Stage progression tracking
- Terminal stage handling (Approved, Rejected, Cancelled)

### 2. Document Status Management
- Document state tracking
- Status-based UI styling
- Status validation and transitions
- Comprehensive status descriptions

### 3. Role-Based Permissions
- View, edit, and approval permissions
- Role-specific workflow access
- Permission validation by stage

### 4. Workflow Configuration
- Configurable workflow stages
- Flexible role assignments
- Customizable approval paths

## Core Interfaces

### WorkflowStage Interface
```typescript
interface WorkflowStage {
  id: number;
  name: string;
  label: string;
  roles: string[];
}
```

### RolePermissions Interface
```typescript
interface RolePermissions {
  canView: number[];
  canEdit: number[];
  canApprove: number[];
  canCreate: boolean;
}
```

## Workflow Configuration

### Workflow Stages
The system defines a linear workflow with the following stages:

1. **Draft (Stage 0)**: Document preparation by Requestor
2. **HOD Review (Stage 1)**: Head of Department review
3. **Finance Review (Stage 2)**: Finance department review
4. **Vendor Allocation (Stage 3)**: Purchasing department allocation
5. **Approved (Stage 4)**: Final approval state

### Terminal Stages
- **Rejected (Stage -1)**: Document rejected
- **Cancelled (Stage -3)**: Document cancelled

## Document Status System

### Active Workflow Statuses
- **Draft**: Document being prepared
- **In-progress**: Document moving through workflow
- **Returned**: Returned for changes
- **Completed**: Document completed
- **Converted**: Converted to Purchase Order

### Terminal Statuses
- **Rejected**: Document rejected
- **Cancelled**: Document cancelled

### Status Styling
Each status includes color coding for UI consistency:
```typescript
const documentStatuses = {
  "Draft": { color: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200" },
  "In-progress": { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200" },
  "Completed": { color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" },
  // ... additional statuses
};
```

## Role-Based Permissions

### Permission Matrix
The system defines permissions for different roles across workflow stages:

#### Requestor Permissions
- **Create**: Yes
- **View**: All stages (0-4)
- **Edit**: Draft stage only (0)
- **Approve**: None

#### HOD (Head of Department) Permissions
- **Create**: Yes
- **View**: All stages (0-4)
- **Edit**: Draft and HOD Review stages (0-1)
- **Approve**: HOD Review stage (1)

#### Finance Permissions
- **Create**: Yes
- **View**: All stages (0-4)
- **Edit**: Draft and Finance Review stages (0, 2)
- **Approve**: Finance Review stage (2)

#### Purchasing Permissions
- **Create**: Yes
- **View**: All stages (0-4)
- **Edit**: Draft and Vendor Allocation stages (0, 3)
- **Approve**: Vendor Allocation stage (3)

## Workflow Functions

### Stage Validation
```typescript
function getValidStatusesForStage(stageId: number): string[]
```
Returns valid document statuses for a given workflow stage.

### Permission Checking
```typescript
function canUserPerformAction(userRole: string, action: string, stageId: number): boolean
```
Validates if a user can perform a specific action at a workflow stage.

### Stage Progression
```typescript
function getNextStage(currentStage: number): number | null
```
Determines the next stage in the workflow progression.

### Status Transitions
```typescript
function isValidStatusTransition(fromStatus: string, toStatus: string, stageId: number): boolean
```
Validates if a status transition is allowed at a specific stage.

## Workflow Implementation

### Stage-to-Status Mapping
The system maintains a mapping between workflow stages and valid document statuses:

```typescript
const stageToValidStatuses = {
  0: ["Draft"], // Draft stage
  1: ["In-progress", "Returned"], // HOD Review stage
  2: ["In-progress", "Returned"], // Finance Review stage
  3: ["In-progress", "Returned"], // Vendor Allocation stage
  4: ["Completed", "Converted"], // Final stage
  -1: ["Rejected"], // Rejected terminal stage
  -3: ["Cancelled"] // Cancelled terminal stage
};
```

### Action Validation
The system validates user actions based on:
- Current user role
- Document's current stage
- Requested action type
- Document's current status

## Integration Points

### With Authentication Module
- Uses user role information for permission validation
- Integrates with business unit context
- Respects user authentication state

### With UI Components
- Provides status styling for badges and indicators
- Enables/disables action buttons based on permissions
- Shows appropriate workflow information

### With Data Layer
- Validates data changes against workflow rules
- Ensures data integrity during stage transitions
- Maintains audit trail of workflow actions

## Usage Examples

### Checking User Permissions
```typescript
import { rolePermissions } from '@/lib/workflow';

const userRole = "HOD";
const currentStage = 1;

const canApprove = rolePermissions[userRole]?.canApprove.includes(currentStage);
```

### Getting Status Styling
```typescript
import { documentStatuses } from '@/lib/workflow';

const status = "In-progress";
const statusStyle = documentStatuses[status]?.color;
```

### Validating Stage Transition
```typescript
import { stageToValidStatuses } from '@/lib/workflow';

const newStage = 2;
const validStatuses = stageToValidStatuses[newStage];
```

## Workflow Rules

### Stage Progression Rules
1. Documents must progress through stages sequentially
2. Users can only approve at stages assigned to their role
3. Documents can be returned to previous stages for corrections
4. Terminal stages (Approved, Rejected, Cancelled) end the workflow

### Status Transition Rules
1. Status changes must be valid for the current stage
2. Only authorized users can change document status
3. Status changes trigger stage progression when appropriate
4. Terminal statuses prevent further modifications

## Error Handling

### Validation Errors
- Invalid stage transitions
- Unauthorized user actions
- Invalid status changes
- Missing required approvals

### Error Recovery
- Graceful handling of invalid states
- User-friendly error messages
- Automatic correction of inconsistent states
- Audit logging of error conditions

## Future Enhancements

### Workflow Customization
- Dynamic workflow configuration
- Custom approval paths
- Conditional stage routing
- Parallel approval processes

### Advanced Features
- Workflow templates
- Automated notifications
- Escalation rules
- Workflow analytics

### Integration Improvements
- External system integration
- API-based workflow management
- Real-time workflow updates
- Mobile-optimized workflow UI

## Dependencies
- TypeScript for type safety
- React for UI components
- Next.js for routing
- Authentication module for user context