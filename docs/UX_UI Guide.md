# Carmen Software Supply Chain Mobile App
# UX/UI Guide

## Document Information
- **Version**: 2.1
- **Date**: January 2025 (Updated with Store Requisition UI/UX enhancements and Receiving/GRN calendar integration)
- **Product**: Carmen Software Supply Chain Mobile App
- **Target Industry**: Hotels and Hospitality
- **Document Type**: UX/UI Design Guide

UX/UI Guide:

---

**Page 1: Global Elements & Guiding Principles (UX/UI Guide)**

**1\. Intro & Philosophy:** Mobile-first design: optimize for touch, scanability, single-hand use, performance, context. Core UX: Clarity, Efficiency, Consistency (Material/ShadCN/Bootstrap), Compliance, Empowerment.

**2\. Key Global UI Patterns:**

* **Business Unit (BU) Display:**  
  * **RULE:** ALWAYS read-only, non-interactive label. NO BU selection anywhere.  
  * Visible on: Transaction lists/cards, detail headers. Lists aggregate user's BUs.  
* **SKU-First Display:**  
  * **RULE:** SKU/Product Code ALWAYS before Product Name in tables/lists/forms.  
* **Tax & Discount Info:**  
  * **RULE:** Read-only on mobile. NO mobile override. Desktop only for edits.  
  * Clear labels (e.g., "Tax: VAT (Added, 7%)").  
* **On Hand / On Order Buttons & Overlays:**  
  * **ONLY IN:** PR Approval (Details), Stock Take (Entry), Spot Check (Entry).  
  * **NOT IN:** Receiving, PO, GRN modules.  
  * Interaction: Labeled buttons `[On Hand]`, `[On Order]` per item line. Tap opens read-only, mobile-optimized overlay (modal/sheet) with item's BU label. Easy dismiss. Audit logged. No mobile data edits via overlays.  
* **Navigation:** Tab bar or hamburger menu. Module entry via filtered lists. Deep links from notifications.  
* **Error Handling:** Proactive validation. Clear, actionable, contextual messages. Graceful system error handling.  
* **Inputs & CTAs:** Logical field order. Mobile-optimized controls. Large touch targets. Clear primary/secondary actions. Confirm critical actions.  
* **Progress Indicators:** Visual feedback for multi-step tasks (e.g., "8 of 20 items").  
* **Audit:** UI reinforces tracking (e.g., "Created By" fields).

**3\. Branding & Accessibility:** Align with Carmen Siftware branding. Professional, clean. WCAG AA: Contrast, text scaling, touch targets, ARIA, clear language.

---

**Page 2: Authentication & Session Management (UX/UI Guide)**

**2.1. Login Screen**

* **Layout:** Centered, clean. Prominent app logo at the top.  
* **Fields (Email/Password Primary):**  
  * "Email Address" label; Input field with placeholder "[you@company.com](mailto:you@company.com)".  
  * "Password" label; Password input field (masked) with optional show/hide icon.  
* **Primary CTA:** "Login" or "Sign In" button (solid brand color, full-width or prominent).  
* **SSO Option (if configured):** "Sign In with SSO" or "Login with \[IdP Name\]" button (secondary style, e.g., outline), below primary login.  
* **Token Login (if configured for re-auth/specific flows):** May be a separate simple screen with "Enter Access Token" label, large text area, and "Verify Token" button.  
* **Support Link:** "Forgot Password?" (subtle link style) below CTAs, leading to web-based recovery or defined flow.  
* **Footer:** Optional build version/copyright text.

**2.2. Error Messaging & States**

* **Display:** Non-modal where possible (inline with fields, or a banner above CTAs). Red text/borders for emphasis.  
* **Messages:**  
  * "Invalid email or password. Please try again."  
  * "Your account has been locked due to multiple failed login attempts. Please contact support."  
  * "Your session has expired. Please log in again." (Often a modal dialog preceding redirect to Login).  
  * "Unable to connect. Please check your internet connection." (Toast or banner).  
* **Loading State:** Spinner on Login button or global overlay during authentication.

**2.3. Session Context & Audit**

* **System Behavior:** User's authorized BUs are automatically applied post-login; no BU selection occurs. Data visibility is filtered by these BUs.  
* **Audit:** All login attempts (success/fail), logout, and session expiry events are logged (user, time, method, outcome). The UI does not display this log directly to the end-user on these screens, but the system design supports it.  
* **Re-authentication:** Forced redirect to Login screen on session expiry. Username might be pre-filled.

---

**Page 3: Dashboard / Home Page (UX/UI Guide)**

**3.1. Overall Layout & Purpose**

* The Dashboard serves as the primary landing screen post-login, offering quick access to key modules and timely information.  
* It should provide an at-a-glance overview relevant to the user's role and permissions.

**3.2. Header Area**

* **App Title/Logo:** Consistent branding.  
* **Notification Icon:** A "bell" icon, typically in the top-right, indicating new/unread notifications with a badge count. Tapping opens the Notification List (See Page 16).

**3.3. Main Content Area (Dynamic & Role-Based)**

* **Structure:** Likely a scrollable view composed of sections or cards.  
* **Potential Sections (Examples, tailor to FRD/PRD emphasis):**  
  * **"Quick Actions":** Buttons or large tap targets for frequently used functions (e.g., "Start Spot Check," "View Pending PRs," "Receive Delivery").  
  * **"Today's Deliveries" (for Receiving Clerks):** A summary list/card view of expected or recent deliveries. Each item would show PO\#, Vendor, Status, and its **BU Label**. Tapping an item navigates to the relevant PO or GRN.  
  * **"Pending Approvals" (for PR Approvers):** A summary list/card view of PRs awaiting the user's action. Each PR would show PR\#, Requestor, Value, and its **BU Label**. Tapping navigates to the PR detail.  
  * **"In-Progress Tasks":** Summary of ongoing Stock Takes or Spot Checks the user can resume.  
* **BU Display:** All list items or summary cards representing transactions must clearly display their associated **Business Unit (BU) as a non-interactive label.**  
* **No BU Selection:** The Dashboard aggregates information from all authorized BUs. There is no BU selector present.

**3.4. Navigation**

* **Primary Navigation:** A persistent bottom tab bar is common for mobile apps, offering quick access to:  
  * Dashboard (Home)  
  * Receiving  
  * PR Approval  
  * Stock Take  
  * Spot Check  
  * Profile/Settings (may be under a "More" tab if space is limited)  
* Alternatively, a hamburger menu could house these main navigation links if a tab bar is not suitable or if there are many top-level modules.

---

**GRN State Workflow & UI Rules**

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

**UI Implications:**
- Status badge and available actions update according to current state.
- Only Draft and Received GRNs can be edited or voided.
- Committed GRNs are locked and view-only.
- Voided GRNs are view-only and marked as cancelled.

---

**Page 4: Receiving Module: GRN List / Receiving History (UX/UI Guide)**

**4.1. Screen Purpose**

* To display a comprehensive list of all past and in-progress Goods Receipt Notes (GRNs) associated with every Business Unit the user is authorized for.

**4.2. List View**

* **Format:** Card-based for mobile scanability and touch interaction. Each GRN is a distinct card.  
* **Card Content (per GRN):**  
  * **GRN Reference/Number:** Prominent, bold.  
  * **Status Badge:** (e.g., "Draft," "Committed," "Void"). Color-coded for quick identification (e.g., Blue for Draft, Green for Committed, Red for Void).  
  * **Vendor Name.**  
  * **Received Date.**  
  * **Total Value.**  
  * **Linked PO(s)/Order Numbers:** List or summarized.  
  * **Created By:** (For audit context).  
  * **Business Unit (BU) Label:** Clearly displayed, non-interactive.  
  * **Icons/Indicators (Optional but recommended):**  
    * Attachment present (e.g., paperclip icon).  
    * Comments present (e.g., speech bubble icon).  
    * Alert if incomplete (e.g., warning icon, if applicable to Draft status).  
* **Sorting:** Default sort by Received Date (newest first). Options to sort by GRN\#, Status, Vendor.  
* **"Create New GRN" / "Receive PO" Button:** A Floating Action Button (FAB) or a prominent button in the header/footer to initiate a new receiving process.

**4.3. Search & Filter Functionality**

* **Search Bar:** Prominently placed (e.g., at the top of the list). Allows search by:  
  * GRN number  
  * Vendor name  
  * PO number  
* **Filter Options (Accessible via a filter icon/button):**  
  * **Date Range:** (Received Date).  
  * **Status:** (Draft, Committed, Void \- multi-select checkboxes/chips).  
  * **Business Unit (Optional Convenience Filter):**  
    * This is a *convenience filter only* within the filter panel (e.g., chip group or dropdown).  
    * It **never** changes the overall workflow context or acts as a primary BU selector for the app.  
    * The list still fundamentally shows aggregated data if no BU filter is applied.  
* Applied filters should be clearly indicated (e.g., "Filters Applied" chip, highlighted filter icon).

**4.4. Card Actions & Navigation**

* **Tap Action:** Tapping anywhere on a GRN card navigates to the GRN Detail View (Page 5).  
* **Action Buttons (on card, context-dependent):**  
  * **View:** Always present (could be the tap action itself).  
  * **Resume:** If GRN status is "Draft."  
  * **Print/Export:** If GRN status is "Committed" (this might open a share sheet or trigger a backend process; actual printing is device-dependent). This is optional as per FRD.

**4.5. Role & Permissions**

* Only users with receiving/GRN rights can see this list, create, or edit GRNs. Access to specific GRNs is further controlled by BU authorization.

**4.6. Empty State**

* If no GRNs match the criteria or if the user has no GRNs, display a clear message (e.g., "No Goods Receipt Notes found." or "Start by receiving a Purchase Order.").

---

**Page 5: Receiving Module: GRN Detail View (UX/UI Guide)**

**5.1. Screen Purpose**

* To display all details of a specific Goods Receipt Note (GRN) for review, continuation (if draft), or print/export (if committed). Accessed by tapping a GRN card from the GRN List.

**5.2. Header Section**

* **Navigation:** "Back" button to return to GRN List.  
* **Title:** "GRN Details" or the GRN Reference/Number itself.  
* **Key GRN Information (Clearly displayed, read-only):**  
  * GRN Reference/Number  
  * Status Badge (color-coded, e.g., "Draft," "Committed," "Void")  
  * Vendor Name  
  * Received Date  
  * Total Value  
  * Linked PO(s)/Order Numbers (may be tappable if linking to PO details is in scope)  
  * Created By  
  * **Business Unit (BU) Label:** Prominent, non-interactive.

**5.3. Main Content Area (Scrollable)**

* **Sections:** Organized for clarity, potentially using cards or dividers.  
  * **Line Items:**  
    * A table or list of received items.  
    * **Columns (SKU-first):** SKU, Product Name, Received Quantity, Unit of Measure, Unit Price, Line Total.  
    * Tax details per line (read-only, as calculated/pre-set).  
    * Discount details per line (read-only).  
  * **Summary Totals:**  
    * Subtotal  
    * Total Tax (read-only, broken down by type if applicable)  
    * Total Discount (read-only)  
    * **Grand Total**  
  * **Transaction Analytics Dimensions (if applicable):**  
    * Display configured header-level dimensions (e.g., Market Segment, Department) as read-only fields if they were captured.  
  * **Attachments:**  
    * List of attached files (images, documents).  
    * Display thumbnail for images, icon for documents.  
    * Option to tap to view attachment (opens in appropriate viewer).  
  * **Comments/Notes:**  
    * Display any general notes or comments associated with the GRN.  
  * **Receiver Signature (if captured):**  
    * Display an image of the signature if available.

**5.4. Action Bar / Footer Buttons (Context-dependent based on GRN status and user permissions)**

* **If Status is "Draft":**  
  * "Edit GRN" button (navigates to GRN Editing screen \- Page 6).  
  * "Submit GRN" button (if all requirements met for submission).  
  * "Void GRN" button (with confirmation).  
* **If Status is "Committed":**  
  * "Print/Export GRN" button (optional, as per FRD).  
  * "Void GRN" button (if voiding committed GRNs is allowed, with strict confirmation and reason).  
* **If Status is "Void":**  
  * Generally no actions, view-only.

**5.5. Global UI Rules Adherence**

* **SKU-First:** Ensured in the line items list.  
* **Tax/Discount Read-Only:** All tax and discount fields are non-editable.  
* **BU Label:** Prominently displayed in the header.  
* **No On Hand/On Order Buttons:** These are not present in any Receiving module screens.

---

**Page 6: Receiving Module: PO Receipt / GRN Creation & Editing (UX/UI Guide)**

**6.1. Screen Purpose**

* To allow users to record the receipt of goods against one or more Purchase Orders (POs), or to create/edit a Goods Receipt Note (GRN) directly (if manual GRN creation is supported without a PO). This screen is for data entry.

**6.2. Header Section**

* **Navigation:** "Back" button (with "Changes will be lost" confirmation if data entered), "Save Draft" button.  
* **Title:** "Receive PO: \[PO Number\]" or "New GRN" or "Edit GRN: \[GRN Number\]".  
* **Key PO/GRN Info (Contextual):**  
  * If receiving against PO: PO\#, Vendor, Expected Delivery Date, **Business Unit (BU) Label** (non-editable).  
  * If new/editing GRN: Vendor (selectable/editable), Received Date (editable), **Business Unit (BU) Label** (non-editable, derived from PO or initial selection if manual GRN creation allows BU choice, which is generally not the case as per "no BU selector" rule – BU is usually inherited).

**6.3. GRN Header Fields (Editable where appropriate)**

* **Vendor:** (May be pre-filled from PO, or searchable select list if manual GRN).  
* **Received Date:** Date picker, defaults to today.  
* **Invoice Number (Optional):** Text input.  
* **Delivery Note Number (Optional):** Text input.  
* **Transaction Analytics Dimensions (Header Level):**  
  * Display configured fields (e.g., Market Segment, Department).  
  * Required/optional based on config.  
  * Use picklists or searchable inputs.

**6.4. Line Items Section (Data Entry)**

* **Adding Items:**  
  * If from PO: PO lines are pre-populated.  
  * If manual GRN: "Add Item" button to search/select items from master.  
* **GRN Item Entry Card (Main Screen)**

  - Each item is displayed as a single-row card showing only the most essential fields for fast mobile data entry:
    - **SKU**
    - **Product Name**
    - **Ordered Quantity**
    - **Received Quantity** (editable)
    - **Remaining** (Ordered - Received)
    - **Unit** (dropdown, always interactive)
    - **Status** (badge)
    - **Detail** button (ChevronRight icon)
    - **Delete** icon

  - **Secondary information** (such as PO reference, PO date, inventory unit, etc.) is **not shown on the main card**.  
  - To view or edit secondary info, tap the **Detail** button to open the item detail page, where all additional fields are displayed.

  - This design reduces clutter and optimizes for mobile data entry speed and clarity.

**6.5. Attachments Section (GRN Header Level)**

* Button to "Add Attachment" (image/document) for the overall GRN.  
* List of existing header-level attachments with option to remove.

**6.6. Summary & Confirmation**

* **Totals Area:** Auto-calculated Subtotal, Total Tax (read-only), Total Discount (read-only), Grand Total.  
* **Receiver Signature:** Area/button to capture signature (opens a signature pad modal). Signature displayed once captured.  
* **Notes/Comments:** Multi-line text input for general notes.

**6.7. Footer Action Buttons**

* **"Save Draft":** Saves current progress without final submission.  
* **"Submit GRN" / "Commit":** Validates all required fields. Blocks if data missing or out of tolerance. Prompts confirmation.

**6.8. Global UI Rules Adherence**

* **SKU-First, Tax/Discount Read-Only, BU Label.**  
* **No On Hand/On Order Buttons.**

---

**Page 7: Receiving Module: Batch Receiving (UX/UI Guide)**

**7.1. Screen Purpose**

* To enable users to select multiple Purchase Orders (POs) from the same vendor and with matching currency to process them together in a streamlined receiving session. Each PO will still result in its own distinct Goods Receipt Note (GRN).

**7.2. PO Selection Screen**

* **Header:** Title "Batch Receiving \- Select POs". "Back" navigation.  
* **Filters (to find eligible POs):**  
  * **Vendor:** Searchable dropdown/list (selecting a vendor filters POs).  
  * **Currency:** (May be auto-applied based on vendor or system config, or a filter if vendor has multiple).  
  * **Business Unit (BU) Label:** POs listed will display their BU label. The selection itself is not BU-driven but vendor/currency driven.  
* **PO List:**  
  * Displays POs matching filter criteria (vendor, currency).  
  * Each PO item shows: Checkbox for selection, PO\#, Expected Date, PO Value, **BU Label**.  
  * Information to help user identify correct POs.  
* **Actions:**  
  * "Select All" / "Deselect All" checkboxes.  
  * "Proceed to Receive (\[N\] POs)" button: Enabled when at least one PO is selected.

**7.3. Receiving Process (Post PO Selection)**

* **Workflow:** The app guides the user through receiving each selected PO one by one.  
* **UI Per PO:** For each PO in the batch, the user is presented with the standard "PO Receipt / GRN Creation" screen (as detailed on Page 6).  
  * PO details and lines are pre-filled.  
  * User enters received quantities, attachments, signature for *that specific PO*.  
  * User submits/commits the GRN for *that specific PO*.  
* **Navigation between POs in Batch:**  
  * Clear indication of progress (e.g., "Receiving PO 2 of 3: PO\#XYZ").  
  * "Next PO" or "Save & Continue to Next PO" button after submitting/saving a GRN.  
  * Option to "Skip PO" (if a PO in the batch cannot be received at this time, with reason).  
* **Completion:** Once all selected POs are processed, a summary screen may show the list of GRNs created.

**7.4. Audit & Separation**

* **Key Principle:** Although processed in a batch UI flow for user convenience, each PO results in a separate, fully auditable GRN. There is no co-mingling of GRN data.  
* Each GRN retains its original PO's BU context.

**7.5. Global UI Rules Adherence**

* **SKU-First, Tax/Discount Read-Only, BU Label (on POs and resulting GRNs).**  
* **No On Hand/On Order Buttons.**

---

**Page 8: PR Approval Module: PR List View (UX/UI Guide)**

**8.1. Screen Purpose**

* To display a list of Purchase Requisitions (PRs) that require the logged-in user's attention for approval, rejection, or other actions, based on their role and permissions across all their authorized Business Units.

**8.2. List View**

* **Aggregated List:** Shows PRs from all Business Units (BUs) to which the user has access.  
* **No BU Selector:** The user never selects or switches BU in this workflow.  
* **Card/List Item Format (per PR):**  
  * **PR Number/ID:** Prominent.  
  * **Status:** (e.g., "Pending Approval," "Pending Your Approval," "Returned," "Overdue"). Color-coded badges.  
  * **Requestor Name.**  
  * **Outlet/Department.**  
  * **Submission Date/Time.**  
  * **Total PR Value.**  
  * **Business Unit (BU) Label:** Clearly displayed, non-interactive, for context on each PR.  
  * **User's Role (Optional):** May display the user's role relevant to this PR's approval step in that specific BU (e.g., "HOD Approval").  
* **Sorting:** Default sort by urgency/submission date. Options to sort by PR\#, Status, Value.

**8.3. Search & Filter Functionality**

* **Search Bar:** Search by PR Number, Requestor, Outlet/Department.  
* **Filter Options (Accessible via a filter icon/button):**  
  * **Status:** (e.g., "Pending My Approval," "Overdue," "Returned to Me" \- multi-select).  
  * **Role:** (If user holds multiple approval roles, filter by PRs assigned to a specific role).  
  * **Date Range:** (Submission Date).  
  * **Business Unit (Optional Convenience Filter):**  
    * A convenience filter only, within the filter panel (e.g., chip group or dropdown).  
    * Does **not** change the primary aggregated view or act as a BU selector.  
* Applied filters clearly indicated.

**8.4. Navigation & Actions**

* **Tap Action:** Tapping any PR card/item navigates to the PR Detail View (Page 9\) for that specific PR.  
* **Quick Actions (Optional, e.g., swipe actions on list items if suitable for common scenarios):**  
  * Potentially "Approve" or "Reject" for simple, single-line PRs if the full detail view isn't always necessary (use with caution, ensure sufficient info is visible on the card).

**8.5. Empty State**

* If no PRs require user action or match filter criteria: "No Purchase Requisitions found requiring your attention."

**8.6. Workflow Clarification Adherence (from FRD):**

* The UI must strictly enforce that the user never selects or changes Business Unit during PR approval. The BU is always a contextual label. Notifications link directly to the PR, pre-set with its BU context.

---

**Page 9: PR Approval Module: PR Detail View (incl. On Hand/On Order) (UX/UI Guide)**

**9.1. Screen Purpose**

* To display the full details of a specific Purchase Requisition (PR), allowing the user to review line items, check stock information, and take action (Approve, Reject, Send Back).

**9.2. Header Section**

* **Navigation:** "Back" button to PR List.  
* **Title:** "PR Details: \[PR Number\]" or similar.  
* **Key PR Information (Clearly displayed, read-only):**  
  * PR Number/ID  
  * Status Badge (color-coded)  
  * Requestor Name  
  * Outlet/Department  
  * Submission Date/Time  
  * Total PR Value  
  * **Business Unit (BU) Label:** Prominent, non-interactive, for context.

**9.3. Main Content Area (Scrollable)**

* **Sections:** Organized for clarity.  
  * **General Information:** Requestor, Department, Justification (if provided), any header-level attachments.  
  * **Line Items:**  
    * A table or list of requested items.  
    * **Columns (SKU-first):** SKU, Product Name, Requested Qty/Unit, Unit Price, Total Line Value.  
    * **Tax Information:** Display Tax Type, Tax Rate (read-only, as per system calculation/master data).  
    * **Last Price Paid (if available):** For comparison.  
    * **Inventory Info (if available):** On-Hand Qty, On-Order Qty (as static fields if not using buttons).  
    * **Approved Quantity:** Editable field (defaults to Requested Qty). Changes here are audit-logged.  
    * **On Hand / On Order Buttons:**  
      * **Presence:** `[On Hand]` and `[On Order]` buttons are clearly visible and tappable for **each item line**.  
      * **Interaction:** Tapping `[On Hand]` opens a read-only overlay/modal displaying: Location, Qty Available, Min, Max, Last Counted/Stocked, and the item's **BU Label**.  
      * Tapping `[On Order]` opens a read-only overlay/modal displaying: PO Number, Vendor, Ordered Qty, Status, Due Date, and the item's **BU Label**.  
      * Overlays are mobile-optimized, easily dismissible, and show current data. Access is audit-logged.  
    * **Comments/Attachments (Per Line):** View any line-specific comments or attachments.  
  * **Summary Totals:**  
    * Subtotal (based on Approved Quantities)  
    * Total Tax (read-only, dynamically updates if approved quantities change affecting taxable amount)  
    * **Grand Total** (dynamically updates)  
  * **Approval History/Workflow Trail (Optional but good for transparency):** A section showing previous steps, approvers, and comments.

**9.4. Action Bar / Footer Buttons (Context-dependent based on PR status and user permissions)**

* **"Approve" Button:** Primary action.  
* **"Reject" Button:** Secondary action. Requires a mandatory reason input (modal dialog or expandable text field).  
* **"Send Back" Button:** Allows returning the PR to a previous step in the workflow (e.g., to requestor for clarification). User may need to select the step to send back to from a list. Triggers an alert to the recipient. Requires a mandatory reason.  
* **"Change Approved Qty / Review":** If user modifies any "Approved Quantity" fields, this button might appear or other primary action buttons get an indication that quantities have changed.  
* All actions (Approve, Reject, Send Back, Qty Change) are audit-logged with user, time, and pre/post values.

**9.5. Global UI Rules Adherence**

* **SKU-First, Tax/Discount Read-Only, BU Label.**  
* **On Hand/On Order Buttons:** Present and functional as specified.  
* **No BU Selector:** The PR's BU context is fixed and displayed as a label.

---

**Page 10: Stock Take Module: Option Selection & Entry Screens (UPDATED)**

**10.0. Option Selection Screen**
* When user selects Stock Take from the dashboard or bottom nav, they are presented with an option screen to choose between Physical Count and Spot Check.
* Two large cards/buttons: Physical Count and Spot Check, each with icon and description.
* Tapping Physical Count navigates to the Physical Count entry screen. Tapping Spot Check navigates to the Spot Check entry screen.

**10.1. Physical Count Entry Screen**
* Header: "Physical Count"
* Location selection: dropdown of authorized locations, each with BU label and location type (Count, System Default, Direct)
* Start button enabled when a location is selected
* Data fields: Location, Location Type, Period, Period End Date
* Business rules: Only authorized locations shown, location type determines count requirements

**10.2. Spot Check Entry Screen**
* Header: "Spot Check"
* Location selection: dropdown of authorized locations, each with BU label
* Item selection method: radio buttons (Random, High Value, Manual)
* Number of items: radio buttons (10, 20, 50)
* Start button enabled when all required fields are selected
* Data fields: Location, Selection Method, Number of Items, Price Filter (if High Value)
* Business rules: Only authorized locations shown, item list locked after start, all items must be checked before submission

**10.3. Session List View**

* **Aggregated List:** Shows stock take sessions from all relevant locations within the user's authorized BUs.  
* **Card/List Item Format (per Stock Take Session):**  
  * **Session ID/Name:** (e.g., "Main Store \- Oct 2023" or system ID).  
  * **Store Location Name.**  
  * **Status:** (e.g., "Open," "In Progress," "Review," "Submitted," "Completed"). Color-coded badges.  
  * **Date Created/Started.**  
  * **Items Counted / Total Items:** (e.g., "150 / 200 Items"). Progress bar visual.  
  * **Business Unit (BU) Label:** Clearly displayed, non-interactive, for the BU associated with the store location.  
* **Sorting:** Default sort by status (In Progress first), then date. Options for other sorts.

**10.4. Search & Filter Functionality**

* **Search Bar:** Search by Session ID/Name, Store Location.  
* **Filter Options (Accessible via a filter icon/button):**  
  * **Status:** (Multi-select for Open, In Progress, Review, Submitted, etc.).  
  * **Date Range:** (Session creation/start date).  
  * **Store Location:** (If user has access to many, allow filtering by specific locations).  
  * **Business Unit (Optional Convenience Filter):** As per other list views, a convenience filter only.  
* Applied filters clearly indicated.

**10.5. Actions**

* **"Start New Stock Take Session" Button:** Prominent FAB or header button. This would lead to a setup screen (e.g., select location, session type if applicable).  
* **Tap Action on List Item:**  
  * If "Open" or "In Progress": Navigates to Stock Count Entry screen (Page 11\) for that session.  
  * If "Review," "Submitted," or "Completed": Navigates to a read-only view of the session details and results.

**10.6. Empty State**

* If no stock take sessions exist or match filters: "No Stock Take sessions found."

---

**Page 11: Stock Take Module: Stock Count Entry (incl. On Hand/On Order) (UX/UI Guide)**

**11.1. Screen Purpose**

* To allow users to enter actual physical counts for inventory items within an active stock take session. This is the primary data entry screen for stock takes.

**11.2. Header Section**

* **Navigation:** "Back" button (to Session List, with "Save Draft?" prompt if changes made).  
* **Title:** "Stock Take: \[Session Name/ID\]" or "\[Store Location\] \- Stock Count".  
* **Session Info:** Display current progress (e.g., "150 / 200 Items Counted" or a progress bar).  
* **Actions:** "Save Draft" button, "Submit Session" button (enabled when conditions met).

**11.3. Item List for Counting (Scrollable)**

* **Layout:** List of inventory items assigned to the stock take session for the selected location.  
* **Item Line Display/Entry Fields (per item, SKU-first):**  
  * **SKU / Product Code:** Prominent.  
  * **Product Name.**  
  * **System Quantity (SOH \- Stock on Hand):** Displayed if user is permissioned to see it. Read-only.  
  * **Actual Count:** **Primary input field.** Numeric keypad preferred.  
  * **Unit of Measure (UOM):**  
    * Allow selection between Recipe unit or Base unit (if applicable for the item).  
    * Conversion factor clearly shown if different UOMs involved.  
  * **Variance:** Calculated automatically (Actual Count \- System Quantity). Visually highlighted if significant or outside tolerance (e.g., color-coding).  
  * **On Hand / On Order Buttons:**  
    * **Presence:** `[On Hand]` and `[On Order]` buttons are clearly visible and tappable for **each item line**.  
    * **Interaction:** (Same as PR Approval \- Page 9\) Tapping opens read-only, mobile-optimized overlays with relevant stock details and the item's **BU Label**. Access is audit-logged.  
  * **Notes/Comments (Per Line):** Icon/button to add text notes for discrepancies or observations specific to this item.  
  * **Photo Attachment (Per Line):** Icon/button to attach a photo (e.g., for damaged goods, count verification).  
* **Search/Filter within Item List:**  
  * Search by SKU, Product Name, Vendor Product QR Code/Barcode (if scanner input supported).  
  * Filter by "Not Counted," "Counted," "Flagged Variances."

**11.4. Features**

* **Partial Save & Resume:** The "Save Draft" button allows users to save progress and return later. Session state is preserved.  
* **Progress Visibility:** Clear indication of how many items are counted versus total.  
* **Barcode/QR Code Scanning:** If supported, an icon/button to activate device camera for scanning product barcodes to quickly find and focus on an item in the list.

**11.5. Footer Action Buttons**

* **"Save Draft":** Always available during counting.  
* **"Proceed to Review / Submit":** Enabled when all required items are counted or as per workflow rules. Navigates to the Submission & Review screen (Page 12).

**11.6. Global UI Rules Adherence**

* **SKU-First, BU Label (on overlays).**  
* **On Hand/On Order Buttons:** Present and functional.

---

**Page 12: Stock Take Module: Submission & Review (UX/UI Guide)**

**12.1. Screen Purpose**

* To allow users to review a summary of the stock take session, especially any flagged variances, before final submission. This screen acts as a final checkpoint.

**12.2. Header Section**

* **Navigation:** "Back" button (to Stock Count Entry screen \- Page 11, allowing further edits if not yet submitted).  
* **Title:** "Review Stock Take: \[Session Name/ID\]".

**12.3. Summary Information**

* **Overall Stats:**  
  * Total Items in Session.  
  * Total Items Counted.  
  * Number of Items with Variances.  
  * Total Variance Value (if calculated).  
* **Session Details:** Store Location, Date, Counted By.

**12.4. Flagged Variances List**

* **Focus:** This section prominently lists items where the counted quantity differs significantly from the system quantity (based on pre-defined thresholds or rules).  
* **Item Display in Variance List (SKU-first):**  
  * SKU, Product Name.  
  * System Quantity.  
  * Actual Count.  
  * Variance Amount/Percentage (clearly highlighted, e.g., red for shortages, green/blue for overages).  
  * Any notes or photos attached to the line during count entry.  
* **User Action for Variances:**  
  * May require users to acknowledge or provide a reason for significant variances before submission (e.g., a mandatory comment field per flagged item, or a general comment for the overall variances). This depends on specific business rules.  
  * Option to tap a flagged item to quickly navigate back to its entry line on Page 11 for re-counting or editing notes, if the workflow permits edits at this stage.

**12.5. Submission Action**

* **"Submit Stock Take" Button:**  
  * **Enabled:** Only if all required items have been counted and any mandatory review steps (like addressing flagged variances) are completed.  
  * **Confirmation:** Tapping this button should trigger a confirmation modal (e.g., "Are you sure you want to submit this stock take? This action cannot be undone.").  
* **Post-Submission:**  
  * The app should display a success message.  
  * The session status updates to "Submitted" or "Completed."  
  * The user is typically navigated back to the Stock Take Session List (Page 10), which now reflects the updated status.

**12.6. Audit Trail Note**

* The act of submission, along with all count data, variance details, user, and timestamps, is critically important for the audit trail.

---

**Page 13: Spot Check Module: Initiation (UX/UI Guide)**

**13.1. Screen Purpose**

* To allow authorized users (typically Cost Controllers) to initiate a new spot check session by defining the scope: location and item selection method.

**13.2. Header Section**

* **Navigation:** "Back" button (to Dashboard or previous screen).  
* **Title:** "Initiate Spot Check" or "New Spot Check".

**13.3. Spot Check Setup Form**

* **Step 1: Select Location (Outlet or Store)**  
  * **Label:** "Select Location".  
  * **Input:** A searchable dropdown or list of all outlets/stores the user is authorized to spot check.  
  * **BU Context:** Each location in the list should display its associated **Business Unit (BU) Label** for clarity, though the BU itself is not selectable.  
* **Step 2: Choose Item Selection Method**  
  * **Label:** "Item Selection Method".  
  * **Input:** Radio buttons or a segmented control for the following options:  
    * **Random:**  
      * If selected, an additional input appears: "Number of Items to Check".  
      * Options for N: Radio buttons or dropdown for 10, 20, or 50 items (as per FRD). System will randomly select these from the chosen location's inventory.  
    * **High Value Item:**  
      * If selected, an additional input appears: "Select Price Filter" or similar (e.g., "Items over $X value," "Top X% by value"). This allows focusing on high-cost items. (FRD mentions "mini price filter" \- requires clarification on how this filter is defined).  
    * **Manual:**  
      * If selected, an additional input appears: "Number of Items to Select".  
      * Options for N: Radio buttons or dropdown for 10, 20, or 50 items. User will manually select items from a list in the next step (or on the conduct screen itself before locking).  
* **Step 3 (Conditional \- for Manual Selection if items are chosen *before* locking):**  
  * If "Manual" is chosen, a mechanism to select items might be presented here (e.g., a button "Select Items" leading to a searchable item list with checkboxes) OR this step is integrated into the "Conduct Spot Check" screen before the list is locked. The FRD implies "Once set, the item list is locked for the session," suggesting selection happens before the main counting phase.

**13.4. Action Button**

* **"Start Spot Check" / "Generate Item List" Button:**  
  * Enabled once all required fields (Location, Method, Number of Items if applicable) are filled.  
  * Tapping this button finalizes the setup, generates/locks the item list for the session, and navigates the user to the "Conduct Spot Check" screen (Page 14).

**13.5. Information/Guidance**

* Brief text explaining that once the spot check is started, the item list cannot be changed for that session to ensure compliance.

---

**Page 14: Spot Check Module: Conduct Spot Check (incl. On Hand/On Order) (UX/UI Guide)**

**14.1. Screen Purpose**

* To guide the user through checking each item in the locked list generated during initiation, enter actual counts, and add comments/photos.

**14.2. Header Section**

* **Navigation:** "Back" button (should save progress and return to a list of "In-Progress Spot Checks" or Dashboard; confirm "Save progress?" if appropriate).  
* **Title:** "Spot Check: \[Location Name\]" or "Spot Check Session \[ID\]".  
* **Progress Indicator:** Clearly visible (e.g., "8 of 20 items checked" text and/or a visual progress bar).  
* **Actions:** "Save Progress" (or auto-save), "Submit Spot Check" (enabled only when all items checked).

**14.3. Locked Item List for Checking (Scrollable)**

* **Display:** The list of items (randomly generated or manually selected during initiation) is displayed. This list **cannot be modified** during this phase.  
* **Item Line Display/Entry Fields (per item, SKU-first):**  
  * **SKU / Product Code:** Prominent.  
  * **Product Name.**  
  * **System Quantity (SOH):** Displayed (read-only). Crucial for comparison.  
  * **Actual Count:** **Primary input field.** Numeric keypad preferred.  
  * **Variance:** Calculated automatically (Actual Count \- System Quantity). Visually highlighted.  
  * **On Hand / On Order Buttons:**  
    * **Presence:** `[On Hand]` and `[On Order]` buttons are clearly visible and tappable for **each item line**.  
    * **Interaction:** (Same as PR Approval \- Page 9\) Tapping opens read-only, mobile-optimized overlays with relevant stock details and the item's **BU Label**. Access is audit-logged.  
  * **Comments (Optional):** Icon/button to add text notes for discrepancies or observations.  
  * **Photo Attachment (Optional):** Icon/button to attach a photo.  
* **Visual Cue for Checked Items:** Items that have had their "Actual Count" entered should be visually distinct (e.g., greyed out slightly, checkmark icon) to help user track progress within the list.

**14.4. Session Persistence & Compliance**

* **Pause/Resume:** The app must support pausing the spot check (e.g., user navigates away or app is backgrounded) and resuming from the same state with all entered data preserved. "Save Progress" button reinforces this.  
* **Locked List:** The UI must make it clear that the list of items is fixed for this session. No adding/removing items.  
* **Progress Visibility:** Continuously updated progress indicator reinforces the requirement to check all items.

**14.5. Footer Action Buttons**

* **"Save Progress" (if manual save is implemented, otherwise auto-save on field change/navigation).**  
* **"Submit Spot Check":** Enabled only when an "Actual Count" has been entered for **all items** in the list. Navigates to the Finalize/Confirmation screen (Page 15).

**14.6. Global UI Rules Adherence**

* **SKU-First, BU Label (on overlays).**  
* **On Hand/On Order Buttons:** Present and functional.

---

**Page 15: Spot Check Module: Submission & Finalization (UX/UI Guide)**

**15.1. Screen Purpose**

* To provide a final confirmation before submitting the completed spot check and to display a summary of the results, particularly any discrepancies found.

**15.2. Header Section**

* **Navigation:** "Back" button (likely returns to the "Conduct Spot Check" screen \- Page 14, if edits are still permitted before final submit, though typically this stage is post-completion of counts).  
* **Title:** "Finalize Spot Check: \[Location Name\]" or "Spot Check Summary".

**15.3. Confirmation Summary**

* **Reiteration of Scope:**  
  * Location Checked.  
  * Item Selection Method Used (Random, High Value, Manual).  
  * Number of Items Checked.  
* **Discrepancy Overview:**  
  * Total number of items with discrepancies.  
  * Total value of discrepancies (if calculated).  
  * A list or summary of items with notable variances (Actual Count vs. System Quantity). This might highlight:  
    * SKU, Product Name  
    * System Qty, Actual Count, Variance  
    * Any comments/photos logged for these items.  
* **User Acknowledgment (If Required):**  
  * If business rules require it, there might be a checkbox like "I confirm the accuracy of the counts entered."

**15.4. Action Button**

* **"Submit Spot Check Results" / "Finalize Spot Check" Button:**  
  * This is the definitive submission action.  
  * **Confirmation Modal:** Crucial. "Are you sure you want to submit this spot check? Once submitted, results cannot be changed."  
* **Post-Submission:**  
  * Display a clear success message (e.g., "Spot Check submitted successfully\!").  
  * The session status updates.  
  * User is typically navigated back to the Dashboard or a list of their spot check sessions, with the just-completed one showing its new status.

**15.5. Audit & Compliance Note**

* The UI should reinforce that this submission is a formal record. The system logs: method of selection, full item list, progress, entry per item, submit action, user, device, time. The locked list and visible progress throughout the "Conduct" phase contribute to compliance.

---

**Page 16: Notification Module: List & System Alerts (UX/UI Guide)**

**16.1. Access & Purpose**

* **Access Point:** Primarily via a "bell" icon on the Dashboard/Home page (Page 3). A badge on the icon indicates the number of new/unread notifications.  
* **Purpose:** To inform users of timely, actionable events or alerts relevant to their role and tasks, primarily focusing on PR approval workflows as per FRD.

**16.2. Notification List View (Accessed by tapping bell icon)**

* **Layout:** A chronological list of notifications, newest first.  
* **Notification Item Display (per notification):**  
  * **Icon:** Relevant to notification type (e.g., PR icon, alert icon).  
  * **Context/Title:** Clear summary (e.g., "PR \#12345 requires your approval," "PR \#67890 has been returned").  
  * **Details:** Brief summary of key info (e.g., Requestor, Outlet, Value).  
  * **Business Unit (BU) Label:** The BU associated with the PR/event, displayed as a non-interactive reference.  
  * **Timestamp:** When the notification was generated.  
  * **Read/Unread Indicator:** Visually distinguish unread notifications (e.g., bold text, colored dot).  
* **Interaction:**  
  * **Tap Action:** Tapping a notification directly navigates the user to the relevant screen. For PRs, this is the PR Approval screen (Page 9), pre-loaded with the specific PR.  
  * **Mark as Read/Unread:** Implied by tapping (marks as read). May have swipe actions or a "Mark all as read" option.  
  * **Dismiss/Archive:** Swipe actions or an explicit "Dismiss" or "Archive" button per notification, or for older notifications. (FRD mentions "user-dismissable or archivable").  
* **Empty State:** "No new notifications."

**16.3. Trigger Events (as per FRD)**

* A PR requires user approval.  
* A PR is returned or rejected (and the user is the recipient of this status change, e.g., the requestor).

**16.4. System Alerts (Real-time attention)**

* **Visual:** These are distinct from the notification list and are for more immediate attention.  
  * **Toasts/Snackbars:** Brief, auto-dismissing messages at the bottom or top of the screen for less critical, informational alerts.  
  * **Banners:** More persistent, non-modal alerts at the top of the screen, requiring user dismissal for critical system messages (e.g., "Offline mode active, data will sync later").  
* **Content:** Similar to list notifications but very concise for quick understanding. May also offer a quick action button (e.g., "View PR").  
* **FRD Context:** "System alerts may also be used for real-time attention." This could apply to new, high-priority PRs needing approval.

**16.5. User Actions & State Management**

* Notification queue persists chronologically and reflects real-time state.  
* Read/unread status is synced.  
* Dismissed/archived notifications are removed from the main list but may be accessible in an "Archived" view if implemented.

**16.6. Audit & Traceability**

* System logs: notification delivery (user, device, time, event), user taps (navigation), dismissals, mark as read/archived actions.

---

**Page 17: Profile & Settings (UX/UI Guide)**

**17.1. Screen Purpose**

* To allow users to view their personal information, app-related settings, assigned roles/BUs, and perform actions like logging out or changing their password (if applicable).

**17.2. Layout**

* Typically a list-based layout with sections for different types of information and actions.  
* **Header:** "Profile & Settings" or User's Name.

**17.3. Information Display Sections (Read-Only)**

* **Personal Information:**  
  * User's Name  
  * Email Address  
  * Employee ID (if applicable)  
* **Role & Permissions:**  
  * Current System Role(s) (e.g., "Receiving Clerk," "PR Approver \- HOD").  
* **Business Unit Assignments:**  
  * A list of all Business Units (BUs) the user is currently assigned to and authorized for within the app. Displayed as a simple list of BU names/codes. **This is purely informational; no selection or interaction possible.**  
* **Linked Analytics Dimensions (Optional, if enabled by config):**  
  * Display any default or linked analytics dimensions associated with the user's profile (e.g., "Default Department: Food & Beverage").  
* **App Information:**  
  * App Version Number  
  * Links to "Privacy Policy," "Terms of Service," "Help/Support."

**17.4. Actionable Settings**

* **Change Password:**  
  * **Presence:** Only if the authentication method is email/password and not solely SSO.  
  * **Interaction:** Tapping navigates to a separate screen with fields for "Current Password," "New Password," "Confirm New Password." Standard password strength indicators and validation.  
* **Manage Preferences (If any mobile-specific preferences exist):**  
  * E.g., Notification preferences (enable/disable specific types of push notifications, if granular control is offered beyond OS settings).  
  * Theme (Light/Dark mode, if supported).  
* **Log Out:**  
  * **Button:** Clearly labeled "Log Out."  
  * **Confirmation:** Prompts "Are you sure you want to log out?" before proceeding.  
  * **Action:** Clears session, navigates to Login screen (Page 2).

**17.5. No Business Unit Selection**

* Crucially, this screen (like all others) **does not offer any way to select, change, or switch Business Units.** The BU assignment list is for user information only.

**17.6. Audit**

* All updates or system actions originating from this screen (e.g., password change attempt/success, logout) are recorded in the audit log.

