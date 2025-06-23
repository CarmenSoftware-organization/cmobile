# Store Requisition Workflow Documentation

## Overview
The Store Requisition module allows users to request, review, and issue items from inventory. It includes a calculator for issued quantity and supports multiple units with conversion.

## Workflow Logic
- Users create a requisition for items needed from the store.
- Each item can have an issued quantity, calculated using a modal-based calculator.
- Calculator supports multiple entries with different units and sums to a base unit.
- Requisitions are reviewed and approved by authorized personnel.

## User Interface Implementation
- **Issued Qty Calculator**: Modal next to the issued qty input, supporting numeric expressions and multiple units (box, pack, piece, kg, g, lb, set, unit).
- **Unit Conversion**: Hardcoded conversion rates for supported units.
- **Review & Approval**: UI for reviewing requisition details and approving/issuing items.
- **Mobile-Friendly**: All controls are optimized for mobile use.

## Business Rules
- Only available inventory can be issued.
- Issued quantity must not exceed requested or available quantity.
- All unit conversions are validated before submission.

## Technical Implementation
- Calculator modal implemented in React/Next.js.
- State management for issued quantity and unit conversion.
- Validation logic for inventory and unit constraints.

## Testing Scenarios
- Enter multiple units in calculator and verify correct total.
- Attempt to issue more than available quantity (should block).
- Approve/issue requisition and verify inventory update.

## Compliance & Audit
- All requisitions and issues are logged.
- Only authorized users can approve/issue items.

## Future Enhancements
- Dynamic unit conversion rates from master data.
- Support for attachments and comments.
- Integration with notification system for status changes.
