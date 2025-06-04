# Carmen Supply Chain Mobile App - Workflow & Status Management PRD

## Document Information
- **Product**: Carmen Supply Chain Mobile App
- **Module**: PR (Purchase Requisition) Approval Workflow
- **Version**: 1.0
- **Date**: 2024-12-19
- **Status**: Active

## Overview

This document defines the differentiation between **Workflow Stages** and **Document Status** in the Carmen Supply Chain Mobile App's PR approval system. This separation provides clearer workflow tracking and more nuanced document state management.

## Core Concepts

### Workflow Stage (WHERE in the process)
Represents the **position** of a document in the approval workflow - which step/stage the document is currently at.

**Workflow Stages:**
- `0` - **Draft**: Document being prepared by requestor
- `1` - **HOD Review**: Requires Head of Department approval
- `2` - **Finance Review**: Requires Finance team approval  
- `3` - **Vendor Allocation**: Requires Purchasing team vendor assignment
- `4` - **Approved**: Final approved state
- **Terminal States:**
  - `-1` - **Rejected**: Document rejected (terminal)
  - `-2` - **On Hold**: Document on hold (terminal)
  - `-3` - **Cancelled**: Document cancelled (terminal)

### Document Status (STATE of the document)
Represents the **condition** or state of the document at any given workflow stage.

**Document Statuses:**
- **Draft**: Document is being prepared
- **In-progress**: Document is actively moving through workflow (consolidates "Submitted" and "Under Review")
- **Returned**: Document sent back for changes/revisions
- **Completed**: Document completed (workflow finished)
- **Rejected**: Document rejected (terminal)
- **On Hold**: Document temporarily on hold (terminal)
- **Cancelled**: Document cancelled (terminal)

## Status-Stage Relationships

### Valid Status Combinations by Workflow Stage

| Workflow Stage | Valid Document Statuses | Description |
|---|---|---|
| Draft (0) | Draft | Document being prepared |
| HOD Review (1) | In-progress, Returned | Document with HOD for review or returned for changes |
| Finance Review (2) | In-progress, Returned | Document with Finance for review or returned for changes |
| Vendor Allocation (3) | In-progress, Returned | Document with Purchasing for vendor allocation or returned |
| Approved (4) | Completed | Document fully approved |
| Rejected (-1) | Rejected | Document rejected (terminal) |
| On Hold (-2) | On Hold | Document on hold (terminal) |
| Cancelled (-3) | Cancelled | Document cancelled (terminal) |

### Real-world Examples

1. **Document in HOD Review Stage**:
   - Status: "In-progress" → HOD is working on the document (covers both submitted and under review states)
   - Status: "Returned" → HOD sent back for changes (but still in HOD stage until resubmitted)

2. **Document in Finance Review Stage**:
   - Status: "In-progress" → Finance team is working on the document
   - Status: "Returned" → Finance sent back for changes

3. **Document Flow Example**:
   ```
   Stage: Draft (0), Status: Draft
   ↓ (Submit for approval)
   Stage: HOD Review (1), Status: In-progress
   ↓ (HOD requests changes)
   Stage: HOD Review (1), Status: Returned
   ↓ (Requestor resubmits)
   Stage: HOD Review (1), Status: In-progress
   ↓ (HOD approves)
   Stage: Finance Review (2), Status: In-progress
   ↓ (Finance approves)
   Stage: Vendor Allocation (3), Status: In-progress
   ↓ (Purchasing assigns vendor)
   Stage: Approved (4), Status: Completed
   ```

## UI/UX Implementation

### Display Requirements

1. **PR List View**:
   - Show both Document Status badge and Workflow Stage information
   - Example: Status badge shows "In-progress", subtitle shows "Stage: HOD Review"

2. **PR Detail View**:
   - Clear separation with distinct labels:
     - "Document Status: In-progress"
     - "Workflow Stage: HOD Review"

3. **Workflow Progress Indicator**:
   - Visual stepper shows workflow stage progression
   - Document status provides additional context for current stage

### User Benefits

1. **Clarity**: Users understand both WHERE the document is and WHAT STATE it's in
2. **Transparency**: Clear visibility into why a document might be "stuck" at a stage
3. **Action-oriented**: Users know what actions they can take based on status
4. **Workflow tracking**: Better visibility into approval process flow
5. **Simplified Status**: "In-progress" reduces confusion between submitted vs under review states

## Technical Implementation

### Data Structure
```typescript
interface PR {
  id: number;
  number: string;
  status: string; // Document status (Draft, In-progress, Returned, Completed, etc.)
  workflowStage: number; // Workflow stage (0-4, negative for terminal)
  requestor: string;
  department: string;
  date: string;
  value: string;
  business_unit: string;
  role: string; // Required role for current stage
}
```

### Key Functions
- `getCurrentWorkflowStage()`: Returns current workflow stage
- `getDocumentStatusInfo()`: Returns status color and description
- `isValidStatusForStage()`: Validates status-stage combinations
- `canUserActOnPR()`: Determines if user can act based on workflow stage

## Status Color Coding

| Status | Color Scheme | Usage |
|---|---|---|
| Draft | Gray | Document being prepared |
| In-progress | Blue | Document actively in workflow |
| Returned | Orange | Document sent back for changes |
| Completed | Green | Document completed |
| Rejected | Red | Document rejected |
| On Hold | Purple | Document on hold |
| Cancelled | Gray | Document cancelled |

## Key Distinction: Document Status vs Workflow Stage

### Document Status "Completed" vs Workflow Stage "Approved"
- **Document Status "Completed"**: Indicates the document has finished processing and is in a final state
- **Workflow Stage "Approved"**: Indicates the document has reached the final approval stage in the workflow

### Document Status "In-progress" Simplification
- **"In-progress"** consolidates what previously was "Submitted" and "Under Review"
- This simplification reduces status complexity while workflow stages provide the specific location context
- Users focus on whether work is happening (In-progress) rather than the granular sub-state

**Example**:
- A PR at **Workflow Stage: HOD Review (1)** with **Document Status: In-progress** 
- This means: "The PR is with HOD for review AND work is actively happening on it"

## Migration Notes

- **Document Status**: "Submitted" and "Under Review" consolidated into **"In-progress"**
- **Document Status**: "Approved" changed to **"Completed"** to better reflect document state
- **Workflow Stage**: "Approved" remains **"Approved"** as it represents the final approval stage
- Existing documents will be migrated to use "In-progress" status when in active workflow stages

## Future Enhancements

1. **Sub-statuses**: Add more granular statuses within each stage if needed
2. **Time tracking**: Track time spent in each status/stage
3. **Notifications**: Status-specific notification rules
4. **Reporting**: Analytics based on status-stage combinations

---

**Document Control:**
- Created: 2024-12-19
- Last Updated: 2024-12-19
- Next Review: Q1 2025 