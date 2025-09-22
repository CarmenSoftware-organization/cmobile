# Carmen Supply Chain Mobile App - Mobile UI Patterns and Components

## Overview
This document details the mobile-first UI patterns, component architecture, and design system used in the Carmen Supply Chain Mobile App. The app uses a modern React component library built on Radix UI primitives with Tailwind CSS styling.

## Design System Foundation

### Theme System
**File**: `src/components/ui/theme-provider.tsx`

The app implements a comprehensive dark/light theme system:
- **Default Theme**: Dark mode
- **Storage**: Persisted in localStorage as "carmen-theme"
- **System Integration**: Respects user's system preference
- **Smooth Transitions**: CSS transitions for theme switching

```typescript
// Theme configuration
<ThemeProvider defaultTheme="dark" storageKey="carmen-theme">
```

### Color Palette
- **Primary**: Blue (#0F52BA) - Used for branding and primary actions
- **Background**: Adaptive gray scales for dark/light modes
- **Text**: High contrast ratios for accessibility
- **Status Colors**: Green (success), Red (error), Yellow (warning), Blue (info)

### Typography
- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Font Sizes**: Mobile-optimized scale (12px to 24px)
- **Line Heights**: Optimized for mobile reading
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

## Mobile Layout Architecture

### Root Layout Structure
**File**: `src/app/layout.tsx`

```typescript
// Mobile viewport configuration
export const viewport: Viewport = {
  themeColor: "#0F52BA",
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false, // Prevents zoom on form inputs
};
```

**Key Features**:
- PWA-ready with manifest and icons
- Prevents zoom on form inputs for better UX
- Stagewise development toolbar integration
- Global theme provider wrapper

### Mobile Layout Pattern
**File**: `src/app/(mobile)/layout.tsx`

The mobile layout implements a standard mobile app pattern:
- **Fixed Top Bar**: AppBar with title and actions
- **Scrollable Content**: Main content area with proper padding
- **Fixed Bottom Navigation**: 5-tab bottom navigation

```typescript
// Layout structure
<div className="min-h-screen flex flex-col bg-background">
  <AppBar title={title}>...</AppBar>
  <main className="flex-1 pt-14 pb-16">{children}</main>
  <nav className="fixed bottom-0 left-0 right-0 z-50">...</nav>
</div>
```

**Safe Area Handling**:
- `pt-14`: Top padding for fixed AppBar
- `pb-16`: Bottom padding for fixed navigation
- `pb-safe`: Additional padding for devices with home indicators

## Component Library

### Core UI Components
**Location**: `src/components/ui/`

#### AppBar Component
**File**: `src/components/ui/appbar.tsx`

```typescript
interface AppBarProps {
  title?: string;
  children?: React.ReactNode;
}
```

**Features**:
- Fixed positioning with backdrop blur
- Carmen logo integration
- Right-side action slots
- Responsive title handling

#### Button Component
**File**: `src/components/ui/button.tsx`

**Variants**:
- `default`: Primary blue button
- `destructive`: Red for dangerous actions
- `outline`: Border-only button
- `secondary`: Muted background
- `ghost`: No background
- `link`: Text-only link style

**Sizes**:
- `default`: Standard mobile touch target
- `sm`: Compact size
- `lg`: Large touch target
- `icon`: Square icon button

#### Card Component
**File**: `src/components/ui/card.tsx`

Standard card layout with:
- Consistent padding and margins
- Subtle shadows and borders
- Responsive design
- Dark/light theme support

#### Feature Card Component
**File**: `src/components/ui/feature-card.tsx`

Dashboard-specific card for main actions:
- Large touch targets (minimum 44px)
- Count badges for pending items
- Icon integration
- Hover and active states

### Form Components

#### Input Component
**File**: `src/components/ui/input.tsx`

Mobile-optimized form inputs:
- Large touch targets
- Proper keyboard types (numeric, email, etc.)
- Error state styling
- Disabled state handling
- Placeholder text styling

#### Dialog Component
**File**: `src/components/ui/dialog.tsx`

Modal dialogs built on Radix UI:
- Mobile-friendly sizing
- Backdrop blur and overlay
- Keyboard navigation
- Focus management
- Smooth animations

## Navigation Patterns

### Bottom Navigation
**Implementation**: `src/app/(mobile)/layout.tsx`

Five-tab bottom navigation with:
- **Home**: Dashboard overview
- **Receiving**: Purchase order receiving
- **Approval**: PR approval workflows
- **Store Req.**: Store requisition management
- **Stock Take**: Inventory management

**Visual States**:
- Active: Primary color with icon and label
- Inactive: Muted color
- Hover: Smooth color transitions

### Page Title Management
Dynamic title generation based on current route:
```typescript
function getTitle(pathname: string) {
  // Exact path matches
  const match = tabs.find(tab => tab.href === pathname);
  if (match) return match.fullLabel || match.label;
  
  // Parent path matching for sub-pages
  const parentMatch = tabs.find(tab => 
    pathname.startsWith(tab.href) && tab.href !== "/dashboard"
  );
  if (parentMatch) return parentMatch.fullLabel || parentMatch.label;
  
  // Special cases for non-tab routes
  if (pathname.startsWith("/spot-check")) return "Spot Check";
  if (pathname.startsWith("/physical-count")) return "Physical Count";
  
  return ""; // Show only logo
}
```

## Mobile-Specific Patterns

### Touch Target Optimization
- **Minimum Size**: 44px × 44px for all interactive elements
- **Spacing**: Adequate spacing between touch targets
- **Visual Feedback**: Hover and active states for all buttons
- **Gesture Support**: Swipe gestures where appropriate

### Responsive Grid System
```css
/* Mobile-first grid patterns */
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
```

**Common Layouts**:
- 2-column grid for dashboard cards
- Single column for forms and lists
- Flexible layouts that adapt to content

### Loading States
**File**: `src/components/ui/loading-indicator.tsx`

Consistent loading patterns:
- Spinner animations
- Skeleton loading for lists
- Progressive loading for images
- Smooth transitions

### Status Indicators
**File**: `src/components/ui/badge.tsx`

Visual status communication:
- Color-coded status badges
- Count indicators for pending items
- Progress indicators for workflows
- Notification dots

## Form Patterns

### Mobile Form Design
- **Large Input Fields**: Easy touch interaction
- **Proper Keyboard Types**: Numeric, email, tel, etc.
- **Validation Feedback**: Inline error messages
- **Submit Button States**: Loading, disabled, success states

### Common Form Components
```typescript
// Example form pattern
<div className="space-y-4">
  <Input 
    type="number" 
    placeholder="Enter quantity"
    className="text-lg" // Larger text for mobile
  />
  <Button size="lg" className="w-full">
    Submit
  </Button>
</div>
```

## List and Card Patterns

### List Item Design
Standard pattern for list items:
- **Consistent Height**: Minimum 60px for touch targets
- **Clear Hierarchy**: Title, subtitle, metadata
- **Action Buttons**: Right-aligned actions
- **Status Indicators**: Visual status communication

### Card Layout Patterns
```typescript
// Dashboard card pattern
<Card className="p-4 space-y-3">
  <div className="flex items-center justify-between">
    <h3 className="font-semibold">{title}</h3>
    {count > 0 && <Badge>{count}</Badge>}
  </div>
  <p className="text-sm text-muted-foreground">{description}</p>
</Card>
```

## Accessibility Features

### Built-in Accessibility
- **Radix UI Foundation**: All components include proper ARIA attributes
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Focus Management**: Proper focus handling in modals and forms

### Mobile Accessibility
- **Large Touch Targets**: Minimum 44px for all interactive elements
- **High Contrast**: Meets WCAG contrast requirements
- **Reduced Motion**: Respects user's motion preferences
- **Voice Control**: Proper labeling for voice navigation

## Animation and Transitions

### Micro-Interactions
- **Button States**: Hover, active, and focus animations
- **Page Transitions**: Smooth navigation between screens
- **Loading States**: Skeleton loading and spinners
- **Theme Switching**: Smooth color transitions

### Performance Considerations
- **CSS Transforms**: Hardware-accelerated animations
- **Reduced Motion**: Respects user preferences
- **Minimal JavaScript**: CSS-based animations where possible

## Responsive Breakpoints

### Mobile-First Approach
```css
/* Base styles for mobile */
.container { padding: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
}
```

### Component Responsiveness
- **Flexible Grids**: Adapt to screen size
- **Scalable Typography**: Responsive font sizes
- **Adaptive Spacing**: Consistent spacing across devices

## Development Patterns

### Component Structure
```typescript
// Standard component pattern
interface ComponentProps {
  // Props definition
}

export function Component({ ...props }: ComponentProps) {
  // Component logic
  return (
    <div className="mobile-optimized-classes">
      {/* Component content */}
    </div>
  );
}
```

### Styling Conventions
- **Tailwind Classes**: Utility-first approach
- **Component Variants**: Using class-variance-authority
- **Consistent Naming**: BEM-inspired class naming
- **Mobile-First**: Start with mobile styles, enhance for larger screens

This document serves as the comprehensive guide for implementing consistent, accessible, and mobile-optimized UI patterns in the Carmen Supply Chain Mobile App.