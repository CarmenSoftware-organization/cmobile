# Mobile Application GRN Detail Page UI/UX Specification

## Introduction

This document defines the user experience goals, information architecture, user flows, and visual design specifications for the Mobile Application's GRN Detail Page. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

### Overall UX Goals & Principles

### Target User Personas

-   **Receiving Clerk:** Primary user responsible for recording received goods, verifying quantities, and managing GRN details.
-   **Inventory Manager:** User who might review GRNs for accuracy and financial implications.

### Usability Goals

-   **Efficiency of Data Entry:** Allow quick and accurate entry of received quantities and other GRN details.
-   **Clarity of Information:** Present GRN and item details in an easy-to-understand format.
-   **Error Prevention & Recovery:** Guide users to prevent common data entry errors and provide clear feedback for corrections.
-   **Seamless Workflow:** Integrate smoothly with PO selection and GRN confirmation processes.

### Design Principles

1.  **Data Integrity:** Prioritize accurate and complete data capture.
2.  **Action-Oriented:** Clearly present actions users can take (e.g., edit quantity, add PO, save).
3.  **Contextual Information:** Provide relevant details (e.g., ordered quantity, remaining) alongside input fields.
4.  **Mobile-First:** Optimize layout and interactions for small screens and touch input.
5.  **Feedback Rich:** Provide immediate visual feedback for user actions and data changes.

### Change Log

| Date       | Version | Description          | Author |
| :--------- | :------ | :------------------- | :----- |
| 2025-06-28 | 1.0     | Initial draft        | Sally  |

## Information Architecture (IA)

### Site Map / Screen Inventory

```mermaid
graph TD
    A[GRN Detail Page] --> B[GRN Confirmation Page]
    A --> C[PO Selection Page (Add PO)]
    A --> D[GRN Item Detail Page]
    A --> E[Previous Page (Back Button)]
```

### Navigation Structure

**Primary Navigation:** The page is accessed from GRN lists or PO selection flows. Navigation within the page is via tabs (Items, Summary, Comments).

**Secondary Navigation:** Links to specific item details or to add new POs.

**Breadcrumb Strategy:** Not explicitly present, but a back button allows return to the previous screen in the flow.

## User Flows

### View GRN Details

**User Goal:** Understand the current state and details of a GRN.

**Entry Points:** Selecting an existing GRN from a list, or arriving from a PO selection flow to create a new GRN.

**Success Criteria:** User can view all relevant GRN header information, item details, financial summary, and comments/attachments.

#### Flow Diagram

```mermaid
graph TD
    Start[GRN Detail Page] --> ViewHeader[View GRN Header (Number, Status, BU)]
    ViewHeader --> ViewInfo[View GRN Information (Vendor, Date, Invoice#)]
    ViewInfo --> SelectTab{Select Tab}
    SelectTab -->|Items| ViewItems[View Items by Location]
    SelectTab -->|Summary| ViewSummary[View Financial Summary]
    SelectTab -->|Comments| ViewComments[View Comments & Attachments]
```

**Edge Cases & Error Handling:**

-   **No GRN Data:** If no GRN ID is provided or found, the page defaults to "Create GRN" mode.

**Notes:** The page dynamically adjusts its display based on whether an existing GRN is being viewed/edited or a new one is being created.

### Manage GRN Items

**User Goal:** Accurately record received quantities and manage GRN line items.

**Entry Points:** "Items" tab on the GRN Detail Page.

**Success Criteria:** User can update quantities, units, and delete items as needed.

#### Flow Diagram

```mermaid
graph TD
    A[Items Tab] --> B{Select Item}
    B --> C[Adjust Received Qty (+/- or Input)]
    C --> D[Adjust FOC Qty (+/- or Input)]
    D --> E[Select Received Unit]
    E --> F[Select FOC Unit]
    F --> G[View Item Comment (if any)]
    G --> H{Action on Item}
    H -->|Delete| I[Confirm Deletion]
    I --> J[Item Removed]
    H -->|Detail| K[Navigate to Item Detail Page]
    A --> L[Click "+ Add PO"]
    L --> M[Navigate to PO Selection Page]
```

**Edge Cases & Error Handling:**

-   **Invalid Quantity:** Input fields should prevent negative numbers. Validation on save should ensure quantities are reasonable.
-   **Deletion Confirmation:** A confirmation dialog prevents accidental item deletion.

**Notes:** Grouping items by location enhances usability for large GRNs.

### Submit GRN

**User Goal:** Finalize and save the GRN.

**Entry Points:** "Save" button at the bottom of the GRN Detail Page.

**Success Criteria:** GRN data is saved, and the user is navigated to a confirmation page.

#### Flow Diagram

```mermaid
graph TD
    A[GRN Detail Page] --> B[Click "Save" Button]
    B --> C{Validate All Fields}
    C -->|Invalid| D[Show Validation Errors]
    D --> A
    C -->|Valid| E[Process GRN Data]
    E --> F[Navigate to GRN Confirmation Page]
```

**Edge Cases & Error Handling:**

-   **Missing Required Fields:** Display clear error messages for empty required fields (e.g., Vendor, Date).
-   **Backend Error:** Display a generic error message if the save operation fails.

**Notes:** The confirmation page provides a summary of the newly created/updated GRN.

## Wireframes & Mockups

**Primary Design Files:** [Link to Figma/Sketch/Adobe XD file for detailed mockups]

### Key Screen Layouts

#### GRN Detail Page

**Purpose:** Facilitate the creation or detailed review/edit of a Goods Received Note.

**Key Elements:**

-   **Header:** Back button, GRN Number/Status (or "Create GRN" title), Business Unit, Edit/Delete buttons (conditional).
-   **GRN Information Card:** Vendor dropdown, Date picker, GRN# (auto-generated/disabled), Invoice# input, Invoice Date picker, Description textarea, Currency dropdown, Exchange Rate input.
-   **Tab Navigation:** "Items", "Summary", "Comments" tabs.
-   **Items Tab Content:**
    -   "Items by Location" heading and "+ Add PO" button.
    -   Location cards (e.g., "Main Store") with item count.
    -   Item cards: Product name, SKU, PO, Ordered/Remaining Qty, Received Qty input with +/- buttons, Received Unit dropdown, FOC Qty input with +/- buttons, FOC Unit dropdown, Item Comment display, Delete button, Detail link.
-   **Summary Tab Content:** Financial Summary table (Subtotal, Discount, Net Amount, Extra Cost, Tax Amount, Grand Total).
-   **Comments Tab Content:** Comment input area with attachment functionality, list of existing comments.
-   **Fixed Bottom Button:** "Save" button.
-   **Modals (if implemented):** On Hand, On Order, Price Compare (for item details).

**Interaction Notes:**

-   Quantity inputs should allow both direct typing and incremental adjustments.
-   Tab selection should smoothly transition content.
-   "Save" button should provide loading feedback.

**Design File Reference:** [Specific frame link for GRN Detail Page]

## Component Library / Design System

**Design System Approach:** Utilize a consistent mobile-first design system (e.g., based on Shadcn UI components as seen in the code, or Material Design) to ensure a cohesive user experience across the application.

### Core Components

#### Card

**Purpose:** Group related information and provide visual separation.

**Variants:** Standard.

**States:** Default.

**Usage Guidelines:** Used for GRN Information, individual items, and tab content.

#### Button

**Purpose:** Trigger actions.

**Variants:** Primary (Save, Add PO), Outline (Edit), Destructive (Delete), Icon (Quantity +/-).

**States:** Default, Pressed, Disabled, Loading.

**Usage Guidelines:** Clear labels, sufficient tap target size, appropriate visual hierarchy.

#### Input Field (Text, Number, Date, Textarea)

**Purpose:** Allow users to enter data.

**Variants:** Text, Number, Date, Textarea, Select.

**States:** Default, Focused, Disabled, Error.

**Usage Guidelines:** Clear labels, placeholder text, appropriate input types, validation feedback.

#### Tabs

**Purpose:** Organize content into distinct, navigable sections.

**Variants:** Standard.

**States:** Selected, Unselected.

**Usage Guidelines:** Clearly indicate the active tab, provide smooth transitions.

#### CommentsWithAttachments

**Purpose:** Facilitate communication and attachment sharing related to the GRN.

**Variants:** Standard.

**States:** Default, With comments, Empty.

**Usage Guidelines:** Allow text input and file uploads, display comments chronologically.

## Branding & Style Guide

### Visual Identity

**Brand Guidelines:** [Link to overall brand guidelines document]

### Color Palette

| Color Type    | Hex Code            | Usage                            |
| :------------ | :------------------ | :------------------------------- |
| **Primary**   | #007AFF             | Main interactive elements, branding |
| **Secondary** | #6C757D             | Secondary actions, subtle elements |
| **Accent**    | #FFC107             | Highlights, warnings             |
| **Success**   | #28A745             | Positive feedback                |
| **Warning**   | #FFC107             | Cautions                         |
| **Error**     | #DC3545             | Errors, destructive actions      |
| **Neutral**   | #343A40, #6C757D, #ADB5BD, #DEE2E6, #F8F9FA | Text, borders, backgrounds       |
| **Info**      | #007BFF             | Information banners, location headers (e.g., blue-50, blue-200, blue-600, blue-700 as seen in code) |

### Typography

**Font Families:**

-   **Primary:** 'Inter', sans-serif (or similar modern sans-serif)
-   **Secondary:** N/A
-   **Monospace:** 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace

**Type Scale:**
| Element | Size | Weight | Line Height |
|:--------|:-----|:-------|:------------|
| H1      | 28px | 700    | 36px        |
| H2      | 24px | 600    | 32px        |
| H3      | 20px | 500    | 28px        |
| Body    | 16px | 400    | 24px        |
| Small   | 12px | 400    | 18px        |

### Iconography

**Icon Library:** Lucide React (as seen in code: `ChevronLeft`, `MapPin`, `X`, `Trash2`)

**Usage Guidelines:** Use clear, universally recognizable icons. Ensure consistent sizing and styling. Icons should support the primary action or information they represent.

### Spacing & Layout

**Grid System:** Flexible grid system, likely based on Tailwind CSS utilities (e.g., `grid grid-cols-2 gap-4`).

**Spacing Scale:** Based on a 4px or 8px baseline grid (e.g., `p-4`, `space-y-4`, `mb-4`).

## Accessibility Requirements

### Compliance Target

**Standard:** WCAG 2.1 AA

### Key Requirements

**Visual:**

-   **Color contrast ratios:** Minimum 4.5:1 for text and interactive elements. Ensure sufficient contrast for status badges and location headers.
-   **Focus indicators:** Clear visual focus indicators for all interactive elements (buttons, inputs, tabs).
-   **Text sizing:** Users can resize text up to 200% without loss of content or functionality.

**Interaction:**

-   **Keyboard navigation:** All interactive elements are reachable and operable via keyboard (e.g., tab order for form fields, tab navigation for tabs).
-   **Screen reader support:** All elements have appropriate ARIA labels and roles for screen reader interpretation (e.g., `aria-label` for quantity buttons, `role="tab"`, `role="tabpanel"`).
-   **Touch targets:** Minimum 44x44px touch targets for interactive elements, especially buttons and quantity controls.

**Content:**

-   **Alternative text:** Provide descriptive alt text for all meaningful images (e.g., icons if they convey meaning).
-   **Heading structure:** Use semantic heading tags (h1, h2, etc.) to define content hierarchy (e.g., "GRN Information", "GRN Details").
-   **Form labels:** All input fields have associated, visible labels.

### Testing Strategy

Conduct manual accessibility testing with screen readers (VoiceOver, TalkBack) and keyboard navigation. Utilize automated tools (e.g., Lighthouse, Axe DevTools) for initial checks. Pay special attention to dynamic content changes when switching tabs or adding/removing items.

## Responsiveness Strategy

### Breakpoints

| Breakpoint | Min Width | Max Width | Target Devices |
| :--------- | :-------- | :-------- | :------------- |
| Mobile     | 0px       | 767px     | Smartphones    |
| Tablet     | 768px     | 1023px    | Tablets        |
| Desktop    | 1024px    | -         | Desktops       |

### Adaptation Patterns

**Layout Changes:** Primarily a single-column layout for mobile. For larger screens (tablet/desktop), the layout might expand to utilize more horizontal space, but the core form and item list structure will likely remain vertical.

**Navigation Changes:** The tab navigation remains consistent across mobile and larger screens.

**Content Priority:** Critical GRN information and item details are prioritized for visibility on smaller screens.

**Interaction Changes:** Touch-optimized interactions for mobile, with hover states potentially added for desktop.

## Animation & Micro-interactions

### Motion Principles

-   **Subtle & Purposeful:** Animations should enhance understanding, not distract.
-   **Fast & Responsive:** Keep durations short to maintain perceived performance.
-   **Consistent:** Apply similar animation styles across the application.

### Key Animations

-   **Button Click Feedback:** Subtle press down/release animation on button tap (e.g., `transition-colors` on buttons).
-   **Tab Selection:** Smooth transition or highlight change when switching tabs.
-   **Item Deletion:** Visual feedback for item removal (e.g., fade out).
-   **Input Field Focus:** Slight border/shadow change on focus.

## Performance Considerations

### Performance Goals

-   **Page Load:** GRN Detail page loads within 1-2 seconds on a 3G connection, even with multiple items.
-   **Interaction Response:** Input and button interactions respond within 100ms.
-   **Animation FPS:** Maintain 60 FPS for all animations.

### Design Strategies

Optimize data fetching for GRN and PO items. Implement lazy loading for less critical components if necessary. Minimize re-renders for quantity changes. Optimize image sizes for attachments. Ensure efficient state management for GRN items.

## Next Steps

### Immediate Actions

1.  Review this UI/UX specification with relevant stakeholders (Product, Development, QA).
2.  Begin creating high-fidelity visual designs and interactive prototypes in Figma/Sketch/Adobe XD based on this document.
3.  Prepare for handoff to the Design Architect for frontend architecture planning.

### Design Handoff Checklist

-   [ ] All user flows documented
-   [ ] Component inventory complete
-   [ ] Accessibility requirements defined
-   [ ] Responsive strategy clear
-   [ ] Brand guidelines incorporated
-   [ ] Performance goals established

## Checklist Results

[ ] UI/UX Checklist for GRN Detail Page (to be run by QA/UX Expert after review) 
