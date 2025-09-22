# TASK-UI-001: Implement Core UI Components

## Overview
Implement a comprehensive set of core UI components that provide the foundation for all user interfaces in the Carmen Supply Chain Mobile Application. These components will ensure consistency, accessibility, and mobile optimization across the entire application.

## Priority
**High** - Foundation components required by all modules

## Estimated Effort
**12-16 hours**

## Dependencies
- None (foundation task)

## Requirements

### Functional Requirements
Based on [UI Components Module](../modules/ui-components.md) and existing component structure:

1. **Core Layout Components**
   - AppBar with navigation and actions
   - Mobile-optimized navigation drawer
   - Page layouts with proper spacing
   - Card containers for content grouping
   - Responsive grid systems

2. **Form Components**
   - Input fields with validation states
   - Select dropdowns with search
   - Buttons with loading states
   - Checkboxes and radio buttons
   - File upload components
   - Form validation and error display

3. **Data Display Components**
   - Tables with mobile responsiveness
   - Lists with touch interactions
   - Badges and status indicators
   - Progress bars and loading indicators
   - Empty states and placeholders

4. **Feedback Components**
   - Toast notifications
   - Modal dialogs
   - Confirmation dialogs
   - Loading overlays
   - Error boundaries

5. **Navigation Components**
   - Tab navigation
   - Breadcrumbs
   - Pagination
   - Bottom navigation for mobile
   - Quick action buttons

### Technical Requirements

1. **Component Architecture**
   - Built on Radix UI primitives for accessibility
   - TypeScript with strict type checking
   - Tailwind CSS for styling
   - Mobile-first responsive design
   - Compound component patterns where appropriate

2. **Accessibility Standards**
   - WCAG 2.1 AA compliance
   - Keyboard navigation support
   - Screen reader compatibility
   - Focus management
   - ARIA attributes

3. **Mobile Optimization**
   - Touch-friendly interaction targets (minimum 44px)
   - Responsive breakpoints
   - Gesture support where appropriate
   - Performance optimization for mobile devices
   - Offline-friendly design patterns

## Implementation Details

### Component Structure

```
src/components/ui/
├── layout/
│   ├── appbar.tsx
│   ├── navigation-drawer.tsx
│   ├── page-layout.tsx
│   └── card.tsx
├── forms/
│   ├── input.tsx
│   ├── button.tsx
│   ├── select.tsx
│   ├── checkbox.tsx
│   ├── radio.tsx
│   └── file-upload.tsx
├── data-display/
│   ├── table.tsx
│   ├── list.tsx
│   ├── badge.tsx
│   ├── progress.tsx
│   └── empty-state.tsx
├── feedback/
│   ├── toast.tsx
│   ├── dialog.tsx
│   ├── loading.tsx
│   └── error-boundary.tsx
└── navigation/
    ├── tabs.tsx
    ├── breadcrumbs.tsx
    ├── pagination.tsx
    └── bottom-nav.tsx
```

### Core Layout Components

#### 1. AppBar Component
```typescript
// src/components/ui/layout/appbar.tsx
import { cn } from '@/lib/utils';
import { Button } from '../forms/button';
import { Menu, ArrowLeft, MoreVertical } from 'lucide-react';

interface AppBarProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export function AppBar({
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  showMenuButton = false,
  onMenuClick,
  actions,
  className,
}: AppBarProps) {
  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        className
      )}
    >
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="h-9 w-9 p-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="h-9 w-9 p-0"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 px-4">
          <h1 className="text-lg font-semibold truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </header>
  );
}
```

#### 2. Card Component
```typescript
// src/components/ui/layout/card.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-card text-card-foreground',
          {
            'shadow-sm': variant === 'default',
            'border-2': variant === 'outlined',
            'shadow-md': variant === 'elevated',
            'p-0': padding === 'none',
            'p-3': padding === 'sm',
            'p-4': padding === 'md',
            'p-6': padding === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

### Form Components

#### 1. Enhanced Button Component
```typescript
// src/components/ui/forms/button.tsx
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading && loadingText ? loadingText : children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

#### 2. Enhanced Input Component
```typescript
// src/components/ui/forms/input.tsx
import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    success, 
    hint, 
    leftIcon, 
    rightIcon, 
    showPasswordToggle = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type;

    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              {
                'pl-10': leftIcon,
                'pr-10': rightIcon || showPasswordToggle || hasError || hasSuccess,
                'border-destructive focus-visible:ring-destructive': hasError,
                'border-green-500 focus-visible:ring-green-500': hasSuccess,
              },
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {hasError && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            {hasSuccess && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
            {rightIcon && !showPasswordToggle && !hasError && !hasSuccess && rightIcon}
          </div>
        </div>
        
        {(error || success || hint) && (
          <div className="text-sm">
            {error && (
              <p className="text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {success}
              </p>
            )}
            {hint && !error && !success && (
              <p className="text-muted-foreground">{hint}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

### Data Display Components

#### 1. Badge Component
```typescript
// src/components/ui/data-display/badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
        warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-600',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
```

#### 2. Loading Indicator Component
```typescript
// src/components/ui/feedback/loading.tsx
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingIndicator({ 
  size = 'md', 
  text, 
  className 
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, text, children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingIndicator size="lg" text={text} />
        </div>
      )}
    </div>
  );
}
```

### Mobile-Specific Components

#### 1. Bottom Navigation
```typescript
// src/components/ui/navigation/bottom-nav.tsx
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export function BottomNav({ items, className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50',
      'safe-area-inset-bottom', // For devices with home indicator
      className
    )}>
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-1 rounded-lg transition-colors',
                'touch-manipulation', // Optimize for touch
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

#### 2. Touch-Optimized List
```typescript
// src/components/ui/data-display/touch-list.tsx
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface TouchListItem {
  id: string;
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

interface TouchListProps {
  items: TouchListItem[];
  className?: string;
  showDividers?: boolean;
  showChevrons?: boolean;
}

export function TouchList({ 
  items, 
  className, 
  showDividers = true, 
  showChevrons = true 
}: TouchListProps) {
  return (
    <div className={cn('divide-y divide-border', className)}>
      {items.map((item, index) => (
        <TouchListItem
          key={item.id}
          item={item}
          showDivider={showDividers && index < items.length - 1}
          showChevron={showChevrons && (item.onClick || item.href)}
        />
      ))}
    </div>
  );
}

interface TouchListItemProps {
  item: TouchListItem;
  showDivider?: boolean;
  showChevron?: boolean;
}

function TouchListItem({ item, showChevron }: TouchListItemProps) {
  const content = (
    <div className={cn(
      'flex items-center gap-3 p-4 min-h-[60px]', // Minimum touch target
      'touch-manipulation', // Optimize for touch
      (item.onClick || item.href) && 'hover:bg-accent active:bg-accent/80 cursor-pointer'
    )}>
      {item.leftIcon && (
        <div className="flex-shrink-0">
          {item.leftIcon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{item.title}</div>
        {item.subtitle && (
          <div className="text-sm text-muted-foreground truncate">
            {item.subtitle}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        {item.badge}
        {item.rightIcon}
        {showChevron && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </div>
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {content}
      </Link>
    );
  }

  if (item.onClick) {
    return (
      <button onClick={item.onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}
```

## Testing Requirements

### Unit Tests
```typescript
describe('Core UI Components', () => {
  describe('Button Component', () => {
    test('should render with correct variants')
    test('should show loading state')
    test('should handle click events')
    test('should be disabled when loading')
  })

  describe('Input Component', () => {
    test('should render with label and hint')
    test('should show error state')
    test('should show success state')
    test('should toggle password visibility')
  })

  describe('Card Component', () => {
    test('should render with different variants')
    test('should apply correct padding')
    test('should render header, content, and footer')
  })

  describe('Badge Component', () => {
    test('should render with different variants')
    test('should show icon when provided')
    test('should apply correct sizes')
  })
})
```

### Accessibility Tests
```typescript
describe('Accessibility', () => {
  test('components should have proper ARIA attributes')
  test('components should support keyboard navigation')
  test('components should have sufficient color contrast')
  test('components should work with screen readers')
})
```

### Mobile Tests
```typescript
describe('Mobile Optimization', () => {
  test('components should have touch-friendly targets')
  test('components should be responsive')
  test('components should work on various screen sizes')
  test('components should support touch gestures')
})
```

## Acceptance Criteria

### Core Functionality
- [ ] All components render correctly with proper styling
- [ ] Components support all specified variants and sizes
- [ ] Form components handle validation states properly
- [ ] Loading states work correctly
- [ ] Error handling is implemented

### Accessibility
- [ ] All components meet WCAG 2.1 AA standards
- [ ] Keyboard navigation works properly
- [ ] Screen reader compatibility is ensured
- [ ] Focus management is implemented
- [ ] Color contrast meets requirements

### Mobile Optimization
- [ ] Touch targets are minimum 44px
- [ ] Components are responsive across screen sizes
- [ ] Touch interactions work smoothly
- [ ] Performance is optimized for mobile devices
- [ ] Components work offline

### Integration
- [ ] Components integrate well with existing codebase
- [ ] TypeScript types are properly defined
- [ ] Components are properly documented
- [ ] Storybook stories are created (if applicable)

## Implementation Steps

1. **Setup Component Infrastructure**
   - Configure Tailwind CSS with design tokens
   - Set up component directory structure
   - Create utility functions and helpers

2. **Implement Layout Components**
   - AppBar with navigation
   - Card components
   - Page layout components
   - Grid and spacing utilities

3. **Implement Form Components**
   - Enhanced Button component
   - Input with validation states
   - Select and dropdown components
   - Checkbox and radio components

4. **Implement Data Display Components**
   - Badge and status indicators
   - Loading indicators
   - Progress components
   - Empty state components

5. **Implement Feedback Components**
   - Toast notifications
   - Modal dialogs
   - Error boundaries
   - Loading overlays

6. **Implement Navigation Components**
   - Bottom navigation for mobile
   - Tab navigation
   - Breadcrumbs
   - Touch-optimized lists

7. **Add Mobile Optimizations**
   - Touch gesture support
   - Responsive breakpoints
   - Performance optimizations
   - Accessibility improvements

8. **Testing and Documentation**
   - Unit tests for all components
   - Accessibility testing
   - Mobile testing
   - Component documentation

## Related Tasks
- All other tasks depend on these core components
- TASK-THEME-001: Theme System (integrates with these components)
- TASK-UI-002: Form Components (extends these components)
- TASK-UI-003: Mobile-Optimized Components (builds on these components)

## Notes
- These components form the foundation of the entire UI system
- Focus on accessibility and mobile optimization from the start
- Ensure consistent design language across all components
- Plan for future component additions and modifications
- Consider performance implications for mobile devices