# Mobile Navigation Module

## Overview
The Mobile Navigation module provides a comprehensive navigation system optimized for mobile devices, featuring a bottom tab navigation, app bar, and responsive layout management for the Carmen Supply Chain application.

## Location
- **Primary Module**: `src/app/(mobile)/layout.tsx`
- **Related Components**: `src/components/ui/appbar.tsx`

## Key Features

### 1. Bottom Tab Navigation
- Fixed bottom navigation bar
- Icon-based navigation with labels
- Active state indication
- Touch-optimized design

### 2. App Bar
- Sticky top navigation
- Dynamic title based on current route
- Action buttons (notifications, profile, theme toggle)
- Responsive design

### 3. Route Management
- Dynamic title generation
- Path-based active state detection
- Sub-route handling
- Breadcrumb-style navigation

### 4. Mobile-First Design
- Touch-friendly interface
- Optimized spacing and sizing
- Safe area handling
- Responsive layout

## Navigation Structure

### Main Navigation Tabs
The application features five primary navigation tabs:

1. **Home** (`/dashboard`)
   - Icon: Home
   - Label: "Home"
   - Main dashboard and summary view

2. **Receiving** (`/receiving`)
   - Icon: Package
   - Label: "Receiving"
   - Full Label: "Receiving"
   - Purchase order and goods receipt management

3. **Approval** (`/pr-approval`)
   - Icon: CheckCircle
   - Label: "Approval"
   - Purchase request approval workflows

4. **Store Req.** (`/store-requisition`)
   - Icon: ShoppingCart
   - Label: "Store Req."
   - Store requisition management

5. **Stock Take** (`/stock-take`)
   - Icon: ClipboardList
   - Label: "Stock Take"
   - Inventory counting and management

### Additional Routes
- **Spot Check** (`/spot-check`) - Quality control spot checks
- **Physical Count** (`/physical-count`) - Physical inventory counting
- **Notifications** (`/notifications`) - System notifications
- **Profile** (`/profile`) - User profile management

## Layout Components

### MobileLayout Component
The main layout wrapper that provides:
- App bar with dynamic title
- Main content area with proper spacing
- Fixed bottom navigation
- Responsive design

### App Bar Features
- Dynamic title based on current route
- Right-side action buttons:
  - Notifications bell icon
  - Theme toggle
  - Profile user icon
- Sticky positioning
- Shadow and border styling

### Bottom Navigation Features
- Fixed positioning at bottom
- Five main navigation tabs
- Active state highlighting
- Icon and label display
- Touch-optimized sizing

## Dynamic Title System

### Title Generation Logic
```typescript
function getTitle(pathname: string) {
  // Check exact path matches first
  const match = tabs.find(tab => tab.href === pathname);
  if (match) return match.fullLabel || match.label;
  
  // Check if path starts with any of the tab paths (for sub-pages)
  const parentMatch = tabs.find(tab => pathname.startsWith(tab.href) && tab.href !== "/dashboard");
  if (parentMatch) return parentMatch.fullLabel || parentMatch.label;
  
  // Add specific handling for spot-check path
  if (pathname.startsWith("/spot-check")) return "Spot Check";
  
  // Add specific handling for physical-count path
  if (pathname.startsWith("/physical-count")) return "Physical Count";
  
  // Default title - empty to show only logo
  return "";
}
```

### Title Hierarchy
1. **Exact Match**: Direct route match
2. **Parent Match**: Sub-route of main navigation
3. **Special Routes**: Custom handling for specific paths
4. **Default**: Empty title shows logo only

## Navigation State Management

### Active State Detection
The navigation system uses Next.js `usePathname()` hook to:
- Detect current route
- Highlight active navigation tab
- Update app bar title
- Handle sub-route navigation

### Path Matching Logic
```typescript
pathname === href || pathname.startsWith(href + "/")
```
This logic ensures:
- Exact path matches are highlighted
- Sub-routes maintain parent tab highlighting
- Consistent navigation state

## Styling and Design

### Color Scheme
- **Active State**: Primary color
- **Inactive State**: Muted foreground color
- **Hover State**: Primary color transition

### Layout Specifications
- **App Bar Height**: 56px (3.5rem)
- **Bottom Navigation Height**: 64px (4rem)
- **Main Content**: Flexible with proper padding
- **Safe Areas**: Handled with padding-bottom

### Responsive Design
- Touch-friendly button sizes
- Optimized spacing for mobile devices
- Proper contrast ratios
- Accessibility considerations

## Component Structure

### Tab Configuration
```typescript
const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/receiving", label: "Receiving", icon: Package, fullLabel: "Receiving" },
  { href: "/pr-approval", label: "Approval", icon: CheckCircle },
  { href: "/store-requisition", label: "Store Req.", icon: ShoppingCart },
  { href: "/stock-take", label: "Stock Take", icon: ClipboardList },
];
```

### Layout Structure
```tsx
<div className="min-h-screen flex flex-col bg-background">
  <AppBar title={title}>
    {/* Action buttons */}
  </AppBar>
  <main className="flex-1 pt-14 pb-16">{children}</main>
  <nav className="fixed bottom-0 left-0 right-0 z-50">
    {/* Navigation tabs */}
  </nav>
</div>
```

## Integration Points

### With Authentication
- Profile link in app bar
- Protected route handling
- User context awareness

### With Theme System
- Theme toggle in app bar
- Consistent styling across themes
- Dark/light mode support

### With Notifications
- Notification bell in app bar
- Badge indicators for unread notifications
- Direct navigation to notifications

## Accessibility Features

### ARIA Labels
- Proper aria-label attributes for navigation items
- Screen reader friendly descriptions
- Semantic HTML structure

### Keyboard Navigation
- Tab order optimization
- Focus management
- Keyboard shortcuts support

### Touch Accessibility
- Minimum touch target sizes (44px)
- Proper spacing between interactive elements
- Visual feedback for touch interactions

## Usage Examples

### Basic Navigation
```tsx
import Link from "next/link";

<Link href="/receiving" className="nav-link">
  <Package className="w-4 h-4" />
  Receiving
</Link>
```

### Dynamic Title Usage
```tsx
const pathname = usePathname();
const title = getTitle(pathname);

<AppBar title={title}>
  {/* App bar content */}
</AppBar>
```

## Performance Considerations

### Optimization Strategies
- Minimal re-renders with proper state management
- Efficient path matching algorithms
- Lazy loading for non-critical components
- Optimized icon rendering

### Bundle Size
- Tree-shaking for unused icons
- Minimal CSS for navigation styles
- Efficient component structure

## Future Enhancements

### Navigation Improvements
- Breadcrumb navigation for deep routes
- Swipe gestures for tab switching
- Navigation history management
- Custom navigation animations

### Accessibility Enhancements
- Voice navigation support
- High contrast mode
- Reduced motion preferences
- Screen reader optimizations

### Performance Optimizations
- Virtual scrolling for long lists
- Progressive loading
- Offline navigation support
- Caching strategies

## Dependencies
- Next.js for routing (`usePathname`, `Link`)
- Lucide React for icons
- Tailwind CSS for styling
- React for component structure
- TypeScript for type safety