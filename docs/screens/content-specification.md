# Carmen Software Supply Chain Mobile App
# Content Specification Document

## Document Information
- **Version**: 2.1
- **Date**: December 2024 (Updated with GRN interface streamlining, enhanced unit selection, and location-based item organization)
- **Product**: Carmen Software Supply Chain Mobile App
- **Target Industry**: Hotels and Hospitality
- **Document Type**: Content Specification Document

## 1. Introduction & Document Purpose

### Purpose of This Document

This Content Specification Document serves as the definitive reference for all content elements within the Carmen Software Supply Chain Mobile App. It provides comprehensive details on the structure, organization, and presentation of content across all app modules and screens.

### Audience

This document is intended for:
- UX/UI designers implementing screen layouts
- Developers building app functionality
- QA teams validating content implementation
- Product managers confirming alignment with business requirements
- Content strategists and technical writers maintaining content standards

### How to Use This Document

The specifications outlined here should be used to:
- Guide the implementation of all screens and UI components
- Ensure consistency across the application
- Validate that all content aligns with functional requirements
- Resolve content-related questions during development
- Onboard new team members to content standards

### Key Content Principles

All content within the Carmen Software Supply Chain Mobile App adheres to these core principles:

1. **Clarity and Precision**: Content is clear, concise, and uses consistent terminology
2. **Mobile-First Design**: All content is optimized for touch, scanability, and mobile contexts
3. **Task-Oriented Focus**: Content supports efficient task completion for hospitality supply chain staff
4. **Consistent Patterns**: Common content elements maintain consistent patterns across modules
5. **Policy Compliance**: Content enforces proper authorization, audit, and compliance requirements

### Related Documents

This Content Specification Document works in conjunction with:
- Product Requirements Document (PRD)
- Functional Requirements Document (FRD)
- UX/UI Guide
- UI Prototype
- Technical Architecture Documentation

### Content Governance

Content changes must follow the established governance process:
1. Proposed changes documented with rationale
2. Review by Product, UX, and Development leads
3. Validation against business requirements
4. Implementation and testing
5. Documentation update

## 2. Core Modules Overview

The Carmen Software Supply Chain Mobile App consists of the following core modules, each designed to support specific hospitality supply chain workflows:

### Authentication & Session Management

**Purpose**: Securely authenticate users and manage session context based on Business Unit authorization.

**Key Features**:
- Email/password login
- SSO integration (optional)
- Token-based authentication
- Session timeout management
- Multi-tenant Business Unit context

**Primary Users**: All system users

### Dashboard

**Purpose**: Provide a central hub for accessing key modules and displaying timely, actionable information.

**Key Features**:
- Quick access to core modules
- Role-based contextual information
- Notifications and alerts
- Status summaries for in-progress activities
- Business Unit context display

**Primary Users**: All system users, with content tailored to role

### Store Requisition Module

**Purpose**: Facilitate internal transfer of goods between departments or locations within the same Business Unit through a structured requisition and approval workflow.

**Key Features**:
- SR list with status, department, and date filtering
- Create, edit, and submit Store Requisitions (SR)
- Item selection by search or barcode
- Multi-phase approval (Department Head, Store Manager)
- Issuance tracking and delivery confirmation
- Attachments and business dimensions (Job Code, Market Segment, Event)
- Offline support and audit trail
- Business Unit context always displayed as a non-interactive label
- Well-designed item action buttons with optimal spacing between On Order and Detail buttons
- Mobile-optimized input controls with small (sm) sizing for approved quantity fields
- Clear inventory movement visualization with "Store Name" (source) and "Request from" (destination) labeling
- Comprehensive Business Dimensions structure with specific fields for Project Code, Market Segment, and Event
- Streamlined approval modal focused on approval notes without quantity adjustment controls

**Primary Users**: Department Requestors, Department Heads, Store Managers, Store Staff

### Receiving Module (PO & GRN)

**Purpose**: Enable efficient tracking and processing of incoming inventory through Purchase Orders and Goods Receipt Notes.

**Key Features**:
- PO list and receipt processing
- GRN creation and management
- Batch receiving
- Tax and discount handling (read-only on mobile)
- Attachment capabilities

**Primary Users**: Receiving Clerks

### PR Approval Module

**Purpose**: Facilitate review and approval of Purchase Requisitions across authorized Business Units.

**Key Features**:
- PR list with status filtering
- Detailed PR review
- Line item approval/modification
- On Hand and On Order information access
- Approval, rejection, and return workflow actions

**Primary Users**: PR Approvers, Managers

### Stock Take Module

**Purpose**: Support systematic inventory counting and reconciliation processes.

**Key Features**:
- Option selection screen: user chooses Physical Count or Spot Check
- Physical Count entry screen: location selection, location type, start button
- Spot Check entry screen: location selection, item selection method, start button
- Session creation and management
- Count entry with variance tracking
- Save/resume functionality
- Variance review and submission

**Primary Users**: Cost Controllers, Inventory Managers

### Spot Check Module (UPDATED)

**Purpose**: Enable ad-hoc inventory verification for compliance and accuracy, with full auditability.

**Key Features**:
- Entry screen for session setup: location selection, item selection method, number of items
- Each session records and displays:
  - **Timestamp** (start and completion)
  - **Location** (where the spot check is performed)
- Locked, persistent session management
- Count entry with photo evidence
- Submission and verification workflow
- All timestamps and location data are included in the audit trail for compliance and reporting

**Primary Users**: Cost Controllers, Managers

- Review and Success pages are implemented and routed using Next.js folder-based structure (no 404s on navigation).
- Item Selection Method button group is visually distinct for the selected method.
- Button enabling logic for Spot Check Session is robust and handles zero as a valid value.
- On Hand and On Order buttons are ONLY available in PR Approval, not in Spot Check or Stock Take.
- Debug output and console logs have been removed from the UI.
- All Spot Check session actions are audit-logged with timestamps and location.

### Notification Module

**Purpose**: Provide timely alerts about actions requiring user attention.

**Key Features**:
- In-app notification center
- System alerts for high-priority items
- Deep links to relevant screens
- Read/unread status tracking
- Business Unit context preservation

**Primary Users**: All system users, primarily approvers

### Profile & Settings

**Purpose**: Allow users to manage their account information and application preferences.

**Key Features**:
- Personal information display
- Role and Business Unit assignment visibility
- Password management (where applicable)
- Logout functionality
- App information and support access

**Primary Users**: All system users

## 3. Content Structure & Navigation

### Navigation Architecture

The app employs a hybrid navigation model to balance ease of access with comprehensive functionality:

#### Primary Navigation

**Mobile Tab Bar** (always accessible from bottom of screen):
- Dashboard (Home)
- Store Requisition
- Receiving
- PR Approval
- Stock Take
- Spot Check
- More (for additional options)

**"More" Menu Items**:
- Notifications
- Profile & Settings
- Help/Support
- Logout

#### Secondary Navigation

**List to Detail Pattern**:
- Module entry points lead to filterable lists
- List items open detailed views
- Back navigation returns to previous screen
- Breadcrumb indicators show current location in complex flows

**Deep Linking**:
- Notifications link directly to relevant detail screens
- Dashboard shortcuts lead to specific functional areas
- Email/external links can open specific app screens (where supported)

### Content Hierarchy

Content is organized according to these principles:

1. **Role-Based Relevance**: Most relevant content for user's role appears first
2. **Recency**: Newest items prioritized in lists
3. **Status-Based Urgency**: Items requiring action highlighted and prioritized
4. **Business Unit Context**: All content clearly indicates its BU context as a non-interactive label

### Global Content Elements

These elements appear consistently throughout the application:

**Headers**:
- Screen title
- Back/navigation controls
- Business Unit label (non-interactive)
- Action buttons (contextual)

**List Items**:
- Primary identifier (PR#, GRN#, etc.)
- Status indicator (color-coded badge)
- Key metadata (date, value, creator)
- Business Unit label (non-interactive)
- Action indicators (tap for more)

**Detail Views**:
- Header with summary information
- Content sections with clear headings
- Line items in consistent format
- Action bar with primary functions
- Expandable sections for secondary content

**Form Elements**:
- Clearly labeled fields
- Inline validation
- Required field indicators
- Consistent input controls
- Mobile-optimized keyboards and selection controls

### Content States

All screens accommodate these content states:

**Loading State**:
- Skeleton layouts or loading indicators
- Progressive content loading where appropriate
- Background loading for non-critical content

**Empty State**:
- Informative message explaining why content is empty
- Suggested actions where applicable
- Visually distinct but unobtrusive design

**Error State**:
- Clear error messaging
- Actionable resolution steps
- Contextual help where needed
- Non-blocking design where possible

**Offline State**:
- Clear indication of offline mode
- Transparent handling of what can/cannot be accessed
- Queued actions with status indicators

## 4. Detailed Screen Specifications

### 4a. Authentication Screens

#### Login Screen

**Purpose**: Allow users to securely authenticate to the application using credentials or SSO.

**UI Components**:
- App logo and branding at top
- Email field with label and placeholder
- Password field with mask/unmask toggle
- "Login" primary button
- "Sign in with SSO" secondary button (if configured)
- "Forgot Password?" link
- Version information in footer

**Data Fields**:

| Field | Type | Validation | Format | Notes |
|-------|------|------------|--------|-------|
| Email | Text input | Valid email format | Standard email format | Placeholder: "you@company.com" |
| Password | Password input | Min length requirements | Masked by default | With show/hide toggle |

**States**:
- Default state: Clean form
- Loading state: Spinner on Login button during authentication
- Error state: Error messages appear below relevant fields or as a banner

**Error Messages**:
- "Invalid email or password. Please try again."
- "Your account has been locked due to multiple failed login attempts. Please contact support."
- "Your session has expired. Please log in again."
- "Unable to connect. Please check your internet connection."

**User Interactions**:
- Tapping Login submits credentials
- Tapping SSO redirects to identity provider
- Tapping Forgot Password opens recovery flow
- Successful login proceeds to Dashboard

**Business Rules**:
- Failed login attempts are counted and may trigger account lockout
- Successful logins automatically apply user's authorized BUs
- All login attempts (success/fail) are logged for audit
- No BU selection occurs during authentication

#### Session Timeout Screen

**Purpose**: Inform users that their session has expired and prompt re-authentication.

**UI Components**:
- Modal dialog with clear timeout message
- "Log In Again" primary button
- "Cancel" secondary button

**User Interactions**:
- Tapping "Log In Again" returns to Login screen
- Tapping "Cancel" closes the app or returns to a public area

**Business Rules**:
- Session expiry is logged in the audit trail
- User must re-authenticate with full credentials
- Unsaved data may be preserved for recovery after login

### 4b. Dashboard

#### Home Dashboard

**Purpose**: Provide centralized access to app modules and display relevant, actionable information in a mobile-friendly, card-based layout.

**UI Components**:
- Header with "Dashboard" title, notification bell icon, theme toggle (light/dark), and profile icon
- Business Unit selector/dropdown below the header
- Main content area with module cards:
  - Receiving
  - PR Approval
  - Store Requisition
  - Physical Count
  - Spot Check
  Each card displays:
    - Icon representing the module
    - Module label (e.g., "Receiving")
    - Count badge (number of pending items)
- Bottom navigation bar with icons and labels for:
  - Dashboard
  - Receiving
  - Approval
  - Store Req.
  - Physical Count

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Business Unit | Dropdown | User authorization | Text | Shows current BU, allows switching |
| Module Cards | Interactive cards | System config | Grid layout | Icon, label, count badge |
| Notification Count | Badge | Notification system | Numeric | On bell icon |
| Pending Counts | Numeric | Module APIs | Integer | For each module card |

**States**:
- Default: All module cards shown with current counts
- Loading: Skeleton cards or spinners while data loads
- Empty: Count badge shows 0, card is still visible
- Error: Error message if data can't be loaded

**User Interactions**:
- Tapping a module card navigates to the corresponding module
- Tapping the notification bell opens the Notification Center
- Tapping the BU selector opens the dropdown to switch BUs
- Tapping the theme toggle switches between light/dark mode
- Tapping the profile icon opens the Profile/Settings screen
- Bottom navigation bar provides persistent access to main modules

**Business Rules**:
- Only modules the user is authorized for are shown as cards and in the nav bar
- Business Unit selector only shows BUs assigned to the user
- Module counts reflect real-time or most recent data
- No BU selection required at login; default BU is shown
- All navigation and actions are optimized for mobile usability

### 4c. Receiving Module Screens

#### PO List / Batch Receiving

**Purpose**: Display list of Purchase Orders available for receiving and enable batch selection.

**UI Components**:
- Header with "Receiving" title
- Search bar and filter controls:
  - Status dropdown filter
  - Business Unit dropdown filter (convenience only)
  - Date filter
- List of PO cards showing:
  - PO Number (prominent)
  - Vendor name
  - Expected delivery date
  - Status badge
  - Total value
  - Business Unit label (non-interactive)
- "Create New GRN" floating action button

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| PO Number | Text | PO API | Alphanumeric | Primary identifier |
| Vendor | Text | PO API | Text | Vendor name |
| ETA | Date | PO API | DD/MM/YYYY | Expected delivery date |
| Status | Badge | PO API | Color-coded text | Open, Partial, Complete, etc. |
| Value | Currency | PO API | $#,###.## | With currency symbol |
| Business Unit | Label | PO API | Text | Non-interactive |

**States**:
- Default: List of POs sorted by date (newest first)
- Loading: Skeleton card layout
- Filtered: Results matching applied filters
- Empty: Message when no POs match criteria
- Error: Error message if data can't be loaded

**User Interactions**:
- Tapping PO card navigates to PO Detail
- Tapping filters opens filter controls
- Searching filters list by PO#, vendor
- Multiple selection for batch receiving (if supported)
- Pull-to-refresh updates PO list

**Business Rules**:
- Only shows POs user is authorized to receive
- Aggregates POs across all authorized BUs
- Each PO clearly shows its BU as a non-interactive label
- Optional BU filter for convenience only, never changes workflow context

#### GRN Creation / Receiving

**Purpose**: Allow users to record receipt of goods against selected PO(s).

**UI Components**:
- Header with "Receive PO: [PO#]" or "New GRN" title
- PO summary section:
  - PO Number
  - Vendor
  - Expected Delivery Date
  - Business Unit (non-interactive label)
- GRN header fields:
  - Received Date (editable)
  - Invoice Number (optional)
  - Delivery Note Number (optional)
- Item list as cards showing:
  - Product Name (displayed before SKU)
  - SKU
  - Ordered Quantity
  - Received Quantity (editable)
  - Remaining Quantity
  - Unit selector
  - Status badge
  - Detail button
- Summary totals:
  - Subtotal
  - Total Tax (read-only)
  - Total Discount (read-only)
  - Grand Total
- Attachment section
- Notes/Comments field
- Receiver signature area
- Footer action buttons:
  - "Save Draft"
  - "Submit GRN"

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Received Date | Date picker | User input | DD/MM/YYYY | Defaults to today |
| Invoice Number | Text input | User input | Alphanumeric | Optional |
| Product Name | Text | PO API | Text | Displayed before SKU |
| SKU | Text | PO API | Alphanumeric | Product code |
| Ordered Qty | Numeric | PO API | Number with decimals | From PO |
| Received Qty | Numeric input | User input | Number with decimals | Editable field |
| Unit | Dropdown | PO API / Config | Text | PO or inventory unit |
| Tax details | Text | System calculation | "Tax: [Name] ([Type], [Rate]%)" | Read-only on mobile. Example: "Tax: VAT (Add, 7%)" |
| Discount details | Text | System calculation | "Discount: [Value] ([Type])" | Read-only on mobile |

**States**:
- Default: Form with PO items pre-populated
- Validation: Highlighting fields with errors
- Saving: Indicator during save operation
- Submitted: Success confirmation

**User Interactions**:
- Entering received quantities
- Toggling between PO and inventory units
- Adding attachments (photos/documents)
- Adding notes
- Capturing signature
- Saving draft or submitting final GRN

**Business Rules**:
- GRN state follows workflow: Draft > Received > Committed > Void
- Draft: Any item with zero/empty quantity keeps GRN in Draft
- Received: All items have quantities > 0
- Cannot Commit without all required fields
- Tax and discount fields are always read-only on mobile. Tax name, type, and rate are displayed together if available, e.g., "Tax: VAT (Add, 7%)".
- No On Hand/On Order buttons in Receiving module
- All actions logged for audit trail
- Business Dimensions appear in item detail dialog, not at the header level

#### GRN Detail View

**Purpose**: Display comprehensive information about a created GRN for review or action.

**UI/UX Update:**
- The GRN Detail screen now features a streamlined section structure:
  - PO summary cards are displayed at the top, showing PO, vendor, value, and BU.
  - Below the PO summary, a 'GRN Details' section contains tab navigation for Items, Summary, and Comments.
  - **Signature and Extra Cost tabs have been removed** to streamline the user experience and focus on core receiving functionality.
- The tab navigation is visually separated from the PO summary for clarity.
- The Comments tab (formerly Attachments) provides a chat-style comment interface, allowing users to add text, attach files, and take photos (using Lucide icons for file and photo actions).
- In the Summary tab, only the Financial Summary is displayed; the Selected POs and Item Summary sections have been removed for a cleaner, more focused summary view.
- **Enhanced unit selection**: Each item now provides separate unit dropdowns for both "Received Qty" and "FOC Qty" inputs, allowing for more flexible receiving scenarios where different units may be used for received quantities versus free-of-charge quantities.
- **Location-based item organization**: Items are automatically grouped by their assigned store locations with clear visual separation and location headers showing item counts for better receiving workflow organization.

**UI Components**:
- Header with "GRN Detail: [GRN#]" title
- GRN summary section:
  - GRN Number
  - Status Badge (Draft, Received, Committed, Void)
  - Vendor
  - Received Date
  - Total Value
  - Linked PO Number(s)
  - Created By
  - Business Unit (non-interactive label)
- Line items section showing:
  - Product Name (displayed before SKU)
  - SKU
  - Received Quantity
  - Unit of Measure
  - Unit Price
  - Line Total
  - Tax details (read-only)
  - Discount details (read-only)
- Summary totals:
  - Subtotal
  - Total Tax (read-only)
  - Total Discount (read-only)
  - Grand Total
- Attachments section
- Comments/Notes section
- Receiver signature (if captured)
- Footer action buttons (context-dependent):
  - "Edit GRN" (if Draft/Received)
  - "Submit GRN" (if ready for submission)
  - "Void GRN" (if Draft/Received)
  - "Print/Export GRN" (if Committed)

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| GRN Number | Text | GRN API | Alphanumeric | Primary identifier |
| Status | Badge | GRN API | Color-coded text | Draft, Received, Committed, Void |
| Vendor | Text | GRN API | Text | Vendor name |
| Received Date | Date | GRN API | DD/MM/YYYY | When goods received |
| Business Unit | Label | GRN API | Text | Non-interactive |
| Product Name | Text | GRN API | Text | Displayed before SKU |
| SKU | Text | GRN API | Alphanumeric | Product code |
| Received Qty | Numeric | GRN API | Number with decimals | Quantity received |
| Unit Price | Currency | GRN API | $#,###.## | With currency symbol |
| Line Total | Currency | GRN API | $#,###.## | Qty × Price |
| Tax details | Text | GRN API | "Tax: [Name] ([Type], [Rate]%)" | Read-only. Example: "Tax: VAT (Add, 7%)" |
| Discount details | Text | GRN API | "Discount: [Value] ([Type])" | Read-only |

**States**:
- View by status: Different actions available based on GRN status
- Loading: Skeleton layout while data loads
- Error: Error message if data can't be loaded

**User Interactions**:
- Tapping "Edit GRN" navigates to edit screen
- Tapping "Submit GRN" triggers submission workflow
- Tapping "Void GRN" prompts for confirmation
- Tapping "Print/Export GRN" initiates export/print
- Tapping item detail button shows Business Dimensions for that item

**Business Rules**:
- Available actions depend on GRN status:
  - Draft/Received: Can edit or void
  - Committed: View-only, possibly print/export
  - Void: View-only
- No On Hand/On Order buttons in any GRN screens
- All tax and discount information is read-only
- BU displayed as non-interactive label
- Business Dimensions (e.g., Job Code, Market Segment, Event) are displayed at the item level, not header level

#### GRN Item Detail Dialog

**Purpose**: Display and edit detailed information for a specific item in a GRN.

**UI Components**:
- Dialog header with "Item Detail: [Product Name]" title
- Close button
- Main content showing:
  - Product Name and SKU
  - Ordered Quantity and Unit
  - Received Quantity input field
  - Unit selector (PO or inventory unit)
  - Unit Price
  - Line Total (calculated)
  - Tax details (read-only)
  - Discount details (read-only)
- Business Dimensions section:
  - Job Code (configurable, optional/required)
  - Market Segment (configurable, optional/required)
  - Event (configurable, optional/required)
- Notes/Comments field
- Action buttons:
  - "Save" (primary)
  - "Cancel" (secondary)

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Product Name | Text | GRN API | Text | Displayed before SKU |
| SKU | Text | GRN API | Alphanumeric | Product code |
| Ordered Qty | Numeric | GRN API | Number with decimals | From PO |
| Received Qty | Numeric input | User input | Number with decimals | Editable field |
| Unit | Dropdown | Config | Text | PO or inventory unit |
| Unit Price | Currency | GRN API | $#,###.## | With currency symbol |
| Line Total | Currency | Calculated | $#,###.## | Qty × Price |
| Job Code | Dropdown/Search | Master Data | Alphanumeric | Organization-specific |
| Market Segment | Dropdown/Search | Master Data | Text | Organization-specific |
| Event | Dropdown/Search | Master Data | Text | Organization-specific |

**States**:
- View mode: Displaying current values
- Edit mode: Updating values
- Validation: Highlighting required fields
- Saving: Indicator during save operation

**User Interactions**:
- Updating received quantity
- Changing unit of measure
- Selecting Business Dimensions
- Adding notes/comments
- Saving or canceling changes

**Business Rules**:
- Required Business Dimensions must be provided based on configuration
- Tax and discount information remains read-only
- Line total updates automatically based on quantity changes
- Updates are only allowed if GRN is in Draft or Received state
- Changes are logged for audit trail

### 4d. PR Approval Module Screens

#### PR List View

**Purpose**: Display Purchase Requisitions requiring review or action across all authorized Business Units.

**UI Components**:
- Header with "PR Approval" title
- Search bar and filter controls:
  - Status dropdown filter (Pending, Overdue, etc.)
  - Business Unit dropdown filter (convenience only)
  - Date range filter
  - Role filter (if user has multiple approval roles)
- List of PR cards showing:
  - PR Number
  - Status Badge
  - Requestor Name
  - Department/Outlet
  - Submission Date
  - Total Value
  - Business Unit label (non-interactive)
  - User's role relevant to this PR (optional)

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| PR Number | Text | PR API | Alphanumeric | Primary identifier |
| Status | Badge | PR API | Color-coded text | Pending Approval, Pending Your Approval, Returned, Overdue |
| Requestor | Text | PR API | Text | Person who created PR |
| Department | Text | PR API | Text | Requesting department |
| Submission Date | Date | PR API | DD/MM/YYYY | When PR was submitted |
| Total Value | Currency | PR API | $#,###.## | With currency symbol |
| Business Unit | Label | PR API | Text | Non-interactive |
| User Role | Text | PR API | Text | User's role for this PR |

**States**:
- Default: List of PRs sorted by urgency/date
- Loading: Skeleton card layout
- Filtered: Results matching applied filters
- Empty: Message when no PRs match criteria
- Error: Error message if data can't be loaded

**User Interactions**:
- Tapping PR card navigates to PR Detail
- Tapping filters opens filter controls
- Searching filters list by PR#, requestor, department
- Pull-to-refresh updates PR list

**Business Rules**:
- Aggregates PRs across all authorized BUs
- Each PR clearly shows its BU as a non-interactive label
- Optional BU filter for convenience only, never changes workflow context
- Status filtering may be role-dependent
- No BU selection during PR approval workflow

#### PR Detail View

**Purpose**: Allow detailed review of a Purchase Requisition and take appropriate approval actions.

**UI Components**:
- Header with "PR Details: [PR#]" title
- PR summary section:
  - PR Number
  - Status Badge
  - Requestor Name
  - Department/Outlet
  - Submission Date
  - Total Value
  - Business Unit (non-interactive label)
- General Information section:
  - Justification (if provided)
  - Header-level attachments
- Line items section as cards showing:
  - Product Name (displayed before SKU)
  - SKU
  - Requested Quantity/Unit
  - Approved Quantity (editable)
  - Unit Price
  - Last Price Paid (if available)
  - Tax information (read-only)
  - Line Total
  - **On Hand** button (opens overlay) - **Only available in PR Approval module**
  - **On Order** button (opens overlay) - **Only available in PR Approval module**
  - Line-specific comments/attachments
- Price Comparison section (per item):
  - List of vendor names and their prices
- Summary totals:
  - Subtotal
  - Total Tax (read-only)
  - Total Discount (read-only)
  - Grand Total
- Approval History/Workflow Trail
- Sticky footer action buttons with intelligent workflow decision engine:
  - **Dynamic Submit Button** with context-aware behavior:
    - "Submit & Approve" (green) - when items approved and no reviews/rejections
    - "Submit & Reject" (red) - when all items rejected
    - "Submit & Return" (orange) - when any items marked for review
    - Disabled state when items still pending review
  - **Save/Cancel Mode** when any item is edited:
    - "Save Changes" (blue) - saves modifications and clears edit flags
    - "Cancel Changes" (gray) - reverts all items to original state
    - Replaces submit button until changes are saved or cancelled
  - **Individual Item Actions** available on each item:
    - Approve individual items
    - Reject individual items with reason
    - Mark items for Review (return to previous stage)
    - Bulk actions for multiple selected items

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| PR Number | Text | PR API | Alphanumeric | Primary identifier |
| Status | Badge | PR API | Color-coded text | Current status |
| Requestor | Text | PR API | Text | Person who created PR |
| Business Unit | Label | PR API | Text | Non-interactive |
| Product Name | Text | PR API | Text | Displayed before SKU |
| SKU | Text | PR API | Alphanumeric | Product code |
| Requested Qty | Numeric | PR API | Number with unit | Original request |
| Approved Qty | Numeric input | User input | Number with unit | Editable field |
| Unit Price | Currency | PR API | $#,###.## | With currency symbol |
| Last Price | Currency | PR API | $#,###.## | For comparison |
| Tax information | Text | PR API | "Tax: [Name] ([Type], [Rate]%)" | Read-only on mobile. Example: "Tax: VAT (Add, 7%)" |
| Vendor Prices | List | PR API | Vendor: $#,###.## | Multiple vendor comparison |

**States**:
- Default: Showing all PR details
- Editing: When modifying approved quantities
- Submitting: During approval/rejection process
- Loading: Skeleton layout while data loads
- Error: Error message if data can't be loaded

**User Interactions**:
- Modifying Approved Quantity fields
- Tapping On Hand button to view inventory details
- Tapping On Order button to view pending orders
- Approving, rejecting, or returning the PR
- Adding comments during approval actions

**Business Rules**:
- User must have appropriate approval role for the PR's BU
- Tax and discount information is always read-only on mobile
- Changes to Approved Quantity are audit-logged
- Rejection requires mandatory reason
- Return action allows selection of workflow step to return to
- On Hand and On Order overlays provide read-only information
- No BU selection during PR approval workflow
- Tapping item detail button shows Business Dimensions for that item
- **Workflow Decision Priority Logic**:
  1. **All Rejected Priority (Highest)**: If ALL items are rejected → PR status becomes "Rejected"
  2. **Any Review Priority (High)**: If ANY item marked for "Review" → PR returns to previous workflow stage
  3. **Any Pending Priority (Medium)**: If ANY item still "Pending" → Submission blocked until all reviewed
  4. **Any Approved Priority (Low)**: If ANY item approved (and no higher priorities) → PR progresses to next stage
- **Edit State Management**:
  - Any modification to approved quantities, units, or Business Dimensions triggers edit mode
  - Save/Cancel buttons replace submit button when in edit mode
  - Original state is preserved for accurate reversion capability
  - All input fields use controlled components with proper state synchronization

#### On Hand Overlay

**Purpose**: Display current inventory information for an item selected in PR Approval.

**UI Components**:
- Modal header with:
  - "On Hand: [SKU] - [Product Name]" title
  - Business Unit label (non-interactive)
  - Close button
- Data table with columns:
  - Location
  - Qty Available
  - Min
  - Max
  - Last Counted/Stocked
- Loading indicator if data is being fetched

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Product Name | Text | Item API | Text | Item being viewed |
| SKU | Text | Item API | Alphanumeric | Product code |
| Business Unit | Label | Context | Text | Non-interactive |
| Location | Text | Inventory API | Text | Storage location |
| Qty Available | Numeric | Inventory API | Number with decimals | Current on-hand |
| Min | Numeric | Inventory API | Number with decimals | Minimum level |
| Max | Numeric | Inventory API | Number with decimals | Maximum level |
| Last Counted | Date | Inventory API | DD/MM/YYYY | Date of last count |

**States**:
- Default: Showing inventory data
- Loading: During data fetch
- Empty: No inventory locations found
- Error: Error message if data can't be loaded

**User Interactions**:
- Viewing information (read-only)
- Scrolling if multiple locations
- Tapping outside or close button to dismiss

**Business Rules**:
- Only available in PR Approval module
- Never available in Receiving, Stock Take, or Spot Check modules
- Always read-only, no edits possible on mobile
- Access is audit-logged
- Only shows data for the relevant BU

#### On Order Overlay

**Purpose**: Display pending purchase orders for an item selected in PR Approval.

**UI Components**:
- Modal header with:
  - "On Order: [SKU] - [Product Name]" title
  - Business Unit label (non-interactive)
  - Close button
- Data table with columns:
  - PO Number
  - Vendor
  - Ordered Qty
  - Status
  - Due Date
- Loading indicator if data is being fetched

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Product Name | Text | Item API | Text | Item being viewed |
| SKU | Text | Item API | Alphanumeric | Product code |
| Business Unit | Label | Context | Text | Non-interactive |
| PO Number | Text | PO API | Alphanumeric | Purchase order reference |
| Vendor | Text | PO API | Text | Supplier name |
| Ordered Qty | Numeric | PO API | Number with decimals | Quantity ordered |
| Status | Text | PO API | Text | PO status |
| Due Date | Date | PO API | DD/MM/YYYY | Expected delivery |

**States**:
- Default: Showing PO data
- Loading: During data fetch
- Empty: No pending orders found
- Error: Error message if data can't be loaded

**User Interactions**:
- Viewing information (read-only)
- Scrolling if multiple POs
- Tapping outside or close button to dismiss

**Business Rules**:
- Only available in PR Approval module
- Never available in Receiving, Stock Take, or Spot Check modules
- Always read-only, no edits possible on mobile
- Access is audit-logged
- Only shows data for the relevant BU

### 4e. Store Requisition Module Screens

#### SR List View

**Purpose**: Display Store Requisitions with filtering and search capabilities, allowing users to monitor and access requisitions across their authorized business units.

**UI Components**:
- Header with "Store Requisition" title
- Search bar for finding SRs by number or item name
- Filter controls:
  - Status dropdown (Draft, Submitted, HOD Approved, Approved, Rejected, Returned, etc.)
  - Department dropdown
  - Date range selector
- Sort options for ordering by date, status, or department
- List of SR cards, each showing:
  - SR Number (prominent)
  - Status Badge (color-coded)
  - Requesting Location
  - Source Location ("Store Name")
  - Request Date
  - Item Count
  - Business Unit (non-interactive label)
  - Business Dimensions tags (Project Code, Market Segment, Event)
- "Create New SR" floating action button
- Pull-to-refresh functionality

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|------------|--------|-------|
| SR Number | Text | SR API | Alphanumeric | Primary identifier (e.g., "SR-001") |
| Status | Badge | SR API | Color-coded text | Draft, Submitted, HOD Approved, Approved, etc. |
| Requesting Loc | Text | SR API | Text | Location requesting items |
| Source Location | Text | SR API | Text | Where items will come from |
| Request Date | Date | SR API | DD/MM/YYYY | When SR was created |
| Item Count | Numeric | SR API | Integer | Number of items in SR |
| Business Unit | Label | SR API | Text | Non-interactive |
| Project Code | Tag | SR API | Alphanumeric | Business dimension |
| Market Segment | Tag | SR API | Text | Business dimension |
| Event | Tag | SR API | Text | Business dimension |

**States**:
- Default: List of SRs sorted by date (newest first)
- Loading: Skeleton card layout
- Filtered: Results matching applied filters
- Empty: Message when no SRs match criteria
- Error: Error message if data can't be loaded

**User Interactions**:
- Tapping SR card navigates to SR Detail
- Tapping filters opens filter controls
- Searching filters list by SR# or item name
- Tapping "Create New SR" starts creation flow
- Pull-to-refresh updates SR list

**Business Rules**:
- Only shows SRs user is authorized to view
- Aggregates SRs across all authorized BUs
- Each SR clearly shows its BU as a non-interactive label
- Optional BU filter for convenience only
- Status badges use consistent color coding across the application

#### SR Creation/Edit Screen

**Purpose**: Allow users to create new Store Requisitions or edit existing drafts with clear inventory movement visualization.

**UI Components**:
- Header with "Create Store Requisition" or "Edit SR: [SR#]" title
- Form sections:
  - Header Information:
    - Request Date (date picker)
    - Requesting Location (dropdown)
    - Source Location (dropdown, labeled as "Store Name")
    - Business Unit (non-interactive label)
    - Notes/Comments field (optional)
  - Inventory Movement Visualization:
    - "Store Name" source with right-pointing arrow to "Request from" destination
    - Clear visual representation of inventory flow
  - Business Dimensions section:
    - Project Code (dropdown/search)
    - Market Segment (dropdown/search)
    - Event (dropdown/search)
  - Item Selection:
    - Search bar for finding items
    - Barcode scanner button
    - List of added items, each showing:
      - Product Name (displayed before SKU)
      - SKU
      - Requested Quantity input
      - Unit of Measure (non-editable)
      - Purpose dropdown (Regular, Special Event, Emergency)
      - Notes field
      - Business Dimensions tags
      - Remove item button
  - Item Add Modal:
    - Search/Scan interface for finding items
    - Quantity and unit input
    - Purpose selection
    - Notes field
    - Business Dimensions inheritance from header
- Footer action buttons:
  - "Save Draft"
  - "Submit SR"

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Request Date | Date picker | User input | DD/MM/YYYY | Defaults to today |
| Requesting Loc | Dropdown | Master data | Text | User's assign location |
| Source Location | Dropdown | Master data | Text | Available store locations ("Store Name") |
| Business Unit | Label | Context | Text | Non-interactive |
| Notes | Text area | User input | Text | Optional comments |
| Project Code | Dropdown | Master data | Alphanumeric | Business dimension |
| Market Segment | Dropdown | Master data | Text | Business dimension |
| Event | Dropdown | Master data | Text | Business dimension |
| Product Name | Text | Inventory API | Text | Displayed before SKU |
| SKU | Text | Inventory API | Alphanumeric | Product code |
| Requested Qty | Numeric input | User input | Number with decimals | Required field |
| Unit | Text | Inventory API | Text | Non-editable |
| Purpose | Dropdown | Config | Text | Regular, Special Event, Emergency |

**States**:
- Create: Empty form with defaults
- Edit: Populated form with existing SR data
- Validation: Highlighting required fields
- Saving: Indicator during save operation
- Submitting: Indicator during submission
- Error: Error messages if validation fails

**User Interactions**:
- Entering header information
- Selecting business dimensions
- Searching and adding items
- Specifying quantities and purpose
- Adding notes/comments
- Saving draft or submitting final SR
- Viewing inventory movement visualization

**Business Rules**:
- Required fields must be completed before submission
- Business dimensions are validated based on configuration
- Items must have valid quantities and units
- Draft SRs can be edited freely
- Submitted SRs cannot be edited
- All actions are audit-logged
- Clear "Store Name" to "Request from" visualization enforces understanding of inventory flow

#### SR Detail View

**Purpose**: Display comprehensive information about a Store Requisition and provide appropriate actions based on status and user role, with clear inventory movement visualization.

**UI Components**:
- Header with Carmen Supply branding
- SR summary section:
  - SR Number
  - Status Badge
  - Business Unit (non-interactive label)
  - Requestor
  - Department
  - Date
  - Value
- Inventory Movement section:
  - "Store Name" source (left)
  - Directional arrow (middle)
  - "Request from" destination (right)
  - Clear visual representation of flow
- Items section with header:
  - Select-all checkbox
  - Items label
  - Date
- Bulk action controls (when items selected):
  - Approve button
  - Review button
  - Reject button
- Item list as cards showing:
  - Selection checkbox
  - Product Name (prominent)
  - SKU
  - Status badge
  - Requested Quantity/Unit
  - Approved Quantity input (sm size)
  - Unit selector (sm size)
  - Price and Cost information
  - Business Dimensions tags (Project Code, Market Segment, Event)
  - Comments/Notes
  - Action buttons:
    - On Hand button
    - On Order button
  - Item action buttons (xs size):
    - Approve
    - Review
    - Reject
- Footer action buttons:
  - "Approve"
  - "Reject"
  - "Return"

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| SR Number | Text | SR API | Alphanumeric | Primary identifier |
| Status | Badge | SR API | Color-coded text | Current workflow state |
| Requestor | Text | SR API | Text | Person requesting items |
| Department | Text | SR API | Text | Department requesting items |
| Source Location | Text | SR API | Text | Where items come from ("Store Name") |
| Request Date | Date | SR API | DD/MM/YYYY | When SR was created |
| Business Unit | Label | SR API | Text | Non-interactive |
| Product Name | Text | SR API | Text | Displayed before SKU |
| SKU | Text | SR API | Alphanumeric | Product code |
| Requested Qty | Numeric | SR API | Number with unit | Original request |
| Approved Qty | Numeric input | User input | Number with unit | Small-sized input |
| Unit | Dropdown | SR API | Text | Small-sized selector |
| Price | Currency | SR API | $#,###.## | Unit price |
| Total Cost | Currency | SR API | $#,###.## | Qty × Price |
| Project Code | Text | SR API | Alphanumeric | Business dimension |
| Market Segment | Text | SR API | Text | Business dimension |
| Event | Text | SR API | Text | Business dimension |

**States**:
- View by status: Different actions available based on SR status
- Loading: Skeleton layout while data loads
- Item selection: When items are selected for bulk actions
- Error: Error message if data can't be loaded

**User Interactions**:
- Reviewing SR details
- Selecting items for bulk actions
- Modifying approved quantities
- Tapping On Hand/On Order buttons for inventory information
- Taking actions appropriate to status and role:
  - Approving items individually or in bulk
  - Rejecting items individually or in bulk
  - Reviewing items
  - Returning the SR

**Business Rules**:
- Available actions depend on SR status and user role
- Approval/rejection requires appropriate permissions
- Small-sized (sm) input controls optimize mobile experience
- On Hand and On Order buttons provide read-only information
- Proper spacing between action buttons using ml-auto for Detail button
- Business Unit is always displayed as non-interactive label
- Clear inventory movement visualization with "Store Name" and "Request from" labels

#### SR Approval Modal

**Purpose**: Allow approvers to review and take action on a Store Requisition with streamlined approval workflow.

**UI Components**:
- Modal header with action type ("Approve Item", "Reject Item","Review Item")
- Item identification (name and SKU)
- Comments/Notes field:
  - For approvals: Optional notes
  - For rejections: Required reason
- Action buttons:
  - Cancel
  - Confirm action (Approve/Reject)

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Action Type | Text | Context | Text | Approve or Reject |
| Item Name | Text | SR API | Text | Item being approved/rejected |
| Item SKU | Text | SR API | Alphanumeric | Product code |
| Comments | Text area | User input | Text | Required for reject |

**States**:
- Approve: Optional comments
- Reject: Required reason
- Submitting: During action processing
- Error: If action fails

**User Interactions**:
- Entering approval/rejection comments
- Confirming or canceling the action

**Business Rules**:
- Approval comments are optional
- Rejection reason is mandatory
- No quantity adjustment controls in the modal
- All actions are audit-logged with user, timestamp, and comments
- Streamlined approval flow focused on notes/comments

#### SR Issuance Screen

**Purpose**: Allow store staff to fulfill approved Store Requisitions by recording issued quantities.

**UI Components**:
- Header with "Issue SR: [SR#]" title
- SR summary information
- List of items to issue, each showing:
  - Product Name and SKU
  - **Three-column quantity layout**:
    - **Requested Quantity**: Original requested amount (read-only display)
    - **Approved Quantity**: Editable input field with unit selector
    - **Issue Quantity**: New dedicated input field with unit selector for actual issued amounts
  - **Independent unit selectors**: Each quantity field (Approved and Issue) has its own unit dropdown
  - **Real-time variance calculation**: Automatic display of differences between requested, approved, and issued quantities
  - Notes field for variance explanations
- Delivery Confirmation section:
  - Recipient signature capture
  - Delivery timestamp (automatic)
  - Location (automatic if available)
- Footer action buttons:
  - "Save Progress" (for partial issuance)
  - "Complete Issuance"

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Product Name | Text | SR API | Text | Item being issued |
| SKU | Text | SR API | Alphanumeric | Product code |
| Requested Qty | Numeric | SR API | Number with unit | Original request (read-only) |
| Approved Qty | Numeric input | User input | Number with unit | Approved amount (editable) |
| Approved Unit | Dropdown | User input | Text | Unit selector for approved quantity |
| Issue Qty | Numeric input | User input | Number with unit | Actual issued amount |
| Issue Unit | Dropdown | User input | Text | Unit selector for issued quantity |
| Variance | Calculated | System | Number with +/- | Multi-level variance tracking (req vs approved, approved vs issued) |
| Notes | Text input | User input | Text | Explanation for variances |
| Signature | Drawing input | User input | Image | Recipient signature |

**States**:
- Default: Showing all items to issue with three-column layout
- In Progress: Some items issued
- Complete: All items issued
- Saving: During save operation
- Error: If save fails

**User Interactions**:
- **Editing approved quantities** for each item with unit selection
- **Entering issued quantities** for each item with independent unit selection
- **Real-time variance monitoring** as quantities are entered
- Adding notes for discrepancies
- Capturing recipient signature
- Saving progress for later completion
- Completing the issuance process

**Business Rules**:
- **Flexible unit selection**: Approved and issued quantities can use different units
- **Multi-level variance tracking**: System tracks variances between requested vs approved and approved vs issued quantities
- Significant variances require explanation notes
- **Complete audit trail**: All quantity changes from request through approval to issuance are logged
- Recipient signature is required for completion
- Delivery timestamp and location are automatically recorded
- All issuance actions are audit-logged
- **Mobile-optimized layout**: Three-column grid with vertical input stacking for mobile screens

### 4f. Stock Take Module Screens

#### Stock Take Navigation Flow
- When user selects Stock Take from the dashboard or bottom nav, they are presented with an option screen to choose between Physical Count and Spot Check.
- Selecting Physical Count navigates to the Physical Count entry screen, where the user selects a location, sees the location type, and starts a count session.
- Selecting Spot Check navigates to the Spot Check entry screen, where the user selects a location, chooses item selection method (Random, High Value, Manual), and starts a spot check session.
- Each entry screen enforces business rules for location authorization, item selection, and session creation.

#### Physical Count Entry Screen
- UI Components: Header, location dropdown, location type indicator, start button
- Data Fields: Location, Location Type, Period, Period End Date
- Business Rules: Only authorized locations shown, location type determines count requirements

#### Stock Count Entry

**Purpose**: Enable users to enter actual inventory counts for physical count sessions.

**UI Components**:
- Header with session information
- Progress indicator (e.g., "8 of 20 complete")
- List of items to count, each showing:
  - Product name
  - SKU
  - Current system quantity (if user has permission)
  - Input field for actual count
  - Variance (calculated automatically)
  - Unit of measure
  - Notes field
  - Photo attachment option
- "Save Progress" button
- "Submit Count" button (enabled only when all items counted)

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Product Name | Text | Inventory API | Text | Item being counted |
| SKU | Text | Inventory API | Alphanumeric | Product code |
| System Qty | Numeric | Inventory API | Number with decimals | Current recorded quantity |
| Actual Count | Numeric input | User input | Number with decimals | User-entered quantity |
| Variance | Calculated | System | Number with +/- | Difference between system and actual |
| Unit | Dropdown | Inventory API | Text | Unit of measure |
| Notes | Text input | User input | Text | Optional comments |

**States**:
- Default: Showing all items to count
- In Progress: Some items counted
- Complete: All items counted
- Error: If data can't be saved

**User Interactions**:
- Entering actual count for each item
- Adding notes or photos for discrepancies
- Saving progress to resume later
- Submitting when all items are counted

**Business Rules**:
- Variances beyond threshold are flagged for review
- Submit button only enabled when all items have been counted
- Session can be saved and resumed
- All counts and actions are audit-logged with timestamp and location

#### Spot Check Entry Screen (UPDATED)
- UI Components: Header, location dropdown, item selection method (radio), number of items, start button
- Data Fields: Location, Selection Method, Number of Items, Price Filter (if High Value), **Start Timestamp**
- Business Rules: Only authorized locations shown, item list locked after start, all items must be checked before submission, **session start time and location are recorded and displayed**

#### Spot Check Session Page (NEW)
- UI Components: Header with session ID, location, and **start timestamp**; list of items to check; progress indicator
- Data Fields: Item list, actual counts, notes, photos, **location**, **start timestamp**
- Business Rules: Item list is locked, progress is tracked, all actions are audit-logged with timestamp and location

#### Spot Check Review & Success Screens (UPDATED)
- UI Components: Display session summary, flagged variances, and **completion timestamp**
- Data Fields: Variance list, notes, photos, **location**, **start and completion timestamps**
- Business Rules: Submission records completion time, all data is included in the audit trail

### 4g. Notification Module

#### Notification List

**Purpose**: Display actionable notifications requiring user attention.

**UI Components**:
- Header with "Notifications" title
- "Mark All as Read" button (if unread notifications exist)
- Chronological list of notifications showing:
  - Icon relevant to notification type
  - Context/Title (e.g., "PR #12345 requires your approval")
  - Details (Requestor, Outlet, Value)
  - Business Unit label (non-interactive)
  - Timestamp
  - Read/Unread indicator
- Empty state message when no notifications

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Notification Type | Icon | Notification API | Visual | Indicates PR, return, etc. |
| Context | Text | Notification API | Text | What needs attention |
| Details | Text | Notification API | Text | Supplementary information |
| Business Unit | Label | Notification API | Text | Non-interactive |
| Timestamp | Date/Time | Notification API | Relative time | "2 hours ago" |
| Read Status | Visual | Notification API | Indicator | Bold/color for unread |

**States**:
- Default: Chronological list (newest first)
- All Read: No unread indicators
- Empty: "No new notifications"
- Loading: During data fetch
- Error: If notifications can't be loaded

**User Interactions**:
- Tapping notification navigates to relevant screen
- Swiping to dismiss/archive
- Tapping "Mark All as Read"
- Pull-to-refresh for updates

**Business Rules**:
- Notifications retain PR's BU context
- Tapping navigates directly to correct screen with BU context preserved
- Read/unread status is synced across devices
- All notification interactions are audit-logged

#### System Alerts

**Purpose**: Provide immediate attention for time-sensitive or critical notifications.

**UI Components**:
- Alert types:
  - Toast/Snackbar (brief, auto-dismissing)
  - Banner (more persistent, requires dismissal)
  - Modal (highest priority, requires action)
- Content elements:
  - Icon indicating type/urgency
  - Concise message
  - Optional action button
  - Dismiss option

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Alert Type | Visual | Alert System | Toast/Banner/Modal | Based on priority |
| Message | Text | Alert System | Concise text | What requires attention |
| Action Button | Interactive | Alert System | Button | Optional direct action |
| Timeout | Hidden | Alert System | Milliseconds | For auto-dismissing alerts |

**States**:
- Appearing: Animation in
- Visible: During display period
- Dismissing: Animation out
- Action Taken: When user interacts

**User Interactions**:
- Reading alert content
- Dismissing alert (tap X, swipe, etc.)
- Taking direct action via button
- Ignoring (auto-dismiss for lower priority)

**Business Rules**:
- High-priority alerts (session expiry, critical approvals) use modal
- Medium-priority alerts (new assignments, status changes) use banner
- Low-priority alerts (informational updates) use toast/snackbar
- All alert displays and user interactions are logged

### 4h. Profile & Settings

#### Profile View

**Purpose**: Display user information, roles, and assigned Business Units.

**UI Components**:
- Header with "Profile" title
- Personal information section:
  - User's Name
  - Email Address
  - Employee ID (if applicable)
- Role & Permissions section:
  - Current System Role(s)
- Business Unit Assignments section:
  - List of all BUs user is authorized for (informational only)
- App Information section:
  - App Version
  - Links to "Privacy Policy," "Terms of Service," "Help/Support"
- Action buttons:
  - "Change Password" (if applicable)
  - "Log Out"

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Name | Text | User API | Text | User's full name |
| Email | Text | User API | Email format | User's email address |
| Employee ID | Text | User API | Alphanumeric | If applicable |
| Roles | Text list | User API | Comma-separated | User's system roles |
| Business Units | Text list | User API | Bullet list | Assigned BUs (read-only) |
| App Version | Text | System | Semantic versioning | e.g., "v1.2.3" |

**States**:
- Default: Displaying user information
- Loading: During data fetch
- Error: If profile can't be loaded

**User Interactions**:
- Viewing profile information
- Tapping "Change Password" to navigate to password change screen
- Tapping "Log Out" to end session
- Tapping links to view policies or help

**Business Rules**:
- BU assignment list is for user information only
- No BU selection or switching is available
- All profile access and actions are audit-logged

#### Change Password (If Applicable)

**Purpose**: Allow users to update their password when using email/password authentication.

**UI Components**:
- Header with "Change Password" title
- Form fields:
  - Current Password
  - New Password
  - Confirm New Password
- Password strength indicator
- "Update Password" button
- "Cancel" button

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Current Password | Password input | User input | Masked | Validates current access |
| New Password | Password input | User input | Masked | With strength requirements |
| Confirm Password | Password input | User input | Masked | Must match New Password |

**States**:
- Default: Empty form
- Validation: Error messages if requirements not met
- Submitting: During password update
- Success: Confirmation message
- Error: If update fails

**User Interactions**:
- Entering current password
- Creating and confirming new password
- Submitting form
- Canceling and returning to Profile

**Business Rules**:
- New password must meet organization security requirements
- Passwords are never stored in plain text
- Password change attempts (success/failure) are audit-logged
- Success redirects to Profile with confirmation

## 5. Content Components & Patterns

### Typography & Text Patterns

#### Text Hierarchy

**Headers**:
- Screen Titles: 20px, Bold, Title Case
- Section Headers: 16px, Bold, Title Case
- Card Titles: 16px, Medium, Sentence case
- Field Labels: 14px, Medium, Sentence case

**Body Text**:
- Primary Content: 14px, Regular
- Secondary Content: 12px, Regular
- Tertiary/Hint Text: 12px, Light Italic

#### Text Formatting Rules

**Numbers & Currencies**:
- Whole numbers: No decimal places (e.g., "42")
- Decimal values: Up to 2 decimal places (e.g., "42.50")
- Currencies: Symbol and 2 decimal places (e.g., "$42.50")
- Large numbers: Thousands separator (e.g., "1,234,567")

**Dates & Times**:
- Short Date: DD/MM/YYYY (e.g., "15/06/2025")
- Long Date: DD Month YYYY (e.g., "15 June 2025")
- Relative Time: For recent events (e.g., "2 hours ago")
- Time: 24-hour format (e.g., "14:30")

**Status Messages**:
- Success: Green text/icon, positive action verbs
- Warning: Orange text/icon, cautionary language
- Error: Red text/icon, clear problem statements
- Info: Blue text/icon, neutral informative tone

### Color Usage

**Primary Colors**:
- Primary Blue (#0F52BA): Main actions, headers, primary emphasis
- Secondary Amber (#F9A826): Secondary actions, highlights

**Status Colors**:
- Success Green (#10B981): Confirmations, completions
- Warning Amber (#F59E0B): Caution, pending actions
- Danger Red (#EF4444): Errors, destructive actions
- Info Blue (#3B82F6): Informational elements

**Text Colors**:
- Primary Text (#111827): Main content
- Secondary Text (#4B5563): Supporting information
- Disabled Text (#9CA3AF): Inactive elements
- Inverted Text (#FFFFFF): On dark backgrounds

**Background Colors**:
- Page Background (#F9FAFB): Main app background
- Card Background (#FFFFFF): Content containers
- Accent Background (#F3F4F6): Secondary containers
- Highlight Background (#EFF6FF): Emphasized elements

### UI Components

#### Buttons

**Primary Button**:
- Full width on mobile
- Carmen Blue background (#0F52BA)
- White text
- 12px rounded corners
- 44px minimum height
- Centered text, Bold

**Secondary Button**:
- Outlined style
- Carmen Blue border and text
- Transparent background
- Same size/shape as Primary

**Tertiary Button**:
- Text only
- No background or border
- Carmen Blue text
- Usually smaller than Primary/Secondary

**Disabled State**:
- 50% opacity
- Non-interactive appearance
- Tooltip on hover explaining why disabled

#### Form Controls

**Text Inputs**:
- Full width on mobile
- 44px minimum height
- Clear label above
- Placeholder text (light gray)
- Validation message below
- 1px border (2px when focused)

**Dropdown Selects**:
- Similar styling to text inputs
- Clear chevron indicator
- Full-screen modal on mobile for options
- Search functionality for long lists

**Checkboxes & Radio Buttons**:
- Minimum 24px touch target
- Clear labeling
- Visual feedback on selection
- Grouped with related options

**Date & Time Pickers**:
- Native mobile controls where possible
- Clear format indication
- Calendar/wheel picker on tap

#### Cards & Lists

**Card Container**:
- White background
- Light shadow
- 8px rounded corners
- 16px padding
- Clear visual hierarchy of content

**List Items**:
- Minimum 44px height
- Clear primary/secondary text
- Optional right action/disclosure
- Subtle dividers between items
- Active/selected states

**Status Badges**:
- Color-coded by status
- Compact pill shape
- 4px rounded corners
- 4-8px padding
- Bold or medium text weight

### Navigation Patterns

#### Tab Bar

**Appearance**:
- Fixed at bottom of screen
- 5 tabs maximum
- Icon and label for each
- Active state clearly indicated
- 44px minimum height

**Behavior**:
- Single tap navigation
- Persists across screens within module
- May include badge notifications
- "More" tab for additional options

#### Back Navigation

**Appearance**:
- Left-aligned in header
- Back arrow icon with optional label
- Consistent position across app

**Behavior**:
- Returns to previous screen
- Confirms unsaved changes
- May indicate current position in hierarchy

#### Modal Dialogs

**Appearance**:
- Center or bottom sheet presentation
- Distinct from background (overlay)
- Clear title
- Focused content
- Explicit action buttons

**Behavior**:
- Focus on single task or decision
- Blocks interaction with screen behind
- Dismissible via button or gesture
- Returns focus to previous context

### Business Unit Label

**Appearance**:
- Consistent visual treatment
- Blue badge background (#EFF6FF)
- Blue text (#1E40AF)
- 4px rounded corners
- Compact size
- "BU:" prefix or icon

**Placement**:
- List items: Right-aligned or below primary info
- Detail headers: Prominent in summary section
- Modal overlays: In header with context info

**Behavior**:
- Always non-interactive
- Clearly distinguishable from actionable elements
- Present on all transaction-related screens
- Consistent across modules

## 6. Content Governance & Maintenance

### Content Review Process

**Quarterly Content Audit**:
- Review all screen content for accuracy and consistency
- Validate against updated business requirements
- Check for terminology alignment across modules
- Identify opportunities for improvement
- Document findings and recommendations

**Change Management**:
- All content changes require documented rationale
- Significant changes require stakeholder review
- Changes implemented in test environment first
- User feedback collected before broad deployment
- Version tracking for all content updates

### Content Standards Enforcement

**Design System Integration**:
- Content patterns documented in design system
- Component library includes content guidelines
- Design system enforced in implementation
- Regular reviews for compliance

**QA Testing**:
- Dedicated content-focused test cases
- Validation against specification document
- Cross-module consistency checks
- Testing across device sizes and orientations

### Content Measurement & Improvement

**User Feedback Collection**:
- In-app feedback mechanisms
- User testing sessions
- Support ticket analysis
- Usage analytics review

**Continuous Improvement**:
- Identify content pain points from metrics
- Prioritize improvements based on impact
- A/B test significant content changes
- Measure effectiveness of improvements

### Documentation Maintenance

**Living Documentation**:
- Content Specification Document updated with each release
- Change history maintained
- Accessible to all product team members
- Serves as single source of truth

**Content Component Library**:
- Reusable content patterns documented
- Example implementations provided
- Usage guidelines and context
- Alternative options where applicable

### Content Localization (If Applicable)

**Translation Process**:
- Content strings extracted to resource files
- Professional translation services engaged
- Context provided for translators
- Review by native speakers

**Localization Testing**:
- Text expansion/contraction accommodated
- Date/number/currency format adaptation
- Cultural appropriateness validation
- Technical validation in target languages

### Emergency Content Updates

**Critical Issue Process**:
- Expedited review for urgent content problems
- Hotfix deployment process
- User notification where appropriate
- Post-mortem analysis to prevent recurrence

**Compliance Changes**:
- Priority process for regulatory requirements
- Legal/compliance team review
- Documentation of compliance-driven changes
- User education for significant changes

## Acceptance Criteria (At the end of the document)

- **On Hand and On Order Buttons:** Present only in PR Approval module (PR detail screens) for item lines. These features are not available in any other module.
  - Overlays/panels expand on tap, contain correct, current data and column headers, and are mobile-optimized.
  - No mobile edits permitted via these overlays.
  - All accesses are audit-logged.

- A clearly visible, non-editable BU label is shown on every transaction in all relevant lists and detail views.

- Spot Check Review and Success pages are accessible and do not return 404 errors.
- Item Selection Method visually highlights the selected method.
- Proceed to Review and Submit Spot Check buttons enable only when all items are filled (including zero).
- On Hand and On Order overlays are present ONLY in PR Approval, not in Spot Check or Stock Take.
- No debug output or console logs in production UI.
- All Spot Check actions are audit-logged with timestamps and location.

### Store Requisition Module

**Purpose**: Facilitate internal transfer of goods between departments or locations within the same Business Unit through a structured requisition and approval workflow.

**Key Features**:
- SR list with status, department, and date filtering
- Create, edit, and submit Store Requisitions (SR)
- Item selection by search or barcode
- Multi-phase approval (Department Head, Store Manager)
- Issuance tracking and delivery confirmation
- Attachments and business dimensions (Job Code, Market Segment, Event)
- Offline support and audit trail
- Business Unit context always displayed as a non-interactive label
- Well-designed item action buttons with optimal spacing between On Order and Detail buttons
- Mobile-optimized input controls with small (sm) sizing for approved quantity fields
- Clear inventory movement visualization with "Store Name" (source) and "Request from" (destination) labeling
- Comprehensive Business Dimensions structure with specific fields for Project Code, Market Segment, and Event
- Streamlined approval modal focused on approval notes without quantity adjustment controls

**Primary Users**: Department Requestors, Department Heads, Store Managers, Store Staff

**Detailed Screen Specifications**:

#### SR List View

**Purpose**: Display all Store Requisitions accessible to the user with filtering and search capabilities.

**UI Components**:
- Header with "Store Requisition" title and Business Unit indicator
- Search bar for finding SRs by number or item name
- Filter controls:
  - Status dropdown (Draft, Submitted, HOD Approved, Approved, Rejected, Returned, etc.)
  - Department dropdown
  - Date range selector
- Sort dropdown for ordering by date, status, or department
- List of SR cards, each showing:
  - SR Number (prominent)
  - Status Badge (color-coded)
  - Requesting Department
  - Source Location ("Store Name")
  - Request Date
  - Item Count
  - Business Unit (non-interactive label)
- "Create New SR" floating action button
- Pull-to-refresh functionality for latest updates

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|------------|--------|-------|
| SR Number | Text | SR API | Alphanumeric | Primary identifier |
| Status | Badge | SR API | Color-coded text | Draft, Submitted, HOD Approved, Approved, etc. |
| Requesting Dept | Text | SR API | Text | Department requesting items |
| Source Location | Text | SR API | Text | Where items will come from |
| Request Date | Date | SR API | DD/MM/YYYY | When SR was created |
| Item Count | Numeric | SR API | Integer | Number of items in SR |
| Business Unit | Label | SR API | Text | Non-interactive |
| Project Code | Tag | SR API | Alphanumeric | Business dimension |
| Market Segment | Tag | SR API | Text | Business dimension |
| Event | Tag | SR API | Text | Business dimension |

**States**:
- Default: List of SRs sorted by date (newest first)
- Loading: Skeleton card layout
- Filtered: Results matching applied filters
- Empty: Message when no SRs match criteria
- Error: Error message if data can't be loaded

**User Interactions**:
- Tapping SR card navigates to SR Detail
- Tapping filters opens filter controls
- Searching filters list by SR# or item name
- Tapping "Create New SR" starts creation flow
- Pull-to-refresh updates SR list

**Business Rules**:
- Only shows SRs user is authorized to view
- Aggregates SRs across all authorized BUs
- Each SR clearly shows its BU as a non-interactive label
- Optional BU filter for convenience only
- Status badges use consistent color coding across the application

#### SR Creation/Edit Screen

**Purpose**: Allow users to create new Store Requisitions or edit existing drafts with clear inventory movement visualization.

**UI Components**:
- Header with "Create Store Requisition" or "Edit SR: [SR#]" title
- Form sections:
  - Header Information:
    - Request Date (date picker)
    - Requesting Department (dropdown)
    - Source Location (dropdown, labeled as "Store Name")
    - Business Unit (non-interactive label)
    - Notes/Comments field (optional)
  - Inventory Movement Visualization:
    - "Store Name" source with right-pointing arrow to "Request from" destination
    - Clear visual representation of inventory flow
  - Business Dimensions section:
    - Project Code (dropdown/search)
    - Market Segment (dropdown/search)
    - Event (dropdown/search)
  - Item Selection:
    - Search bar for finding items
    - Barcode scanner button
    - List of added items, each showing:
      - Product Name (displayed before SKU)
      - SKU
      - Requested Quantity input
      - Unit of Measure (non-editable)
      - Purpose dropdown (Regular, Special Event, Emergency)
      - Notes field
      - Business Dimensions tags
      - Remove item button
  - Item Add Modal:
    - Search/Scan interface for finding items
    - Quantity and unit input
    - Purpose selection
    - Notes field
    - Business Dimensions inheritance from header
- Footer action buttons:
  - "Save Draft"
  - "Submit SR"

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Request Date | Date picker | User input | DD/MM/YYYY | Defaults to today |
| Requesting Dept | Dropdown | Master data | Text | User's departments |
| Source Location | Dropdown | Master data | Text | Available store locations ("Store Name") |
| Business Unit | Label | Context | Text | Non-interactive |
| Notes | Text area | User input | Text | Optional comments |
| Project Code | Dropdown | Master data | Alphanumeric | Business dimension |
| Market Segment | Dropdown | Master data | Text | Business dimension |
| Event | Dropdown | Master data | Text | Business dimension |
| Product Name | Text | Inventory API | Text | Displayed before SKU |
| SKU | Text | Inventory API | Alphanumeric | Product code |
| Requested Qty | Numeric input | User input | Number with decimals | Required field |
| Unit | Text | Inventory API | Text | Non-editable |
| Purpose | Dropdown | Config | Text | Regular, Special Event, Emergency |

**States**:
- Create: Empty form with defaults
- Edit: Populated form with existing SR data
- Validation: Highlighting required fields
- Saving: Indicator during save operation
- Submitting: Indicator during submission
- Error: Error messages if validation fails

**User Interactions**:
- Entering header information
- Selecting business dimensions
- Searching and adding items
- Specifying quantities and purpose
- Adding notes/comments
- Saving draft or submitting final SR
- Viewing inventory movement visualization

**Business Rules**:
- Required fields must be completed before submission
- Business dimensions are validated based on configuration
- Items must have valid quantities and units
- Draft SRs can be edited freely
- Submitted SRs cannot be edited
- All actions are audit-logged
- Clear "Store Name" to "Request from" visualization enforces understanding of inventory flow

#### SR Detail View

**Purpose**: Display comprehensive information about a Store Requisition and provide appropriate actions based on status and user role, with clear inventory movement visualization.

**UI Components**:
- Header with Carmen Supply branding
- SR summary section:
  - SR Number
  - Status Badge
  - Business Unit (non-interactive label)
  - Requestor
  - Department
  - Date
  - Value
- Inventory Movement section:
  - "Store Name" source (left)
  - Directional arrow (middle)
  - "Request from" destination (right)
  - Clear visual representation of flow
- Items section with header:
  - Select-all checkbox
  - Items label
  - Date
- Bulk action controls (when items selected):
  - Approve button
  - Review button
  - Reject button
- Item list as cards showing:
  - Selection checkbox
  - Product Name (prominent)
  - SKU
  - Status badge
  - Requested Quantity/Unit
  - Approved Quantity input (sm size)
  - Unit selector (sm size)
  - Price and Cost information
  - Business Dimensions tags (Project Code, Market Segment, Event)
  - Comments/Notes
  - Action buttons:
    - On Hand button
    - On Order button
    - Detail button (with ml-auto for proper spacing)
  - Item action buttons (xs size):
    - Approve
    - Review
    - Reject
- Footer action buttons:
  - "Approve All"
  - "Reject All"
  - "Return"

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| SR Number | Text | SR API | Alphanumeric | Primary identifier |
| Status | Badge | SR API | Color-coded text | Current workflow state |
| Requestor | Text | SR API | Text | Person requesting items |
| Department | Text | SR API | Text | Department requesting items |
| Source Location | Text | SR API | Text | Where items come from ("Store Name") |
| Request Date | Date | SR API | DD/MM/YYYY | When SR was created |
| Business Unit | Label | SR API | Text | Non-interactive |
| Product Name | Text | SR API | Text | Displayed before SKU |
| SKU | Text | SR API | Alphanumeric | Product code |
| Requested Qty | Numeric | SR API | Number with unit | Original request |
| Approved Qty | Numeric input | User input | Number with unit | Small-sized input |
| Unit | Dropdown | SR API | Text | Small-sized selector |
| Price | Currency | SR API | $#,###.## | Unit price |
| Total Cost | Currency | SR API | $#,###.## | Qty × Price |
| Project Code | Text | SR API | Alphanumeric | Business dimension |
| Market Segment | Text | SR API | Text | Business dimension |
| Event | Text | SR API | Text | Business dimension |

**States**:
- View by status: Different actions available based on SR status
- Loading: Skeleton layout while data loads
- Item selection: When items are selected for bulk actions
- Error: Error message if data can't be loaded

**User Interactions**:
- Reviewing SR details
- Selecting items for bulk actions
- Modifying approved quantities
- Tapping On Hand/On Order buttons for inventory information
- Taking actions appropriate to status and role:
  - Approving items individually or in bulk
  - Rejecting items individually or in bulk
  - Reviewing items
  - Returning the SR

**Business Rules**:
- Available actions depend on SR status and user role
- Approval/rejection requires appropriate permissions
- Small-sized (sm) input controls optimize mobile experience
- On Hand and On Order buttons provide read-only information
- Proper spacing between action buttons using ml-auto for Detail button
- Business Unit is always displayed as non-interactive label
- Clear inventory movement visualization with "Store Name" and "Request from" labels

#### SR Approval Modal

**Purpose**: Allow approvers to review and take action on a Store Requisition with streamlined approval workflow.

**UI Components**:
- Modal header with action type ("Approve Item", "Reject Item")
- Item identification (name and SKU)
- Comments/Notes field:
  - For approvals: Optional notes
  - For rejections: Required reason
- Action buttons:
  - Cancel
  - Confirm action (Approve/Reject)

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Action Type | Text | Context | Text | Approve or Reject |
| Item Name | Text | SR API | Text | Item being approved/rejected |
| Item SKU | Text | SR API | Alphanumeric | Product code |
| Comments | Text area | User input | Text | Required for reject |

**States**:
- Approve: Optional comments
- Reject: Required reason
- Submitting: During action processing
- Error: If action fails

**User Interactions**:
- Entering approval/rejection comments
- Confirming or canceling the action

**Business Rules**:
- Approval comments are optional
- Rejection reason is mandatory
- No quantity adjustment controls in the modal
- All actions are audit-logged with user, timestamp, and comments
- Streamlined approval flow focused on notes/comments

#### SR Issuance Screen

**Purpose**: Allow store staff to fulfill approved Store Requisitions by recording issued quantities.

**UI Components**:
- Header with "Issue SR: [SR#]" title
- SR summary information
- List of items to issue, each showing:
  - Product Name and SKU
  - **Three-column quantity layout**:
    - **Requested Quantity**: Original requested amount (read-only display)
    - **Approved Quantity**: Editable input field with unit selector
    - **Issue Quantity**: New dedicated input field with unit selector for actual issued amounts
  - **Independent unit selectors**: Each quantity field (Approved and Issue) has its own unit dropdown
  - **Real-time variance calculation**: Automatic display of differences between requested, approved, and issued quantities
  - Notes field for variance explanations
- Delivery Confirmation section:
  - Recipient signature capture
  - Delivery timestamp (automatic)
  - Location (automatic if available)
- Footer action buttons:
  - "Save Progress" (for partial issuance)
  - "Complete Issuance"

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Product Name | Text | SR API | Text | Item being issued |
| SKU | Text | SR API | Alphanumeric | Product code |
| Requested Qty | Numeric | SR API | Number with unit | Original request (read-only) |
| Approved Qty | Numeric input | User input | Number with unit | Approved amount (editable) |
| Approved Unit | Dropdown | User input | Text | Unit selector for approved quantity |
| Issue Qty | Numeric input | User input | Number with unit | Actual issued amount |
| Issue Unit | Dropdown | User input | Text | Unit selector for issued quantity |
| Variance | Calculated | System | Number with +/- | Multi-level variance tracking (req vs approved, approved vs issued) |
| Notes | Text input | User input | Text | Explanation for variances |
| Signature | Drawing input | User input | Image | Recipient signature |

**States**:
- Default: Showing all items to issue with three-column layout
- In Progress: Some items issued
- Complete: All items issued
- Saving: During save operation
- Error: If save fails

**User Interactions**:
- **Editing approved quantities** for each item with unit selection
- **Entering issued quantities** for each item with independent unit selection
- **Real-time variance monitoring** as quantities are entered
- Adding notes for discrepancies
- Capturing recipient signature
- Saving progress for later completion
- Completing the issuance process

**Business Rules**:
- **Flexible unit selection**: Approved and issued quantities can use different units
- **Multi-level variance tracking**: System tracks variances between requested vs approved and approved vs issued quantities
- Significant variances require explanation notes
- **Complete audit trail**: All quantity changes from request through approval to issuance are logged
- Recipient signature is required for completion
- Delivery timestamp and location are automatically recorded
- All issuance actions are audit-logged
- **Mobile-optimized layout**: Three-column grid with vertical input stacking for mobile screens

### 4f. Stock Take Module Screens

#### Stock Take Navigation Flow
- When user selects Stock Take from the dashboard or bottom nav, they are presented with an option screen to choose between Physical Count and Spot Check.
- Selecting Physical Count navigates to the Physical Count entry screen, where the user selects a location, sees the location type, and starts a count session.
- Selecting Spot Check navigates to the Spot Check entry screen, where the user selects a location, chooses item selection method (Random, High Value, Manual), and starts a spot check session.
- Each entry screen enforces business rules for location authorization, item selection, and session creation.

#### Physical Count Entry Screen
- UI Components: Header, location dropdown, location type indicator, start button
- Data Fields: Location, Location Type, Period, Period End Date
- Business Rules: Only authorized locations shown, location type determines count requirements

#### Stock Count Entry

**Purpose**: Enable users to enter actual inventory counts for physical count sessions.

**UI Components**:
- Header with session information
- Progress indicator (e.g., "8 of 20 complete")
- List of items to count, each showing:
  - Product name
  - SKU
  - Current system quantity (if user has permission)
  - Input field for actual count
  - Variance (calculated automatically)
  - Unit of measure
  - Notes field
  - Photo attachment option
- "Save Progress" button
- "Submit Count" button (enabled only when all items counted)

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Product Name | Text | Inventory API | Text | Item being counted |
| SKU | Text | Inventory API | Alphanumeric | Product code |
| System Qty | Numeric | Inventory API | Number with decimals | Current recorded quantity |
| Actual Count | Numeric input | User input | Number with decimals | User-entered quantity |
| Variance | Calculated | System | Number with +/- | Difference between system and actual |
| Unit | Dropdown | Inventory API | Text | Unit of measure |
| Notes | Text input | User input | Text | Optional comments |

**States**:
- Default: Showing all items to count
- In Progress: Some items counted
- Complete: All items counted
- Error: If data can't be saved

**User Interactions**:
- Entering actual count for each item
- Adding notes or photos for discrepancies
- Saving progress to resume later
- Submitting when all items are counted

**Business Rules**:
- Variances beyond threshold are flagged for review
- Submit button only enabled when all items have been counted
- Session can be saved and resumed
- All counts and actions are audit-logged with timestamp and location

#### Spot Check Entry Screen (UPDATED)
- UI Components: Header, location dropdown, item selection method (radio), number of items, start button
- Data Fields: Location, Selection Method, Number of Items, Price Filter (if High Value), **Start Timestamp**
- Business Rules: Only authorized locations shown, item list locked after start, all items must be checked before submission, **session start time and location are recorded and displayed**

#### Spot Check Session Page (NEW)
- UI Components: Header with session ID, location, and **start timestamp**; list of items to check; progress indicator
- Data Fields: Item list, actual counts, notes, photos, **location**, **start timestamp**
- Business Rules: Item list is locked, progress is tracked, all actions are audit-logged with timestamp and location

#### Spot Check Review & Success Screens (UPDATED)
- UI Components: Display session summary, flagged variances, and **completion timestamp**
- Data Fields: Variance list, notes, photos, **location**, **start and completion timestamps**
- Business Rules: Submission records completion time, all data is included in the audit trail

### 4g. Notification Module

#### Notification List

**Purpose**: Display actionable notifications requiring user attention.

**UI Components**:
- Header with "Notifications" title
- "Mark All as Read" button (if unread notifications exist)
- Chronological list of notifications showing:
  - Icon relevant to notification type
  - Context/Title (e.g., "PR #12345 requires your approval")
  - Details (Requestor, Outlet, Value)
  - Business Unit label (non-interactive)
  - Timestamp
  - Read/Unread indicator
- Empty state message when no notifications

**Data Fields**:

| Field | Type | Source | Format | Notes |
|-------|------|--------|--------|-------|
| Notification Type | Icon | Notification API | Visual | Indicates PR, return, etc. |
| Context | Text | Notification API | Text | What needs attention |
| Details | Text | Notification API | Text | Supplementary information |
| Business Unit | Label | Notification API | Text | Non-interactive |
| Timestamp | Date/Time | Notification API | Relative time | "2 hours ago" |
| Read Status | Visual | Notification API | Indicator | Bold/color for unread |

**States**:
- Default: Chronological list (newest first)
- All Read: No unread indicators
- Empty: "No new notifications"
- Loading: During data fetch
- Error: If notifications can't be loaded

**User Interactions**:
- Tapping notification navigates to relevant screen
- Swiping to dismiss/archive
- Tapping "Mark All as Read"
- Pull-to-refresh for updates

**Business Rules**:
- Notifications retain PR's BU context
