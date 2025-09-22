# GRN Detail Page — Screen Layout Description

## Architecture Changes

**Note**: The separate PO Detail view (`/receiving/[poId]`) has been removed from the application. The main functionality of that view (Resume Draft GRN) has been consolidated into the Pending POs list header for better user experience and reduced navigation complexity.

### Business Unit Selection Bypass

**New Feature**: When creating a new GRN from the Pending POs page:
- **Condition**: A specific Business Unit must be selected (not "All")
- **Flow**: New GRN button routes directly to `/receiving/new` bypassing `/receiving/select-bu`
- **Implementation**: 
  - Selected BU is stored in sessionStorage
  - BU passed as URL parameter: `bu=SelectedBusinessUnit`
  - New GRN page automatically recognizes and uses the pre-selected BU
- **Benefits**: 
  - Eliminates redundant BU selection step
  - Maintains context from filter selection
  - Streamlined user experience with one less screen

### Resume Draft GRN Functionality
- **Location**: Now displayed as a banner in the Pending POs list header (`/receiving/pending-pos`)
- **Trigger**: Shows when any draft GRNs exist in the system
- **Content**: Lists all draft GRNs with their linked PO numbers, creation dates, and resume buttons
- **Benefits**: 
  - Eliminates unnecessary navigation steps
  - Provides immediate visibility of draft work
  - Maintains context within the PO workflow

## GRN Detail Layout Structure

## 1. Header Section
- **Back Button:** Top left, allows user to return to the previous screen.
- **GRN Number & Status:** Prominently displayed (e.g., "GRN 12345" with a status badge such as Draft, Received, or Committed).
- **Business Unit:** Displayed as a non-editable label (either in the header or just below).

## 2. GRN Information Card
- **Created Date:** Shows when the GRN was created.
- **Received Date:** (If available) Shows when the goods were received.

## 3. GRN Form Section (Card)
- **Ref# and Date:** Read-only or editable fields for reference number and date.
- **Invoice Date and Invoice #:** Input fields for invoice details.
- **Description:** Text area for additional notes or description.
- **Receiver and Vendor:** Input/select fields for the person/department receiving and the vendor.
- **Consignment & Cash Payment:** Checkbox options.
- **Currency & Exchange Rate:** Dropdown and input for currency and rate.

## 4. Tab Navigation (Below Form)
- **Tabs:**  
  - Items (default)
  - Summary
  - Comments

## 5. Tab Content

### a. Items Tab
- **Section Title:** "Items by Location"
- **Add PO Button:** Allows adding more POs to the GRN.
- **Grouped Item List:**  
  - **Location Header:** Each group of items is organized by receiving location, with a header showing the location name and item count.
  - **Item Card (for each item):**
    - Product Name (prominent)
    - SKU and PO Number (subtext)
    - Ordered and Remaining Quantities
    - Editable fields for:
      - Received Qty (input)
      - Received Unit (dropdown)
      - FOC Qty (input)
      - FOC Unit (dropdown)
    - Comment (if present)
    - "Detail >" button to open the item detail dialog

### b. Summary Tab
- **Financial Summary Table:**  
  - Subtotal
  - Discount
  - Net Amount
  - Extra Cost
  - Tax Amount
  - Grand Total  
  (All values shown in both transaction currency and base currency)

### c. Comments Tab
- **Comments & Attachments:**  
  - List of comments (chat-style)
  - Ability to add new comments and attach files/photos

## 6. Fixed Footer
- **Save Draft Button:** Fixed at the bottom, allows saving the current GRN as a draft.

## 7. Modals (Contextual)
- **On Hand Modal:** Shows on-hand inventory by location for a selected item.
- **On Order Modal:** Shows pending purchase orders for a selected item.
- **Price Compare Modal:** Shows historical price comparison for a selected item.

---

**Notes:**
- All fields and actions are optimized for mobile (large touch targets, clear labels).
- Business Dimensions are not shown in the item rows but may be available in the item detail dialog.
- All tax and discount fields are read-only.
- The page is visually grouped using cards and clear section headers for easy navigation.

If you need a visual wireframe or want this in a different format (e.g., for handoff to design), let me know!