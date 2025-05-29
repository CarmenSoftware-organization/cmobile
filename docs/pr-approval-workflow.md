# PR Approval Workflow Logic
## Carmen Supply Chain Mobile App

### Document Information
- **Version**: 1.0
- **Date**: December 2024
- **Module**: PR Approval
- **Document Type**: Workflow Specification

---

## Overview

The PR Approval module implements a sophisticated workflow decision engine that automatically determines purchase requisition progression based on individual item approval statuses. The system uses a priority-based hierarchical logic to ensure proper workflow routing and compliance.

---

## Workflow Decision Engine

### Priority-Based Logic Hierarchy

The system evaluates item statuses in the following priority order:

```
1. ALL REJECTED (Highest Priority)
   ├── Condition: ALL items have status "Rejected"
   ├── Action: PR status → "Rejected"
   ├── Result: Workflow terminated
   └── Message: "All items rejected - PR will be rejected"

2. ANY REVIEW (High Priority)
   ├── Condition: ANY item has status "Review"
   ├── Action: PR returns to previous workflow stage
   ├── Result: Previous approver must re-review
   └── Message: "Items marked for review - PR will be returned to previous stage"

3. ANY PENDING (Medium Priority)
   ├── Condition: ANY item has status "Pending"
   ├── Action: Submission blocked
   ├── Result: User must review all items
   └── Message: "Please review all items before submitting"

4. ANY APPROVED (Low Priority)
   ├── Condition: ANY item has status "Approved"
   ├── Action: PR progresses to next workflow stage
   ├── Result: Approved items move forward
   └── Message: "X items approved, Y rejected - PR will proceed with approved items"

5. DEFAULT (Fallback)
   ├── Condition: No valid status combination
   ├── Action: Submission blocked
   ├── Result: User guidance required
   └── Message: "Please review all items before submitting"
```

### Item Status Definitions

| Status | Description | Workflow Impact |
|--------|-------------|-----------------|
| **Pending** | Not yet reviewed by approver | Blocks submission |
| **Approved** | Accepted and can proceed | Enables progression |
| **Rejected** | Not approved, will not proceed | Contributes to rejection logic |
| **Review** | Needs clarification/changes | Forces return to previous stage |
| **Returned** | Previously sent back | Edge case handling |

---

## Workflow Scenarios

### Scenario Matrix

#### 🚫 REJECT Scenarios
```
Scenario R1: Complete Rejection
├── Items: All Rejected
├── Result: 🔴 REJECT PR
├── Action: "Submit & Reject"
└── Outcome: PR status = "Rejected", workflow terminated

Example:
Item 1: Rejected ❌  Item 2: Rejected ❌  Item 3: Rejected ❌  Item 4: Rejected ❌
```

#### ↩️ RETURN Scenarios
```
Scenario T1: Mixed with Review
├── Items: Approved + Review + Rejected
├── Result: 🟠 RETURN PR
├── Action: "Submit & Return"
└── Outcome: PR returns to previous stage

Scenario T2: Review Priority Override
├── Items: Review + Approved
├── Result: 🟠 RETURN PR (Review overrides Approved)
├── Action: "Submit & Return"
└── Outcome: Previous approver must address review items

Example:
Item 1: Approved ✅  Item 2: Review 🔄  Item 3: Rejected ❌  Item 4: Approved ✅
```

#### ⏸️ BLOCKED Scenarios
```
Scenario B1: Incomplete Review
├── Items: Approved + Pending + Rejected
├── Result: ⏸️ BLOCKED
├── Action: Disabled submit button
└── Outcome: User must review pending items

Scenario B2: All Pending
├── Items: All Pending
├── Result: ⏸️ BLOCKED
├── Action: Disabled submit button
└── Outcome: Complete review required

Example:
Item 1: Approved ✅  Item 2: Pending ⏳  Item 3: Rejected ❌  Item 4: Approved ✅
```

#### ✅ APPROVE Scenarios
```
Scenario A1: Single Item Approval
├── Items: 1 Approved + Rest Rejected
├── Result: 🟢 APPROVE PR
├── Action: "Submit & Approve"
├── Message: "1 item approved, 3 rejected - PR will proceed with approved item"
└── Outcome: PR progresses with approved item only

Scenario A2: Multiple Item Approval
├── Items: Multiple Approved + Some Rejected
├── Result: 🟢 APPROVE PR
├── Action: "Submit & Approve"
├── Message: "2 items approved, 2 rejected - PR will proceed with approved items"
└── Outcome: PR progresses with approved items only

Scenario A3: All Items Approved
├── Items: All Approved
├── Result: 🟢 APPROVE PR
├── Action: "Submit & Approve"
├── Message: "4 items approved, 0 rejected - PR will proceed with approved items"
└── Outcome: PR progresses with all items

Example A1:
Item 1: Approved ✅  Item 2: Rejected ❌  Item 3: Rejected ❌  Item 4: Rejected ❌

Example A2:
Item 1: Approved ✅  Item 2: Approved ✅  Item 3: Rejected ❌  Item 4: Rejected ❌

Example A3:
Item 1: Approved ✅  Item 2: Approved ✅  Item 3: Approved ✅  Item 4: Approved ✅
```

---

## User Interface Implementation

### Dynamic Submit Button

The submit button adapts based on the workflow decision:

```typescript
Button Text & Color Logic:
├── "Submit & Approve" (Green) → Any approved items, no reviews/pending
├── "Submit & Reject" (Red) → All items rejected
├── "Submit & Return" (Orange) → Any items marked for review
└── "Submit" (Gray, Disabled) → Items still pending or invalid state
```

### Visual Status Indicators

Real-time feedback system with icons and messages:

```
🟢 Ready to Approve
├── Icon: CheckCircle (green)
├── Message: "Ready to approve and progress workflow"
└── Condition: hasApproved && !hasReview && !hasPending

🔴 All Rejected
├── Icon: XCircle (red)
├── Message: "All items rejected - PR will be rejected"
└── Condition: allRejected

🟠 Review Required
├── Icon: AlertCircle (orange)
├── Message: "Items need review - will return to previous stage"
└── Condition: hasReview

⚪ Pending Review
├── Icon: AlertCircle (gray)
├── Message: "Please review all items before submitting"
└── Condition: hasPending || no valid action
```

### Confirmation Dialog

Pre-submission summary showing:
- Workflow action and consequences
- Item status breakdown with counts
- Clear action buttons with loading states

---

## Business Rules

### Validation Rules

1. **Complete Review Requirement**: All items must be reviewed (no Pending status) before submission
2. **Review Priority**: Items marked for "Review" override approved items for workflow routing
3. **Mixed Approval Support**: PR can progress with any number of approved items (1 to all)
4. **Rejection Finality**: All rejected items terminate the PR workflow
5. **Audit Trail**: All decisions logged with user, timestamp, and rationale

### Workflow Progression Rules

1. **Forward Progression**: Only occurs when items are approved and no reviews/pending exist
2. **Backward Progression**: Triggered by any item marked for review
3. **Termination**: Occurs when all items are rejected
4. **Blocking**: Prevents submission when items are pending review

### Business Logic Constraints

1. **No Partial Submissions**: All items must be reviewed before any submission
2. **Review Override**: Review status takes precedence over approval status
3. **Flexible Approval**: Supports scenarios from single item approval to complete approval
4. **Clear Messaging**: Users always understand the consequence of their submission

---

## Technical Implementation

### Core Function

```typescript
const determineWorkflowAction = () => {
  const itemStatuses = itemsState.map(item => item.status);
  const allRejected = itemStatuses.every(status => status === 'Rejected');
  const hasReview = itemStatuses.some(status => status === 'Review');
  const hasApproved = itemStatuses.some(status => status === 'Approved');
  const hasPending = itemStatuses.some(status => status === 'Pending');
  const approvedCount = itemStatuses.filter(status => status === 'Approved').length;
  const rejectedCount = itemStatuses.filter(status => status === 'Rejected').length;

  // Priority-based decision logic
  if (allRejected) {
    return { action: 'reject', message: 'All items rejected - PR will be rejected' };
  } else if (hasReview) {
    return { action: 'return', message: 'Items marked for review - PR will be returned to previous stage' };
  } else if (hasPending) {
    return { action: 'none', message: 'Please review all items before submitting' };
  } else if (hasApproved) {
    const message = approvedCount === 1 
      ? `1 item approved, ${rejectedCount} rejected - PR will proceed with approved item`
      : `${approvedCount} items approved, ${rejectedCount} rejected - PR will proceed with approved items`;
    return { action: 'approve', message };
  } else {
    return { action: 'none', message: 'Please review all items before submitting' };
  }
};
```

### Integration Points

1. **API Endpoints**: Submit workflow decisions to backend
2. **State Management**: Real-time UI updates based on item status changes
3. **Audit Logging**: Complete trail of all workflow decisions
4. **Notification System**: Alerts for workflow status changes

---

## Testing Scenarios

### User Role Testing

The system includes a development user switcher for testing different approval scenarios:

```
Test Users:
├── Alice Manager (HOD)
│   ├── Role: HOD
│   ├── Business Units: Grand Hotel Singapore, Business Hotel Jakarta
│   └── Workflow Stage: HOD approval
├── Bob Finance (Finance)
│   ├── Role: Finance
│   ├── Business Units: Grand Hotel Singapore, Boutique Hotel Bangkok
│   └── Workflow Stage: Finance approval
└── Charlie Staff (Requestor)
    ├── Role: Requestor
    ├── Business Units: Business Hotel Jakarta
    └── Workflow Stage: No approval authority
```

### Test Cases

1. **Single Item Approval**: Test progression with minimal approval
2. **Mixed Approval**: Test various combinations of approved/rejected items
3. **Review Workflow**: Test return-to-previous-stage functionality
4. **Complete Rejection**: Test workflow termination
5. **Pending Validation**: Test submission blocking with pending items
6. **Role-Based Access**: Test filtering based on user workflow assignments

---

## Compliance & Audit

### Audit Trail Requirements

All workflow decisions must be logged with:
- User identification and role
- Timestamp of decision
- Item-level status changes
- Workflow action taken
- Business justification (where applicable)
- Business Unit context

### Compliance Features

1. **Immutable Records**: All workflow decisions are permanently logged
2. **Complete Traceability**: Full audit trail from request to final decision
3. **Role Verification**: Ensure users can only approve at their assigned workflow stages
4. **Business Unit Segregation**: Maintain data isolation between properties

---

## Future Enhancements

### Planned Improvements

1. **Conditional Approval Limits**: Role-based monetary approval limits
2. **Escalation Rules**: Automatic escalation for high-value or overdue approvals
3. **Approval Templates**: Saved approval patterns for recurring requests
4. **Advanced Analytics**: Workflow performance metrics and bottleneck identification
5. **Integration Enhancements**: Real-time synchronization with ERP systems

### Scalability Considerations

1. **Multi-Stage Workflows**: Support for complex approval chains
2. **Parallel Approvals**: Concurrent approval by multiple roles
3. **Conditional Routing**: Dynamic workflow routing based on request attributes
4. **Performance Optimization**: Efficient handling of large-volume approval scenarios

---

## Conclusion

The PR Approval workflow logic provides a robust, flexible, and user-friendly system for managing purchase requisition approvals in hospitality environments. The priority-based decision engine ensures proper workflow routing while maintaining compliance and audit requirements.

The implementation supports various approval scenarios from single-item approvals to complex mixed decisions, always providing clear feedback to users about the consequences of their actions. The system's flexibility allows for efficient processing while maintaining strict compliance and audit trail requirements. 