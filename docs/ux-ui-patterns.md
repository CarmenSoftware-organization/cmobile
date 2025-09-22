# Carmen Supply Chain Mobile App - UX/UI Patterns Guide

## Overview
This document provides detailed guidance on specific UX/UI patterns used throughout the Carmen Supply Chain Mobile App. It serves as a practical reference for designers and developers implementing consistent user experiences across all modules.

## Mobile-First Interaction Patterns

### Touch Target Optimization
**Minimum Size:** 44px × 44px for all interactive elements
**Spacing:** 8px minimum between adjacent touch targets
**Visual Feedback:** Immediate visual response to touch interactions

```css
/* Touch target standards */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  margin: 4px; /* Ensures 8px spacing between targets */
}
```

### Gesture Support
- **Tap:** Primary interaction for buttons and links
- **Long Press:** Context menus and additional options
- **Swipe:** Navigation between screens and list actions
- **Pull-to-Refresh:** Data refresh in list views
- **Pinch-to-Zoom:** Image viewing (photos, documents)

### One-Handed Operation
- **Bottom Navigation:** Primary actions within thumb reach
- **Floating Action Button:** Quick access to primary actions
- **Reachable Controls:** Critical controls in lower 2/3 of screen
- **Thumb-Friendly Zones:** Most important actions in comfortable reach

## Navigation Patterns

### Bottom Navigation Structure
```typescript
// Navigation configuration
const bottomNavigation = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Package, label: "Receiving", href: "/receiving" },
  { icon: CheckCircle, label: "Approval", href: "/pr-approval" },
  { icon: ShoppingCart, label: "Store Req.", href: "/store-requisition" },
  { icon: ClipboardList, label: "Stock Take", href: "/stock-take" }
];
```

**Visual States:**
- **Active:** Primary color with icon and label
- **Inactive:** Muted color with subtle hover effect
- **Badge:** Red dot or count for pending items

### App Bar Patterns
**Standard App Bar:**
- Left: Back button (when applicable)
- Center: Page title or logo
- Right: Actions (notifications, profile, settings)

**Contextual App Bar:**
- Left: Close/cancel action
- Center: Context-specific title
- Right: Primary action (save, submit, etc.)

### Breadcrumb Strategy
- **Simple Hierarchy:** Page title indicates current location
- **Back Navigation:** Clear path to previous screen
- **Context Preservation:** Maintain user's place in workflow

## List and Card Patterns

### List Item Design
```typescript
// Standard list item structure
interface ListItemProps {
  title: string;
  subtitle?: string;
  metadata?: string;
  status?: StatusType;
  actions?: ActionButton[];
  badge?: number;
}
```

**Visual Hierarchy:**
1. **Primary Text:** Bold, larger font (16px)
2. **Secondary Text:** Regular weight, smaller font (14px)
3. **Metadata:** Muted color, smallest font (12px)
4. **Status Indicators:** Color-coded badges or icons

### Card Layout Patterns
**Dashboard Cards:**
- Large touch targets for primary actions
- Count badges for pending items
- Clear visual hierarchy
- Consistent spacing and alignment

**Detail Cards:**
- Expandable sections for additional information
- Clear separation between sections
- Action buttons at bottom
- Responsive layout for different screen sizes

### Empty States
**No Data Pattern:**
- Friendly illustration or icon
- Clear explanation of why content is empty
- Primary action to add content
- Helpful tips or guidance

```typescript
// Empty state component structure
<EmptyState
  icon={<PackageIcon />}
  title="No Purchase Orders"
  description="You don't have any pending purchase orders to receive."
  action={
    <Button onClick={handleScanPO}>
      Scan Purchase Order
    </Button>
  }
/>
```

## Form Patterns

### Input Field Design
**Standard Input:**
- Large touch targets (minimum 44px height)
- Clear labels and placeholders
- Appropriate keyboard types for mobile
- Real-time validation feedback

**Number Inputs:**
- Numeric keyboard on mobile
- Clear increment/decrement buttons
- Unit indicators where applicable
- Range validation with helpful messages

### Form Validation
**Real-time Validation:**
- Immediate feedback for format errors
- Progressive validation as user types
- Clear success indicators
- Helpful error messages

**Error Handling:**
- Inline error messages below fields
- Error summary at top of form
- Clear indication of required fields
- Guidance on how to fix errors

### Multi-Step Forms
**Progress Indication:**
- Clear step indicators
- Progress bar or step counter
- Ability to navigate between completed steps
- Save progress functionality

## Status and Feedback Patterns

### Status Indicators
**Color Coding:**
- **Green:** Success, approved, completed
- **Blue:** In progress, pending review
- **Yellow:** Warning, requires attention
- **Red:** Error, rejected, failed
- **Gray:** Inactive, disabled, draft

**Badge Patterns:**
```typescript
// Status badge variants
const statusVariants = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-800"
};
```

### Loading States
**Skeleton Loading:**
- Placeholder content that matches final layout
- Smooth animation to indicate loading
- Maintains page structure during load
- Progressive loading for complex content

**Spinner Loading:**
- For quick operations (< 2 seconds)
- Centered in content area
- With descriptive text when appropriate
- Consistent size and animation

### Success Feedback
**Immediate Confirmation:**
- Toast notifications for quick actions
- Success pages for major workflows
- Visual checkmarks and animations
- Clear next steps or actions

## Data Display Patterns

### Currency Display
**Multi-Currency Support:**
```typescript
// Currency display pattern
interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  baseCurrency?: string;
  baseAmount?: number;
  exchangeRate?: number;
}

// Display format: "S$1,200.00 (≈ $888.00 USD)"
```

**Formatting Rules:**
- Primary currency prominent
- Base currency as secondary information
- Exchange rate available on demand
- Consistent decimal places by currency

### Quantity and Units
**Unit Conversion Display:**
- Clear indication of conversion ratios
- Both order and inventory units shown
- Visual separation between different units
- Conversion calculator when needed

**Inventory Levels:**
- On-hand quantities prominently displayed
- On-order quantities as secondary info
- Reorder thresholds with visual indicators
- Historical data available on demand

### Date and Time
**Relative Dates:**
- "Today", "Yesterday", "2 days ago" for recent items
- Full dates for older items
- Consistent format across the application
- Time zones handled appropriately

## Workflow-Specific Patterns

### Approval Workflows
**Item Review Pattern:**
- Clear item information display
- Action buttons (Approve, Reject, Review)
- Reason entry for rejections
- Progress tracking through approval stages

**Batch Actions:**
- Select all/none functionality
- Bulk approve/reject options
- Clear indication of selected items
- Confirmation before bulk actions

### Counting Workflows
**Count Entry Pattern:**
- Large, prominent count input field
- Expected quantity clearly displayed
- Variance calculation and highlighting
- Photo capture for discrepancies

**Session Management:**
- Clear session status indicators
- Progress tracking through count lists
- Auto-save functionality
- Resume capability for interrupted sessions

### Quality Control
**Photo Capture Pattern:**
- Camera integration with fallback
- Multiple photo support
- Photo preview and retake options
- Annotation capabilities

**Notes and Comments:**
- Quick note templates for common issues
- Voice-to-text input support
- Character count for length limits
- Rich text formatting when needed

## Accessibility Patterns

### Screen Reader Support
**Semantic HTML:**
- Proper heading hierarchy
- Descriptive link text
- Form labels and descriptions
- ARIA landmarks and roles

**Focus Management:**
- Logical tab order
- Visible focus indicators
- Skip links for navigation
- Focus restoration after modals

### High Contrast Support
**Color Independence:**
- Information not conveyed by color alone
- Sufficient contrast ratios
- Pattern or texture alternatives
- Icon support for color-coded information

### Motor Accessibility
**Alternative Interactions:**
- Keyboard alternatives for all gestures
- Adjustable timing for interactions
- Large touch targets
- Voice control support

## Performance Patterns

### Lazy Loading
**Progressive Enhancement:**
- Critical content loads first
- Non-critical content loads on demand
- Smooth transitions between states
- Fallback for slow connections

### Offline Support
**Graceful Degradation:**
- Core functionality available offline
- Clear indication of offline status
- Data sync when connection restored
- Conflict resolution for concurrent edits

### Memory Management
**Efficient Rendering:**
- Virtual scrolling for long lists
- Image optimization and lazy loading
- Component unmounting for unused screens
- Memory leak prevention

## Error Handling Patterns

### Network Errors
**Retry Mechanisms:**
- Automatic retry for transient failures
- Manual retry options for users
- Clear error messages
- Offline mode activation

### Validation Errors
**User-Friendly Messages:**
- Plain language explanations
- Specific guidance for fixes
- Context-aware suggestions
- Progressive disclosure of details

### System Errors
**Graceful Failure:**
- Error boundaries to prevent crashes
- Fallback UI for broken components
- Error reporting for debugging
- Recovery options for users

This patterns guide ensures consistent, accessible, and efficient user experiences across all modules of the Carmen Supply Chain Mobile App, supporting both novice and expert users in their daily workflows.