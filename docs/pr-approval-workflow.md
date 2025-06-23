# PR Approval Workflow Documentation

## Overview
The PR (Purchase Requisition) Approval module enables users to review, select, and approve or reject purchase requisitions in bulk or individually. The workflow is designed for clarity, explicit user control, and compliance with business rules.

---

## Workflow Logic (Priority-Based Decision Engine)
The PR Approval process uses a strict, priority-based decision engine:

1. **All Rejected** → PR is marked as Rejected (workflow terminated)
2. **Any Review** → PR is marked as Returned (sent back to previous stage)
3. **Any Pending** → Submission is Blocked (user must review all items)
4. **Any Approved** → PR Proceeds (with approved items only)

This logic is enforced in both the UI and backend, ensuring compliance and preventing accidental progression.

---

## Bulk Action Logic & Selection Modal
- The "Select All" checkbox always opens a modal, never directly selects all items.
- **Modal Options:**
  - Select All Items
  - Select Only Pending Items
  - Deselect All
- The modal displays:
  - Item counts for each option
  - A summary of the current selection (e.g., "3 Approved, 2 Pending, 1 Review, 0 Rejected")
  - Confirmation button to apply the chosen action
- **No "Bulk" wording or button**: All actions are contextually available; the UI avoids the word "Bulk" for clarity.
- **Explicit User Control**: No accidental mass selection; all bulk actions require user confirmation.

---

## User Interface Implementation
- **Selection Status Summary**: Always visible, showing how many items are selected and their statuses.
- **Dynamic Submit Button**:
  - "Submit & Approve" (Green): Any approved items, no reviews/pending
  - "Submit & Reject" (Red): All items rejected
  - "Submit & Return" (Orange): Any items marked for review
  - "Submit" (Gray, Disabled): Items still pending or invalid state
- **Visual Status Indicators**:
  - Real-time feedback with icons and messages for each workflow state (Ready to Approve, All Rejected, Review Required, Pending Review)
- **Confirmation Dialog**:
  - Pre-submission summary showing workflow action, item status breakdown, and clear action buttons
- **Mobile-Friendly**: All controls are optimized for mobile use, with large touch targets and clear feedback.

---

## Business Rules
- Users can only approve/reject items that are in a "Pending" or "Review" state.
- Items already approved or rejected are locked from further action.
- All items must be reviewed (no Pending) before submission is enabled.
- The workflow engine enforces the priority logic above.
- All actions are logged for audit purposes.

---

## Technical Implementation
- Modal-based selection logic in React/Next.js.
- State management for selection, status summary, and workflow logic.
- Priority-based decision engine implemented in the PR Approval page and supporting utilities.
- API endpoints for submitting workflow decisions and logging actions.

---

## Testing Scenarios
- Open the bulk selection modal and verify all options and counts.
- Select all, select pending, deselect all, and verify correct item counts and summary.
- Attempt to submit with all items rejected (should mark PR as Rejected).
- Attempt to submit with any item in Review (should mark PR as Returned).
- Attempt to submit with any item Pending (should block submission).
- Attempt to submit with any item Approved (should proceed).
- Confirm that the submit button and status indicators update dynamically.

---

## Compliance & Audit
- All actions are logged with user, timestamp, and rationale.
- Only authorized users can approve/reject PRs.
- Immutable records and complete traceability from request to final decision.

---

## Future Enhancements
- Add filter/search for PR items.
- Support for comments on approval/rejection.
- Integration with notification system for status changes.
- Role-based monetary approval limits and escalation rules.

---

## Conclusion
The PR Approval workflow provides a robust, user-friendly, and compliant system for managing purchase requisition approvals. The modal-based bulk selection, dynamic status indicators, and strict workflow logic ensure clarity, prevent errors, and maintain auditability throughout the process.
