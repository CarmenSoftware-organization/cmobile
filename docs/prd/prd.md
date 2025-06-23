# Carmen Software Supply Chain Mobile App — Product Requirements & Page Flow

## Document Information
- **Version**: 2.1
- **Date**: January 2025 (Updated with Store Requisition UI/UX enhancements and Receiving/GRN calendar integration)
- **Product**: Carmen Software Supply Chain Mobile App
- **Target Industry**: Hotels and Hospitality
- **Document Type**: Product Requirements Document (Original)

## Introduction

Carmen Software's mobile supply chain application extends our web-based
hospitality finance and logistics tools into the field—empowering
property professionals to perform approvals, receiving, and audit
operations securely and efficiently from any device.

A core functional pillar is robust multi-tenant support, so that users
managing multiple hotels, properties, or business units can switch
context frictionlessly while all actions remain tightly scoped for
security and operational accuracy.

------------------------------------------------------------------------

## Key Feature Outline

1.  **Multi-Tenant (Business Unit) Context**

    - Secure login and unit selection.

    - Role-based permissions with all data and actions tied to active
      unit.

2.  **Receiving Module**

    - Receive inventory by Purchase Order (PO) or delivery location.

    - Permission-controlled quantity entry, tax adjustment (if
      authorized), and audit trail.

3.  **PR Approval Module**

    - Pending PR overview, context-rich approval, rejection (with
      reason), or return workflows.

    - Live on-hand/on-order data, vendor allocation (if role allows),
      and audit history.

4.  **Stock Take (Physical Count) Module**

    - Scheduled/full inventory counts in a unit; enter, attach evidence,
      handle variances/escalations.

    - No full inventory browsing/editing; focus on count submissions and
      audit accuracy.

5.  **Spot Check Module**

    - Quick, ad-hoc checks for any item; verify, explain variance,
      escalate if needed.

    - Force documentation if outside expectation and trackable history.

6.  **Profile & Settings**

    - Manage user info, password, active business unit, and logout.

7.  **Frictionless Field UX & Security**

    - No general inventory browsing or editing on mobile.

    - All actions are logged, restricted, and reviewed per unit, user,
      and role.

------------------------------------------------------------------------

# Module-by-Module Page Flow, Structure, and Content

------------------------------------------------------------------------

## 1. Multi-Tenant Access & Authorization

### 1.1 Login Page

- **Purpose:** Authenticate user.

- **Layout:** Carmen logo, title ("Sign In"), email and password fields,
  "Login" button, "Forgot Password?" link.

- **Content & Actions:** Real-time validation, error banners, progress
  spinner, proceed to unit selection.

### 1.2 Forgot Password

- **Purpose:** Request reset.

- **Layout:** Logo/title, email field, "Send Reset Link" button, "Back
  to Login".

- **Content:** Validate email, display confirmation or error, spinner on
  submit.

### 1.3 Reset Password

- **Purpose:** Set a new password (via reset link).

- **Layout:** Logo/title, "Reset Password", new and confirm password
  fields, policy hints, "Reset Password" button.

- **Content:** Enforce requirements, display errors or "Password
  changed" and return to login.

### 1.4 Business Unit Selection

- **Purpose:** Select active context for session.

- **Layout:** Title ("Select Business Unit"), vertical list/tiles
  showing each unit (name, site, logo), highlight on select, "Proceed"
  button, optional "Remember this unit".

- **Content:** Required to proceed, error if none chosen.

### 1.5 Logout

- **Purpose:** End session gracefully and securely.

- **Layout:** Modal "Are you sure you want to log out?", "Log Out" and
  "Cancel" buttons.

- **Content:** Confirm, clear tokens, route to login.

### 1.6 Session Expired / Access Denied

- **Session Expired:** "Session expired. Please login again.", "Login
  Again" action.

- **Access Denied:** "You do not have permission for this action.",
  "Back to Dashboard".

------------------------------------------------------------------------

## 2. Receiving Module

### 2.1 Receiving Dashboard

- **Purpose:** Field ops entrypoint for receiving.

- **Layout:** Header ("Receiving" + unit name), tabs ("By Purchase
  Order", "By Location").

- **Content:** Filter/search, list of POs (number, supplier, status,
  date), or outlet locations. Tap to view detail.

### 2.2 Purchase Order Details

- **Purpose:** Complete/continue receiving for a PO.

- **Layout:** Header (PO number, vendor, date), list of ordered items
  (name, ordered qty, unit, price; received-so-far tracking).

- **Content:** "Receive Goods" button to proceed.

### 2.3 Receiving Entry

- **Purpose:** Enter received quantities per item.

- **Layout:** Item rows (details, editable "Received" field),
  notes/comments box, "Submit" button at end.

- **Content:** Validation warns if over-receipt, permissions control tax
  or price changes, audit of changes.

### 2.4 Receiving Confirmation

- **Purpose:** Confirm/record submission.

- **Layout:** PO/items summary, qtys received, highlight discrepancies
  (in red), success/failure banner, "Back to Dashboard".

### 2.5 Receiving Edge Cases

- Already completed/locked: "This PO has already been fully received or
  is locked for editing." Return to dashboard.

- Error: "Unable to record receipt. Please try again."

------------------------------------------------------------------------

## 3. PR Approval Module

### 3.1 Approval Dashboard

- **Purpose:** See all PRs pending user intervention.

- **Layout:** Header ("Pending Approvals"), list of PRs (number,
  requester, supplier, date, value), sortable/filterable.

- **Content:** Tap to expand for full details.

### 3.2 Purchase Request Details

- **Purpose:** Review items, context, and decide action.

- **Layout:** Header (PR#, requester, supplier), expandable section for
  justification/audit, table of items (name, qty, price, on-hand,
  on-order).

- **Additional:** Vendor allocation selection (for buyers), line-level
  tax or price (permissioned), comments for requestor.

- **Actions:** "Approve" (highlighted), "Reject" (asks for reason,
  required), "Return" (for data correction, requires note).

### 3.3 Action & Notes Modal

- **Purpose:** Guarantee audit trail; reject/return requires input.

- **Layout:** Text prompt, notes field, error if blank, "Submit" and
  "Cancel".

- **Content:** On submit, action is processed and logged.

### 3.4 Approval Confirmation

- **Purpose:** Show action result.

- **Layout:** Header with outcome (e.g., "PR #123 Approved"), status
  next step, "Back to Approvals" (or do another).

### 3.5 PR Approval Edge Cases

- Already Acted: "This PR has already been finalized." Back to
  dashboard.

- Locked: "This PR is locked by another user." Back to dashboard.

- Error: "Unable to save approval decision. Retry or Back."

**\[Flow Recap\]**

1.  User lands on Approval Dashboard.

2.  Selects PR, reviews detail, audit, and context.

3.  Approves or must provide reason to reject/return (notes modal).

4.  Sees confirmation; all actions audit-logged and tied to unit.

5.  If state conflict or error, sees an instructive screen.

------------------------------------------------------------------------

## 4. Stock Take (Physical Count) Module

### 4.1 Stock Take Session List

- **Purpose:** Show all open or past sessions for a unit.

- **Layout:** Header ("Stock Take"), scrolling list (session name/date,
  assigned users, status), tap to continue.

- **Content:** Filter by status; expired or submitted sessions marked.

### 4.2 Stock Take Details

- **Purpose:** Conduct/continue a count.

- **Layout:** List/table of assigned items (name, SKU, system quantity),
  editable "Counted" field, variance shown after input, optional barcode
  scan/jump, notes/photo per line, "Save"/"Submit" at bottom.

- **Content:** Flags large variances, disables submit if required fields
  missing.

### 4.3 Stock Take Confirmation

- **Purpose:** Record and review submission.

- **Layout:** Summary (items counted, variances flagged), confirmation
  banner, "Back to Dashboard".

### 4.4 Edge/Error

- "Session locked or expired", "All items must be counted before
  submitting", error during save ("Please retry").

------------------------------------------------------------------------

## 5. Spot Check Module

### 5.1 Spot Check Initiation

- **Purpose:** Begin an ad-hoc check.

- **Layout:** Header ("Spot Check"), location selector, option to select 10, 20, or 50 items either randomly or manually, search bar or barcode input, "Start Spot Check" button.

- **Content:** User selects a location, then chooses to spot check 10, 20, or 50 items either randomly (system selects) or manually (user picks from list). Also supports searching or scanning for a specific item.

- **Persistence:** The selected list of items for spot check is persistent throughout the session. Users can navigate between item checks and return to the list until the spot check is completed. The session is cleared when the check is marked complete.

### 5.2 Spot Check Detail

- **Purpose:** Record count for one item/location.

- **Layout:** Item details (name, SKU, location, system qty), "Actual"
  input, reason for discrepancy (dropdown or note), attach photo/notes,
  "Submit" button.

- **Content:** Auto-prompts if variance exceeds threshold.

### 5.3 Spot Check Confirmation

- **Purpose:** Proof of audit/logging.

- **Layout:** "Spot Check Submitted", summary, confirmation, "Return"
  button.

### 5.4 Edge/Error

- "Session expired/locked", "Unable to save—retry", "You do not have
  permission".

------------------------------------------------------------------------

## 6. Profile & Settings

### 6.1 Profile Page

- **Purpose:** Account/role/unit info; settings.

- **Layout:** Header ("My Profile"), info fields (name, email, current
  unit, role), actions ("Switch Unit", "Change Password", "Log Out").

### 6.2 Switch Business Unit

- **Purpose:** Change operating context.

- **Layout:** Functions identically to initial business unit selection
  page.

------------------------------------------------------------------------

## Data Dictionary

*(To be prepared further. Should enumerate and describe all key data
objects and their fields, e.g., PR, PO, Stock Take Session, Spot Check,
all referenced with business unit ID.)*

------------------------------------------------------------------------

## Appendix: Authentication & Authorization Page States

<table style="min-width: 75px">
<tbody>
<tr class="header">
<th><p>Page</p></th>
<th><p>Purpose</p></th>
<th><p>Main Actions</p></th>
</tr>
&#10;<tr class="odd">
<td><p>Login</p></td>
<td><p>Authenticate &amp; start session</p></td>
<td><p>Enter creds, login, forgot password</p></td>
</tr>
<tr class="even">
<td><p>Forgot Password</p></td>
<td><p>Request password reset</p></td>
<td><p>Enter email, receive reset link</p></td>
</tr>
<tr class="odd">
<td><p>Reset Password</p></td>
<td><p>Set new password</p></td>
<td><p>Enter and confirm, enforce policy</p></td>
</tr>
<tr class="even">
<td><p>Business Unit Select</p></td>
<td><p>Choose session context</p></td>
<td><p>Select from list, remember choice</p></td>
</tr>
<tr class="odd">
<td><p>Logout</p></td>
<td><p>End session</p></td>
<td><p>Confirm logout, clear context</p></td>
</tr>
<tr class="even">
<td><p>Session Expired</p></td>
<td><p>Notify &amp; prompt re-auth</p></td>
<td><p>Relogin prompt, context warning</p></td>
</tr>
<tr class="odd">
<td><p>Access Denied</p></td>
<td><p>Block unauthorized access</p></td>
<td><p>Alert and send back to Dashboard</p></td>
</tr>
</tbody>
</table>

------------------------------------------------------------------------

**End of Document**
