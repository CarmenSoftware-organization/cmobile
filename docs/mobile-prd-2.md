# Supply Chain Mobile App: Product Requirements Document (PRD)

## Document Information
- **Version**: 2.1
- **Date**: June 2025 (Updated with Store Requisition UI/UX enhancements and Receiving/GRN calendar integration)
- **Product**: Carmen Software Supply Chain Mobile App
- **Target Industry**: Hotels and Hospitality
- **Document Type**: Product Requirements Document (PRD)

## tl;dr

The Carmen Software Supply Chain Mobile App streamlines hotel supply
chain and financial workflows—receiving, purchase requests, stock takes,
and spot checks—by empowering cost controllers and operational staff
with mobile-first tools for accurate, fast, and compliant inventory
handling. Targeted at hospitality finance and supply professionals, it
dramatically cuts errors, enforces policy, and brings robust data
capture and analytics to every property.

## Goals

### Business Goals

- Increase supply chain transaction accuracy by 90% across all hotels in
  the first year

- Reduce non-compliant inventory events (e.g., receiving, spot checks)
  by 75%

- Improve user adoption of mobile workflows to \>80% of targeted staff
  within six months

- Enable near real-time analytics on supply chain and finance KPIs

- Demonstrate measurable audit trail completeness for all inventory
  transactions

### User Goals

- Eliminate rework due to manual entry or incomplete records

- Accelerate receiving, approval, and audit tasks without leaving
  operational roles

- Enable cost controllers to execute efficient, policy-compliant spot
  checks anywhere

- Ensure correct tax and discount capture automatically, with clear
  override controls

- Maintain continuity and accuracy across mobile sessions, even when
  interrupted

### Non-Goals

- Full mobile inventory management (add/remove master items, deep edits)

- Advanced analytics or reporting beyond compliance views

- Desktop-only features, or casual inventory browsing without workflow
  context

## User Stories

**Personas:**

- **Cost Controller**

- **Receiving Clerk**

- **PR Approver**

- **Manager**

### Cost Controller

- As a cost controller, I want to initiate a spot check by randomly
  selecting a list of items by location, so that I can audit inventory
  objectively and comply with finance policy.

- As a cost controller, I want to manually select items for spot check
  up to a configurable limit (10, 20, or 50), so I can focus on
  high-impact or suspect items.

- As a cost controller, I want the spot check list to persist and lock
  until I complete and submit the session, so my work is secure and
  audit-compliant.

- As a cost controller, I want to see audit trails for all actions and
  have selectable analytics dimensions (e.g., project, department), so
  that I can prepare for external or internal reviews.

### Receiving Clerk

- As a receiving clerk, I want to see today's deliveries filtered by
  vendor or location, so I can prioritize my tasks.

- As a receiving clerk, I want to receive items in either PO units or
  stock units with clear conversions, so I never guess or enter
  incorrect counts.

- As a receiving clerk, I want clear error messages and audit trail
  indicators if values do not reconcile, so I avoid submission mistakes.

- As a receiving clerk, I want to attach photos or files to receipts, so
  I provide evidence for damaged or disputed items.

- As a receiving clerk, I see tax and discount information for each line
  item as read-only fields on mobile; no override is allowed—any
  overrides can only be completed on the desktop application.

- As a receiving clerk, I am shown all receiving transactions across all
  business units that I have access to, with the business unit displayed
  as an informational label on each transaction list and detail header.

### PR Approver

- As a PR approver, I want a clear list of pending requests with
  at-a-glance priorities, so I do not miss urgent requests.

- As a PR approver, I want to approve, reject (with reason), or return
  PRs based on policy and status, to keep the process moving with
  compliance.

- As a PR approver, I see tax and discount as read-only informational
  fields on mobile; override actions are not available and can only be
  performed on desktop if permissions allow.

- As a PR approver, I want to see who last edited or approved a PR, so I
  can resolve questions quickly.

- As a PR approver, the Business Unit context of each PR is always shown
  as a label; I never have to select or switch BU when reviewing or
  acting on PRs. All PRs visible to me are presented together with their
  BU reference visible.

- As a PR approver, for every item line in a PR, I want to see \[On
  Hand\] and \[On Order\] buttons or links. Tapping \[On Hand\] displays
  a panel, modal, or popup with the item's on-hand quantity by location
  (fields: Location, Qty Available, Min, Max, Last Counted/Stocked).
  Tapping \[On Order\] displays a list of pending purchase orders for
  that item (fields: PO Number, Vendor, Ordered Qty, Status, Due Date).
  Both are strictly informational, easy to close, mobile-friendly, and
  up-to-date for every PR item line.

### Manager

- As a manager, I want to review all receiving, PR, stock take, and spot
  check activity for my hotels, so I can catch compliance issues early.

- As a manager, I want dashboards and alerts for overdue or missing
  actions, so I can intervene as needed.

- As a manager, I want to reassign or unlock sessions and approve
  escalations for discrepancies, so that workflows are never blocked.

## Functional Requirements

### Multi-Tenant Authorization

- **Business Unit Definition**: A Business Unit (BU) represents a distinct hotel property within the Carmen Supply Chain system (e.g., "Grand Hotel Singapore", "Business Hotel Jakarta"). Business Units are the primary organizational entities for authorization, data segregation, and reporting.

- Users log in and are automatically presented with all transactions
  across their assigned business units. There is no BU selection,
  picker, or dropdown at login or anywhere in the app.

- Strict role- and unit-based data access, with the user only able to
  view and work with data from their assigned BUs.

- Per-session audit trail of activity.

### Receiving (Including PO & GRN)

#### Receiving Navigation Flow

- **Entry Point**: Users access the Receiving module through the "Purchase Orders" card on the dashboard. Direct access to GRN management is intentionally removed to enforce the proper receiving workflow.

- **Routing Flow**:
  1. **Dashboard → Purchase Orders**: Users first see the batch receiving/PO list screen.
  2. **PO Selection**: Users select one or more POs to process.
  3. **Business Unit Selection**: When creating GRNs, users select from their assigned hotel properties only.
  4. **GRN Creation**: System creates GRN(s) based on selected PO(s).
  5. **GRN Detail**: Users are directed to the GRN detail page for item receiving.
  6. **Item Processing**: Users verify and update received quantities and other details.
  7. **GRN Completion**: Users finalize the GRN with appropriate status.

- **Navigation Restrictions**:
  - Users cannot directly access GRNs without going through the PO selection process.
  - This enforces data integrity by ensuring all GRNs are properly linked to source POs.
  - The "Add Item" functionality is intentionally removed to maintain traceability to source documents.

#### General Receiving Features

- View "Today's Deliveries" filtered by vendor/location with all
  accessible BUs shown in a single list. Each transaction displays its
  BU as a non-interactive label.

- **Enhanced Date Filtering**: Comprehensive date range picker with calendar integration for delivery date filtering, including:
  - Predefined filter options (Today, This Week, Next Week, Overdue)
  - Custom date range selection with progressive date picking
  - Smart display text showing current filter state
  - Professional calendar integration using shadcn UI components

- **Currency Grouping**: Purchase Orders grouped by currency with exchange rate display for multi-currency operations

- **Business Unit Context**: Persistent business unit context throughout the receiving flow with search functionality and detailed information

- **Comprehensive GRN Management**: Status-based actions (Resume, Continue, View) with multi-tab interface for GRN details including:
  - Items tab for item-level receiving with quantities, FOC, and unit management
  - Summary tab for overall GRN information
  - Signature tab for digital signature capture and comments
  - Extra Cost tab for additional charges
  - Attachments tab for supporting documents

- **Enhanced PO Selection**: Multi-criteria search capabilities (PO number, product name, vendor) for efficient PO identification

- PO line table with name-first product listing; PO and stock units with
  conversion logic.

- "Receive as" toggle (units); attachments; tax/discount information
  always displayed as read-only on mobile—no override/edit controls.

- All session actions logged with before/after values, user, and
  timestamp.

- Support for Business Dimensions (configurable header/line
  fields).

- **\[On Hand\] and \[On Order\] information is NOT shown or accessible
  anywhere in Receiving, PO, or GRN flows on mobile.**

### GRN State Workflow & Business Rules

Goods Receipt Notes (GRNs) follow a four-state workflow:

1. **Draft**
   - GRN is being created or edited.
   - If any item quantity is empty or zero, the GRN remains in Draft.
   - Can be edited or voided (voiding returns all items to PO remaining).

2. **Received**
   - All item quantities are greater than zero.
   - GRN status automatically changes to Received.
   - Can still be edited or voided (voiding returns all items to PO remaining).
   - If any item quantity is set back to zero, status returns to Draft.

3. **Committed**
   - User explicitly commits the GRN (after review/approval).
   - GRN is finalized and cannot be edited.
   - Cannot be voided.

4. **Void**
   - Can be applied to GRNs in Draft or Received state.
   - All items in the GRN are returned to the PO remaining quantity.
   - GRN is marked as cancelled/invalid.

**State Transition Rules:**
- Draft → Received: When all item quantities > 0.
- Received → Draft: If any item quantity is set back to zero.
- Received → Committed: When user commits the GRN.
- Draft/Received → Void: At any time before commit.
- Committed: Final state; cannot revert or void.

**Validation & UI Rules:**
- Cannot move to Received unless all items have quantity > 0.
- Cannot Commit unless in Received state.
- Cannot edit after Committed.
- Voiding is only possible in Draft or Received.
- Status badge and available actions update according to current state.

### PR Approval

- View/action PRs by role and status (pending, urgent, escalated) across
  all assigned BUs. Each PR displays a read-only BU label.

- Line details: name-first, all qty, tax, discount, vendor data.

- Tax and discount values are always displayed as read-only information on mobile, using the format: "Tax: [Name] ([Type], [Rate]%)" (e.g., "Tax: VAT (Add, 7%)"). Override actions are desktop-only and not present in mobile flows.

- Approve/reject/return, editable vendor allocation (role-based,
  desktop-only where workflow permits).

- Complete audit log and comments/attachments per PR.

- For each PR, Business Unit context is always shown as a display label;
  selection or switching BUs is not available when acting on PRs.

- **Every item line in PR Approval (PR detail screens) includes \[On
  Hand\] and \[On Order\] buttons or links.**

  - Tapping \[On Hand\] displays a panel, modal, or popup with the
    item's on-hand quantity by location, including:

    - Location

    - Qty Available

    - Min

    - Max

    - Last Counted/Stocked

  - Tapping \[On Order\] displays a panel, modal, or popup listing all
    pending purchase orders for that item, including:

    - PO Number

    - Vendor

    - Ordered Qty

    - Status

    - Due Date

  - Both overlays are strictly informational, available for every PR
    item line, and presented in a mobile-friendly overlay or expandable
    panel. The overlays/panels are easy to close, always up-to-date, and
    always display a non-editable BU label for context.

### Store Requisition (SR)

#### Store Requisition Flow & Business Rules

Store Requisitions follow a structured workflow that enables internal transfer of goods between departments or locations within the same Business Unit:

1. **Creation Phase**
   - **Access**: Users navigate to the SR module through the "Store Requisition" card on the dashboard.
   - **Initiation**: User creates a new SR by tapping "Create New SR" button.
   - **Header Information**:
     - SR Number (auto-generated)
     - Request Date (defaults to current date)
     - Requesting Department (selected from dropdown) - department that needs the items
     - Source Location/Store (selected from dropdown) - location where items are stored
     - Business Unit (displayed as read-only label)
     - Optional Notes/Remarks
   - **Item Selection**:
     - Users search for items by name or scan barcodes
     - For each item, users specify:
       - Requested Quantity
       - Inventory Unit (cannot be changed)
       - Purpose (optional dropdown: Regular, Special Event, Emergency)
       - Item-specific notes (optional)
     - Items are displayed with name-first format
     - Business Dimensions:
       - Job Code
       - Market Segment
       - Event
   - **Save as Draft**: User can save the SR as a draft to complete later.

2. **Submission Phase**
   - **Review**: User reviews all items and quantities before submission.
   - **Business Dimensions**: Business dimensions are applied to all items, but can be overridden at the item level if needed.
   - **Attachments**: User can attach supporting documents or images.
   - **Submit**: User submits the SR for approval, changing status to "Submitted".

3. **Approval Phase**
   - **HOD Approval**:
     - Department Head receives notification of pending SR.
     - HOD reviews the SR details and items.
     - HOD can change approved qty, approve, reject, or return with comments.
     - Upon approval, status changes to "HOD Approved".
   - **Store Manager Approval**:
     - Store Manager receives notification of HOD-approved SR.
     - Reviews the SR details, items, and available inventory.
     - Can approve, reject, or return with comments.
     - Upon approval, status changes to "Approved".

4. **Issue Phase**
   - **Store Staff Access**: Store staff see approved SRs in their Issue queue.
   - **Item Picking**:
     - Staff record actual quantities fulfilled for each item.
     - System tracks discrepancies between requested and Issued quantities.
     - Staff can add notes explaining shortages or substitutions.
     
   - **Delivery Confirmation**:
     - Recipient signature is captured upon delivery.
     - Timestamp and location are recorded.
     - Status changes to "Issued" when all items are delivered.

5. **Post-Fulfillment**
   - **Inventory Adjustment**: System automatically adjusts inventory levels.
   - **Analytics**: Transaction is tagged with business dimensions for reporting.
   - **Audit Trail**: Complete history of the SR is maintained for compliance.

#### SR State Transitions

- **Submitted → HOD Approved**: When Department Head approves.
- **Submitted → Returned**: When Department Head returns for changes.
- **Submitted → Rejected**: When Department Head rejects.
- **HOD Approved → Approved**: When Store Manager approves.
- **HOD Approved → Returned**: When Store Manager returns for changes.
- **HOD Approved → Rejected**: When Store Manager rejects.
- **Approved → Issued**: When all items are fulfilled/Issues.

#### SR Mobile UI Components

- **SR List View**:
  - Card-based display with status badges
  - Filters for status, date range, departments
  - Search by SR number or Descriptions
  - Each card shows SR number, status, requesting department, date, requester and item count
  - Sorting options by date, status, and department
  - Pull-to-refresh functionality for latest updates
  - Business Dimensions tags displayed as color-coded badges (Project Code, Market Segment, Event)

- **SR Detail View**:
  - Header with SR information and status
  - Tabbed interface for Items, Approvals, History, and Attachments
  - Action buttons based on current status and user role
  - Business Unit displayed as non-interactive label
  - Floating action buttons for context-specific actions
  - Well-spaced action buttons (On Hand, On Order, Detail) with Detail button properly aligned using ml-auto
  - Improved labeling with "Store Name" (replacing "From") and "Request from" (replacing "To") for clearer inventory movement visualization
  - Comprehensive Business Dimensions structure with specific fields for Project Code, Market Segment, and Event
  - Streamlined approval modal without quantity inputs for simplified approval workflow
  - Small-sized (sm) input controls for approved quantity and unit selector fields
  - Price and cost totals displayed on item cards for better financial visibility

- **Item Entry**:
  - Search-based or barcode scanner item selection
  - Quantity and unit input
  - Comments/notes field
  - Business Dimensions fields (consistent with header-level but overridable at item level)
  - Price and total cost display for financial tracking
  - Offline validation (min/max verification)

- **Approval Actions**:
  - Approve/Reject/Return buttons with comment field
  - Streamlined approval modal focused on approval notes and comments without quantity adjustment controls
  - Digital signature capture
  - Timestamp and user recording
  - Optional email notification triggers
  - Approval workflow emphasizes notes and reasoning rather than quantity modifications

- **Fulfillment Interface**:
  - Requested vs. Fulfilled quantity comparison
  - Shortage explanation field with predefined reasons
  - Partial fulfillment support with remaining quantities tracking
  - Delivery confirmation with signature capture
  - Geolocation tagging for delivery verification

#### SR Technical Implementation

- **API Endpoints**:
  ```
  GET    /api/store-requisitions         # List SRs with filtering
  POST   /api/store-requisitions         # Create new SR
  GET    /api/store-requisitions/:id     # Get SR details
  PUT    /api/store-requisitions/:id     # Update SR
  DELETE /api/store-requisitions/:id     # Delete SR (draft only)
  
  POST   /api/store-requisitions/:id/submit    # Submit SR
  POST   /api/store-requisitions/:id/approve   # Approve SR
  POST   /api/store-requisitions/:id/reject    # Reject SR
  POST   /api/store-requisitions/:id/return    # Return SR
  POST   /api/store-requisitions/:id/fulfill   # Fulfill SR
  ```

- **Data Models**:
  ```typescript
  interface StoreRequisition {
    id: string;
    srNumber: string;
    status: 'Draft' | 'Submitted' | 'HOD Approved' | 'Approved' | 
            'Partially Fulfilled' | 'Fulfilled' | 'Rejected' | 'Returned';
    requestDate: string;
    requestingDepartment: string;
    sourceLocation: string;
    businessUnit: string;
    notes?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    businessDimensions: {
      projectCode?: string;    // e.g., "PR-2025-001"
      marketSegment?: string;  // e.g., "Food & Beverage", "Executive Lounge"
      event?: string;          // e.g., "Corporate Retreat", "Annual Gala Dinner"
    };
    items: SRItem[];
    approvals: {
      hod: SRApproval;
      storeManager: SRApproval;
    };
    history: SRHistoryEntry[];
    attachments: SRAttachment[];
  }
  ```

- **Integration Points**:
  - Inventory Management System for item availability
  - User Management System for approver roles and delegation
  - Notification Service for approval alerts
  - Analytics Service for tagging and reporting
  - File Storage Service for attachments

- **Offline Capabilities**:
  - IndexedDB for storing SR data locally
  - Background sync for pending changes
  - Optimistic UI updates with conflict resolution
  - Clear visual indicators for offline-created content

### Stock Take

#### Stock Take Navigation Flow

- **Entry Point**
  - Users access the Stock Take module through the "Stock Take" card on the dashboard or bottom navigation.
  - When selected, users are presented with an option screen to choose between Physical Count and Spot Check.

- **Routing Flow**
  1. **Dashboard/Bottom Nav → Stock Take**: Users see the Stock Take option screen.
  2. **Option Selection**: Users choose Physical Count or Spot Check.
  3. **Physical Count**: Navigates to Physical Count entry screen (location selection, location type, start button).
  4. **Spot Check**: Navigates to Spot Check entry screen (location selection, item selection method, number of items, start button).
  5. **Session Creation**: Each entry screen enforces business rules for location authorization, item selection, and session creation.
  6. **Item List View**: Users see a list of items to count for the selected location/session.
  7. **Count Entry**: Users enter actual count values for each item.
  8. **Variance Review**: System highlights items with significant variances for review.
  9. **Session Completion**: Users submit the completed stock take for approval.

- **Session States**
  - **Draft**: Initial creation, can be saved and resumed.
  - **In Progress**: Counting has begun but is not complete.
  - **Review**: All items counted, variance review in progress.
  - **Submitted**: Completed and submitted for approval.
  - **Approved**: Finalized and inventory adjusted.

- **Navigation Features**
  - Progress tracking shows completion percentage throughout the process.
  - Users can pause and resume sessions across multiple days if needed.
  - Barcode/QR scanning support for rapid item identification.
  - On Hand and On Order information available for reference during counting.

#### General Stock Take Features

- Initiate and join stock take sessions across all assigned BUs; all
  accessible items are listed with their BU in the header.

- Count entry with name-first display, system quantity (if permissioned),
  variance flagging.

- Save/resume; submit; session status (active/completed).

- Attach evidence and add comments.

- All counts are fully audit-logged.

- On Hand and On Order details (where available) appear as info panels
  on each item line for stock take only, with the associated BU
  displayed.

### Spot Check

- Review and Success pages are implemented and routed using Next.js folder-based structure (no 404s on navigation).
- Item Selection Method button group is visually distinct for the selected method.
- Button enabling logic for Spot Check Session is robust and handles zero as a valid value.
- On Hand and On Order buttons are ONLY available in PR Approval, not in Spot Check or Stock Take.
- Debug output and console logs have been removed from the UI.
- All Spot Check session actions are audit-logged with timestamps and location.

### Profile/Settings

- Display/change user info, role, and force logout.

- No option exists to select, pick, or change BU. BU assignment is
  handled at the system level and drives transaction visibility only.

- Password change and optional two-factor auth (where supported).

- User session actions fully audit-logged.

### Additional Must-Have Flows

- All tables and forms: **SKU shown before product name**

- **Terminology Standardization**: All references to "Transaction Analytics Dimensions" have been updated to "Business Dimensions" across all documentation and user interfaces for consistency

- Comprehensive error handling—clear, actionable messages throughout

- Confirmation and alert screens for all submit/override/abort actions

## User Experience

### Entry Point & First-Time User Experience

- Users access the app via mobile SSO or credential login and are
  greeted by a branded dashboard.

- **Dashboard Module Cards**: Feature cards provide quick access to main modules with clear, consistent naming:
  - "Good Receive Note" for receiving workflows
  - "PR Approval" for purchase request approvals  
  - "SR Approval" for store requisition approvals (updated from "Store Requisition" for better clarity and consistency)
  - "Physical Count" for inventory counting

- No BU selection is required. All accessible transactions, items, and
  workflows are visible according to user access rights and show their
  BU as a non-editable label.

### Core Experience

- **Navigation:** Tab bar or hamburger menu for main modules (Receiving,
  PR, Stock Take, Spot Check, Profile)

- **Module entry:** Contextual landing pages—filtered lists with
  at-a-glance status (filter, sort, and search powered by Material UI
  and ShadCN components)

- **Transaction flows:** Forms optimized for thumb reach, field
  grouping, error prevention, and low-friction interaction
  (Bootstrap/Tailwind for responsive behavior)

  1.  **Step 1:** User opens the desired module (e.g., Spot Check)

  - UI: Tab/menu bar, card grid, or dropdown access; instant feedback on
    tap

  2.  **Step 2:** Initiates action (e.g., Selects location, chooses
      random/manual, sets item limit)

  - UI: Modal selection with prominent CTA (Material UI/Chakra UI dialog
    or right sheet)

  - Data Validation: Value required before proceeding; step confirmation
    animation

  3.  **Step 3:** Locked session begins; progress bar and persistent
      scrollable item list

  - UI: ShadCN List/Table, item progress indicator, sticky summary bar

  4.  **Step 4:** User enters/interacts with each row (count, photo,
      note)

  - UI: Large input fields, accessible buttons, quick scan labels; error
    message below entries

  - **On Hand and On Order Buttons:**

    - Displayed in PR Approval, Stock Take, and Spot Check modules
      (never in Receiving or PO/GRN flows)

    - Tapping \[On Hand\] opens a card, modal, or bottom sheet overlay
      showing on-hand inventory by location (fields: Location, Qty
      Available, Min, Max, Last Counted/Stocked) with BU as a
      non-editable label

    - Tapping \[On Order\] opens a card, modal, or bottom sheet overlay
      listing pending/approved POs (fields: PO Number, Vendor, Ordered
      Qty, Status, Due Date) with BU as a non-editable label

    - Both overlays are read-only, closeable with one tap/swipe, display
      current data, and are mobile optimized

  - **Tax and Discount Fields:**

    - Shown as read-only informational fields in all modules on mobile
      (Receiving, PR Approval, etc.)

    - Never editable, clickable, or overrideable on mobile; desktop is
      required for any override action

  5.  **Step 5:** Submits when all required actions are complete;
      confirmation modal w/ summary

- **Advanced Features & Edge Cases:**

  - Resume in-progress spot check, audit logs always visible, protected
    override workflows via modal plus comment (desktop only), offline
    support for data entry with later sync

### UI/UX Highlights

- Consistent design system aligned with Carmen Siftware—name-first
  hierarchy, clear tax/discount labeling, persistent audit-trail
  footer/sidebar

- BU always shown as an informational label in all list and detail
  headers/cards; at no stage is a BU selector, picker, or dropdown shown
  to the user.

- Strong contrast, large touch targets, and ARIA attributes for WCAG AA
  compliance

- Proactive alerts on error, with contextual tips and policy reminders

- Visual cues make clear where data is informational only, vs. where
  user action is expected; overlays for \[On Hand\]/\[On Order\] appear
  for every item line in PR Approval, Stock Take, and Spot Check modules
  only

## Narrative

It's early afternoon at GrandVista Hotel. Michelle, the site's cost
controller, faces critical tasks. She opens the Carmen Siftware mobile
app and is instantly presented with a dashboard listing all her assigned
properties' workflows, each with business unit labeled for clarity. She
needs to ensure the restaurant's top products are physically present, so
she starts a spot check session.

The app's sleek interface prompts Michelle: random or manual? Today, she
picks "random," selects 20 items, and the system instantly generates the
list based on the inventory master and property. Michelle begins her
round. The persistent session feature ensures that if she's interrupted,
her progress is saved. As she finds each item, she quickly enters the
count, snaps a photo if anything looks amiss, and logs a note for a
variance she finds on imported cheese. For every item, Michelle taps
\[On Hand\] to check what should be on the shelf and \[On Order\] to see
if anything is arriving soon. Both overlays include the business unit as
a label so she always knows which property she's working on. She can
clearly see her progress and cannot submit until all items are checked,
enforcing compliance.

Michelle completes the round, reviews a summary with any flagged
discrepancies, and submits. In real time, her session is logged in the
audit trail—management now has visibility, and Michelle receives
recognition for her diligence. Later, her manager reviews dashboard
alerts highlighting the completed session and its compliance scores,
bolstering trust in property inventory accuracy and operational
controls.

## Success Metrics

### User-Centric Metrics

- 80%+ of receiving, PR, and spot check events completed using the
  mobile app vs. legacy/desktop workflows

- 90% reduction in incomplete spot check sessions (tracked via
  submission logs)

### Business Metrics

- 75% decrease in undocumented variances or policy bypasses (audit and
  compliance records)

- 30% decrease in time required for monthly inventory reconciliation

- Positive NPS (\>50) and \>70% user satisfaction in post-launch
  feedback surveys

### Technical Metrics

- App session uptime \>99% for all mobile workflows

- Error/exception rates on transaction submission \<1%

- Sync latency for offline data \<5 minutes

### Tracking Plan

- Event tracking for login, module entry, transaction start, submission,
  override use, session abandonment, and audit record creation

- Quarterly compliance and satisfaction reviews using analytics
  dashboards

## Technical Considerations

- **APIs:** REST/GraphQL endpoints for all modules; robust error
  handling and status codes

- **Offline handling:** Transactional data cached and persisted for
  later sync in unreliable networks

- **Audit & analytics hooks:** All actions logged with metadata for
  compliance, accessible via reporting APIs

- **Role-permission enforcement:** All sensitive actions require
  real-time role validation

- **Mobile security:** Encrypted storage, device/session management,
  SSO/integration with organization IdP, inactivity timeouts

## UI Architecture

- **Navigation Model:** Tabbed navigation for main modules; deep links
  and notifications for session resumes and approval actions

- **Primary UI Components:** ShadCN and Material UI for list views,
  modals, progress bars, action buttons, and audit trail badges; custom
  responsive form controls for tax/discount fields

- **Wireframe References:** Each list/table displays SKU before product
  name; clear unit toggles ("Receive as: cases/bottles"); modular
  component reuse across forms; \[On Hand\] and \[On Order\] overlays
  accessible only in PR Approval, Stock Take, and Spot Check modules,
  not in Receiving/PO/GRN

- **Design System Alignment:** Carmen Siftware branding; consistent
  padding, color, and font guidelines

- **Mobile Accessibility:** High-contrast UI, text scaling, ARIA labels,
  large actionable areas, keyboard- and screen reader-friendly

- **BU Label:** Every transaction list and detail card/header includes a
  read-only business unit label for reference. BU field is never
  editable or interactive in any module.

## Performance & Scalability

- **Optimizations:** Lazy load lists, use background/batched sync,
  debounce for search/filter, local caching for offline sessions

- **Accessibility:** Enforced across all modules with clear
  error/feedforward hints

- **Scalability:** Session and analytics APIs support hundreds of
  concurrent properties/units, growing to 10,000+ daily active users
  seamlessly

## Integration Points

- **PMS/ERP:** Sync master item data, location/outlet lists, PR/PO/work
  order data

- **Vendor Master Data:** Real-time vendor lookup and PO mapping

- **Analytics:** Export of sessions, counts, and audit records to
  enterprise cubes or dashboards

- **SSO/Auth:** SAML/OAuth or org IdP integration

- **Notification Service:** For workflow and session events (e.g.,
  incomplete spot checks, urgent PR)

## Acceptance Criteria

- Spot Check Review and Success pages are accessible and do not return 404 errors.
- Item Selection Method visually highlights the selected method.
- Proceed to Review and Submit Spot Check buttons enable only when all items are filled (including zero).
- On Hand and On Order overlays are present ONLY in PR Approval, not in Spot Check or Stock Take.
- No debug output or console logs in production UI.
- All Spot Check actions are audit-logged with timestamps and location.
