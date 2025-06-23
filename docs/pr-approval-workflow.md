# PR Approval Workflow Documentation

## Overview
The PR (Purchase Requisition) Approval module enables users to review, select, and approve or reject purchase requisitions in bulk or individually. The workflow is designed for clarity, explicit user control, and compliance with business rules.

## Workflow Logic
The PR Approval process uses a priority-based decision engine:

1. **All Rejected** → PR is marked as Rejected
2. **Any Review** → PR is marked as Returned
3. **Any Pending** → Submission is Blocked (cannot proceed)
4. **Any Approved** → PR Proceeds

## User Interface Implementation
- **Bulk Selection Modal**: The "Select All" checkbox always opens a modal with options:
  - Select All Items
  - Select Only Pending Items
  - Deselect All
  - Modal displays item counts and a summary of the current selection.
- **Selection Status Summary**: Shows how many items are selected and their statuses.
- **No "Bulk" Wording**: The word "Bulk" is removed from the UI for clarity.
- **No Bulk Action Button**: Actions are contextually available based on selection.
- **Mobile-Friendly**: All controls are optimized for mobile use.

## Business Rules
- Users can only approve/reject items that are in a "Pending" or "Review" state.
- Items already approved or rejected are locked from further action.
- The workflow engine enforces the priority logic above.

## Technical Implementation
- Modal-based selection logic in React/Next.js.
- State management for selection and status summary.
- Workflow logic implemented in the PR Approval page and supporting utilities.

## Testing Scenarios
- Select all, select pending, deselect all, and verify correct item counts.
- Attempt to submit with all items rejected (should mark PR as Rejected).
- Attempt to submit with any item in Review (should mark PR as Returned).
- Attempt to submit with any item Pending (should block submission).
- Attempt to submit with any item Approved (should proceed).

## Compliance & Audit
- All actions are logged for audit purposes.
- Only authorized users can approve/reject PRs.

## Future Enhancements
- Add filter/search for PR items.
- Support for comments on approval/rejection.
- Integration with notification system for status changes.
