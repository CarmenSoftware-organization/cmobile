# UI Components Module

## Overview
The UI Components module provides a comprehensive set of reusable, accessible, and mobile-optimized components for the Carmen Supply Chain application. Built with React, TypeScript, and Tailwind CSS, these components ensure consistent design and user experience across the application.

## Location
- **Primary Module**: `src/components/ui/`
- **Form Components**: `src/components/forms/`
- **Screen Components**: `src/components/screens/`

## Component Categories

### 1. Core UI Components
- **Button**: Primary action component with variants
- **Input**: Form input with validation support
- **Card**: Content container with consistent styling
- **Badge**: Status and label indicators
- **Dialog**: Modal dialogs and overlays

### 2. Navigation Components
- **AppBar**: Top navigation bar
- **Tabs**: Tab navigation component
- **Dropdown Menu**: Context menus and selections

### 3. Data Display Components
- **Loading Indicator**: Loading states and spinners
- **Scroll Area**: Custom scrollable containers
- **Calendar**: Date selection component
- **File Attachments**: File upload and display

### 4. Brand Components
- **Logo**: Application logo component
- **Carmen Logo**: Brand-specific logo
- **Business Unit Label**: Business unit indicators

### 5. Theme Components
- **Theme Provider**: Theme context management
- **Theme Toggle**: Dark/light mode switcher
- **Safe Image**: Optimized image component

## Core Components

### Button Component
```typescript
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

**Features:**
- Multiple variants for different use cases
- Size variations for different contexts
- Accessibility support with proper ARIA attributes
- Loading states and disabled states
- Touch-optimized for mobile devices

### Input Component
```typescript
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}
```

**Features:**
- Form validation integration
- Error state styling
- Placeholder text support
- Disabled and readonly states
- Mobile keyboard optimization

### Card Component
```typescript
interface CardProps {
  className?: string;
  children: React.ReactNode;
}
```

**Features:**
- Consistent spacing and borders
- Shadow and elevation effects
- Responsive design
- Dark mode support
- Nested component support (CardHeader, CardContent, CardFooter)

### Badge Component
```typescript
interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  children: React.ReactNode;
}
```

**Features:**
- Status indication
- Color-coded variants
- Size variations
- Icon support
- Accessibility compliance

## Navigation Components

### AppBar Component
```typescript
interface AppBarProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}
```

**Features:**
- Fixed positioning
- Dynamic title display
- Action button support
- Responsive design
- Safe area handling

### Tabs Component
```typescript
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}
```

**Features:**
- Keyboard navigation
- Controlled and uncontrolled modes
- Custom styling support
- Accessibility compliance
- Mobile-optimized touch targets

## Specialized Components

### Business Unit Label
```typescript
interface BusinessUnitLabelProps {
  businessUnit: string;
  className?: string;
}
```

**Features:**
- Consistent business unit display
- Color-coded identification
- Responsive text sizing
- Truncation for long names

### Feature Card
```typescript
interface FeatureCardProps {
  title: string;
  href: string;
  count?: number;
  className?: string;
}
```

**Features:**
- Dashboard navigation cards
- Count badges for notifications
- Touch-optimized design
- Consistent spacing and styling

### Loading Indicator
```typescript
interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}
```

**Features:**
- Multiple size variants
- Customizable loading text
- Smooth animations
- Accessibility support

## Form Components

### GRN Form Component
```typescript
interface GRNFormProps {
  mode: "create" | "view" | "edit";
  initialData?: Partial<GRNFormData>;
  onSubmit?: (data: GRNFormData) => void;
  onCancel?: () => void;
}
```

**Features:**
- Multi-mode operation (create, view, edit)
- Form validation
- Auto-save capabilities
- Mobile-optimized input fields
- Business logic integration

## Theme System

### Theme Provider
```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "dark" | "light" | "system";
  storageKey?: string;
}
```

**Features:**
- System theme detection
- Persistent theme storage
- Smooth theme transitions
- CSS variable management

### Theme Toggle
```typescript
interface ThemeToggleProps {
  className?: string;
}
```

**Features:**
- One-click theme switching
- Visual feedback
- Accessibility support
- Icon-based interface

## Accessibility Features

### ARIA Support
- Proper ARIA labels and descriptions
- Role attributes for semantic meaning
- Live regions for dynamic content
- Focus management

### Keyboard Navigation
- Tab order optimization
- Keyboard shortcuts
- Focus indicators
- Escape key handling

### Screen Reader Support
- Descriptive text for complex components
- Status announcements
- Proper heading hierarchy
- Alternative text for images

## Mobile Optimization

### Touch Targets
- Minimum 44px touch targets
- Proper spacing between interactive elements
- Touch feedback animations
- Gesture support

### Responsive Design
- Mobile-first approach
- Flexible layouts
- Optimized typography
- Safe area handling

### Performance
- Lazy loading for heavy components
- Optimized re-renders
- Efficient event handling
- Memory management

## Styling System

### Tailwind CSS Integration
- Utility-first approach
- Consistent spacing scale
- Color system integration
- Responsive breakpoints

### CSS Variables
- Theme-aware colors
- Dynamic property updates
- Smooth transitions
- Cross-browser compatibility

### Component Variants
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // ... more variants
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
  }
);
```

## Component Composition

### Compound Components
Many components support compound patterns:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

### Slot Pattern
Components support the slot pattern for flexible composition:

```tsx
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

## Usage Examples

### Basic Button Usage
```tsx
import { Button } from "@/components/ui/button";

<Button variant="outline" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

### Form with Validation
```tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

<form onSubmit={handleSubmit}>
  <Input
    type="email"
    placeholder="Enter email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <Button type="submit">Submit</Button>
</form>
```

### Status Badge
```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant={status === "approved" ? "default" : "destructive"}>
  {status}
</Badge>
```

## Testing Considerations

### Component Testing
- Unit tests for individual components
- Integration tests for compound components
- Accessibility testing
- Visual regression testing

### Test Utilities
- Custom render functions
- Mock providers
- Test data factories
- Accessibility testing helpers

## Performance Optimization

### Bundle Size
- Tree shaking for unused components
- Dynamic imports for heavy components
- Minimal CSS output
- Icon optimization

### Runtime Performance
- Memoization for expensive calculations
- Efficient re-render strategies
- Event delegation
- Virtual scrolling for lists

## Future Enhancements

### Component Additions
- Data table component
- Rich text editor
- Chart components
- Advanced form controls

### Accessibility Improvements
- Enhanced screen reader support
- Voice navigation
- High contrast mode
- Reduced motion preferences

### Mobile Features
- Gesture recognition
- Haptic feedback
- Native app integration
- Offline support

## Dependencies
- React for component structure
- TypeScript for type safety
- Tailwind CSS for styling
- Radix UI for accessible primitives
- Lucide React for icons
- Class Variance Authority for variant management
- React Icons for additional icons